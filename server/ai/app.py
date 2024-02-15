from pydantic import BaseModel
import requests
from PIL import Image
import numpy as np
from skimage.transform import resize
import tensorflow as tf
import shutil
import os
from ultralytics import YOLO
# Load your trained model (replace 'your_model_path' with the actual path)
from keras.models import load_model
from keras.preprocessing.image import ImageDataGenerator


from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from fastapi.responses import FileResponse

print("Current directory:", os.getcwd())
print("Files in current directory:", os.listdir())

cnn_model_path='./Tomato_Model_Export_2'
cnn_model = load_model(cnn_model_path)


model = load_model("./unet_model_2_25_epoch.hdf5", compile=False)
yolo_model = YOLO('./best.pt')

class_names = [
    "Tomato Bacterial spot",
    "Tomato Early blight",
    "Tomato Late blight",
    "Tomato Leaf Mold",
    "Tomato Septoria leaf spot",
    "Tomato Spider mites Two spotted spider mite",
    "Tomato Target Spot",
    "Tomato Tomato YellowLeaf Curl Virus",
    "Tomato Tomato mosaic virus",
    "Early Blight",
    "Tomato healthy"
]   

def predict_single_image_cnn(model, img_path):
    IMAGE_SIZE=256
    img = tf.keras.preprocessing.image.load_img(img_path, target_size=(IMAGE_SIZE, IMAGE_SIZE))
    img_array = tf.keras.preprocessing.image.img_to_array(img)
    img_array = img_array / 255.0  # Normalize pixel values
    img_array = tf.expand_dims(img_array, 0)

    predictions = model.predict(img_array)
    predicted_class_idx = np.argmax(predictions[0])
    predicted_class = class_names[predicted_class_idx]
    confidence = round(100 * np.max(predictions[0]), 2)
    return predicted_class, confidence


def preprocess_image(img_path, img_width=128, img_height=128):
    img = Image.open(img_path)
    img = np.array(img)
    img = resize(img, (img_height, img_width), mode='constant', preserve_range=True)
    return img

def save_result(result, output_path='result.png'):
    # Extract the relevant channel and reshape
    print(result.shape)
    result_channel = result[:, :]

    # Assuming the result is an image (modify this based on your actual output)
    result_img = Image.fromarray((result_channel * 255).astype(np.uint8))

    # Save the image to a file
    result_img.save(output_path)


def main():
    # Get image URL from the user
    try:
        image_url = "./uploaded_photos/uploaded_photo.jpg"

        new_results = yolo_model.predict(image_url, conf=0.2)
        new_result_array = new_results[0].plot()
        predicted_class, confidence = predict_single_image_cnn(cnn_model, image_url)
        
        print(predicted_class, confidence)

        IMG_WIDTH = 128
        IMG_HEIGHT = 128

        img = preprocess_image(image_url, IMG_WIDTH, IMG_HEIGHT)
        img = img.reshape((1,) + img.shape)

        prediction = model.predict(img)

        binary_mask = (prediction > 0.5).astype(np.uint8)
        result = binary_mask.squeeze()

        # Perform inference
        image_yolo = Image.fromarray(np.uint8(new_result_array))

        image_yolo.save('../image.png')

        save_result(result, '../result.png')
        return predicted_class, confidence
    except Exception as e:
        print(e)

app = FastAPI()

# Configure CORS
origins = [
    "http://localhost",
    "http://localhost:3000",  # Allow requests from Express server
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Example route
@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI API!"}

# Directory to store uploaded photos
UPLOAD_DIR = "uploaded_photos"

# Ensure the upload directory exists
os.makedirs(UPLOAD_DIR, exist_ok=True)

class Data(BaseModel):
    photo: UploadFile = File(...)

@app.post("/api/upload")
async def upload_photo(file: UploadFile = File(...)):
    try:
        # Save the uploaded photo
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as f:
            shutil.copyfileobj(file.file, f)


        predicted_class, confidence = main()
        
        return {"status": "ok", "disease": predicted_class, "confidence": confidence}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
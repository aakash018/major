from pydantic import BaseModel
import requests
from PIL import Image
import numpy as np
from io import BytesIO
import tensorflow as tf
import shutil
import os
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


model = load_model("./unet_binary_2.hdf5", compile=False)

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


def preprocess_image(image_path):
    img = Image.open(image_path)

    # Resize the image to 256x256 with padding
    img = img.resize((256, 256), Image.ANTIALIAS)

    # Convert image to grayscale
    img = img.convert('L')

    # img_array = np.array(img, dtype=np.uint8)  # Convert to unsigned byte
    img_array = np.array(img) / 255.0

    # Convert image to numpy array and normalize pixel values
    # img_array = np.array(img) / 255.0

    # Add batch and channel dimensions
    img_array = np.expand_dims(np.expand_dims(img_array, axis=-1), axis=0)

    return img_array

def save_result(result, output_path='result.png'):
    # Extract the relevant channel and reshape
    result_channel = result[0, :, :, 0]

    # Assuming the result is an image (modify this based on your actual output)
    result_img = Image.fromarray((result_channel * 255).astype(np.uint8))

    # Save the image to a file
    result_img.save(output_path)
def main():
    # Get image URL from the user
    image_url = "./uploaded_photos/uploaded_photo.jpg"

    # Preprocess the image
    processed_image = preprocess_image(image_url)

    image_height=256
    image_width=256


    # cnn_preprocressed = tf.keras.preprocessing.image.load_img(image_url, target_size=(image_height, image_width))

    predicted_class, confidence = predict_single_image_cnn(cnn_model, image_url)
    print(predicted_class, confidence)

    # Perform inference
    result = model.predict(processed_image)
    print(result.shape)
    # Save the result
    save_result(result, '../result.png')
    return predicted_class, confidence

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
        # Process the uploaded photo (you can save it to a directory, etc.)
        # For now, just returning the filename and content type
        # return FileResponse("result.png", media_type="image/png")
        return {"status": "ok", "disease": predicted_class, "confidence": confidence}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
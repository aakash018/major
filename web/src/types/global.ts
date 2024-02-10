export interface ServerResponse {
  status: "ok" | "fail";
  message: string;
}

export interface User {
  name: string;
  username: string;
  email: string;
  id: number;
}
type DiseaseType =
  | "Tomato Bacterial spot"
  | "Tomato Early blight"
  | "Tomato Late blight"
  | "Tomato Leaf Mold"
  | "Tomato Septoria leaf spot"
  | "Tomato Spider mites Two spotted spider mite"
  | "Tomato Target Spot"
  | "Tomato Tomato YellowLeaf Curl Virus"
  | "Tomato Tomato mosaic virus"
  | "Early Blight"
  | "Tomato healthy";

export interface PlantsType {
  id: string;
  name: string;
  disease: DiseaseType;
  createdAt: Date;
  updatedAt: Date;
  confidence: string;
  user: User;
  userId: number;
  isFavourited: boolean;
  imageURL: string;
  unetURL: string;
  yoloURL: string;
}

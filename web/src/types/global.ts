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
  | "Tomato Late Blight"
  | "Tomato Leaf Mold"
  | "Tomato Leaf Spot"
  | "Tomato Healthy";

export interface PlantsType {
  id: string;
  name: string;
  disease: DiseaseType;
  createdAt: Date;
  updatedAt: Date;
  confidence: string;
  user: User;
  userId: number;
  cnnClassification: string;
  yoloClassification: string;
  isFavourited: boolean;
  imageURL: string;
  unetURL: string;
  yoloURL: string;
}

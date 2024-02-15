import axiosInstance from "@/axiosInstance";

import PageTheme from "@/components/custom/PageTheme";
import ProtectedRoutes from "@/components/custom/ProtectedRoute";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { CircleNotch, Plus, Terminal } from "@phosphor-icons/react";

import React, { useRef, useState } from "react";

import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Add: React.FC = () => {
  const nav = useNavigate();

  const [photo, setPhoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({
    display: false,
    message: "",
  });

  const imageInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");

  const handleSubmit = async () => {
    if (name.trim() === "" || !photo) {
      return setError({
        display: true,
        message: "empty fields",
      });
    }
    try {
      const formData = new FormData();
      formData.append("photo", photo);
      formData.append("name", name);

      // Send data to Express server
      setLoading(true);
      const res = await axiosInstance.post("/plant/upload", formData);
      setLoading(false);
      // Optionally, you can handle the response from the Express server if needed

      if (res.data.status === "ok") {
        console.log(res.data);
        console.log("Photo uploaded successfully to Express server.");
        nav("/");
        toast("plant uploaded", { position: "top-right" });
      } else {
        toast("error uploading plant", {
          style: { color: "red" },
          position: "top-right",
        });
      }
    } catch (error) {
      setLoading(false);
      toast("error uploading plant", {
        style: { color: "red" },
        position: "top-right",
      });

      console.log("Error uploading photo from React:", error);
    }
  };

  return (
    <ProtectedRoutes>
      <PageTheme>
        <div className="w-full h-[70vh] flex flex-col justify-center items-center">
          <div className="w-full md:w-[400px] flex flex-col items-center mt-7 justify-center">
            <div
              onClick={() => {
                if (imageInputRef.current) imageInputRef.current.click();
              }}
              className="mb-5 overflow-hidden cursor-pointer w-full h-[250px] dark:bg-slate-500 bg-slate-300 rounded-lg flex justify-center items-center"
            >
              {photo && (
                <img
                  src={URL.createObjectURL(photo)}
                  alt="uploaded-image"
                  className="object-cover w-full h-full object-center rounded-lg"
                />
              )}
              {!photo && <Plus size={20} />}
            </div>
            {error.display && (
              <Alert className="mb-5" variant={"destructive"}>
                <Terminal className="h-4 w-4" />
                <AlertTitle>{error.message}</AlertTitle>
              </Alert>
            )}
            <input
              type="file"
              className="hidden"
              ref={imageInputRef}
              onChange={(e) => {
                if (e.target.files) {
                  setPhoto(e.target.files[0]);
                }
              }}
            />
          </div>
          <div className="w-full flex flex-col gap-5 md:w-[400px]">
            <div>
              <Input
                placeholder="Name"
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
            </div>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading && (
                <CircleNotch size={20} className="mr-5 animate-spin" />
              )}
              Submit
            </Button>
          </div>
        </div>
      </PageTheme>
    </ProtectedRoutes>
  );
};

export default Add;

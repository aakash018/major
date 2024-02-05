import MobileNav from "@/components/custom/MobileNav";
import NavBar from "@/components/custom/NavBar";
import PageTheme from "@/components/custom/PageTheme";
import ProtectedRoutes from "@/components/custom/ProtectedRoute";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import img from "../assets/home.jpg";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import axiosInstance from "@/axiosInstance";
import { PlantsType, ServerResponse } from "@/types/global";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const tomatoPlants = [
  { name: "Cherry Delight", plantingDate: "15/02/2023" },
  { name: "Sunset Bliss", plantingDate: "08/04/2023" },
  { name: "Royal Red", plantingDate: "23/06/2023" },
  { name: "Emerald Dream", plantingDate: "10/01/2023" },
  { name: "Golden Harvest", plantingDate: "05/09/2023" },
  // Add more tomato plants as needed
];

const Plants = () => {
  const [plants, setPlants] = useState<PlantsType[]>([]);
  const nav = useNavigate();
  useEffect(() => {
    (async () => {
      try {
        const res = await axiosInstance.get<
          ServerResponse & { plants: PlantsType[] }
        >("/plant/getPlants");

        if (res.data.status === "ok") {
          setPlants(res.data.plants);
        } else {
          toast(res.data.message, { style: { color: "red" } });
        }
      } catch {
        toast("internal server error", { style: { color: "red" } });
      }
    })();
  }, []);

  return (
    <ProtectedRoutes>
      <PageTheme>
        <div className="mt-5 flex flex-col gap-5">
          {plants.map((plant, i) => (
            <Card className="w-full" key={i}>
              <CardHeader>
                <CardTitle>
                  <div className="flex gap-5">
                    <div className="w-[80px] h-[80px] bg-black">
                      <img
                        src={plant.imageURL}
                        alt="image"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div>{plant.name}</div>
                      <div className="text-muted-foreground font-normal text-sm">
                        {"02/03/2024"}
                      </div>
                      <div className="mt-2">
                        <Button
                          variant={"default"}
                          onClick={() => {
                            nav(`/plant/${plant.id}`);
                          }}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      </PageTheme>
    </ProtectedRoutes>
  );
};

export default Plants;

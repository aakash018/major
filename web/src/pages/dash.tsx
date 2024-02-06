import PageTheme from "@/components/custom/PageTheme";
import ProtectedRoutes from "@/components/custom/ProtectedRoute";

import tips from "../dailyTips.json";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import axiosInstance from "@/axiosInstance";
import { PlantsType, ServerResponse } from "@/types/global";
import { toast } from "sonner";
import { CircleNotch } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import DashBarChart from "@/components/custom/DashBarChart";

const randomTip = tips[Math.floor(Math.random() * 5)];

const Dash = () => {
  const [totalPlantCount, setTotalPlantCount] = useState<number>(0);
  const [recentPlant, setRecentPlant] = useState<PlantsType | null>(null);
  const navigator = useNavigate();
  useEffect(() => {
    (async () => {
      try {
        const res = await axiosInstance.get<
          ServerResponse & { totalPlantCount: number; recentPlant: PlantsType }
        >("/plant/getDashInfo");

        if (res.data.status === "ok") {
          setTotalPlantCount(res.data.totalPlantCount);
          setRecentPlant(res.data.recentPlant);
        }
      } catch {
        toast("failed to load data", {
          style: { color: "red" },
          position: "top-center",
        });
      }
    })();
  }, []);

  return (
    <ProtectedRoutes>
      <PageTheme className="flex justify-center items-center">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-8">
            <div className="flex items-center justify-center mt-[25px] gap-5">
              <Card className="w-fit">
                <CardHeader>
                  <CardTitle className="font-normal text-sm">
                    Plants Registered
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold mt-[-15px]">
                    {totalPlantCount}
                  </p>
                  {/* <CardDescription>3 added this month</CardDescription> */}
                </CardContent>
              </Card>
              <Card className="w-fit">
                <CardHeader>
                  <CardTitle className="font-normal text-sm">
                    Plants Recovered
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold mt-[-15px]">2</p>
                  {/* <CardDescription>3 added this month</CardDescription> */}
                </CardContent>
              </Card>
            </div>
            <div className="flex justify-center">
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Planting Tips</CardTitle>
                  <CardDescription>{randomTip.title}</CardDescription>
                </CardHeader>
                <CardContent>{randomTip.tip}</CardContent>
              </Card>
            </div>
          </div>
          <div className="flex flex-col flex-wrap gap-8 md:flex-row md:justify-center">
            <Card className="w-fit">
              <CardHeader>
                <CardTitle>Recently Added</CardTitle>
              </CardHeader>
              {!recentPlant && (
                <div>
                  <CircleNotch size={32} /> Loading
                </div>
              )}
              {recentPlant && (
                <CardContent>
                  <img
                    src={recentPlant?.imageURL}
                    className="object-cover rounded-lg w-[500px] h-[400px]"
                  />
                  <div className="mt-3">
                    <h1 className="text-lg font-bold">
                      {recentPlant?.disease}
                    </h1>
                    <CardDescription>
                      {new Date(recentPlant.createdAt).toLocaleString()}
                    </CardDescription>
                    <Button
                      className="mt-2"
                      variant={"default"}
                      onClick={() => {
                        navigator(`/plant/${recentPlant.id}`);
                      }}
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>
            <Card className="h-fit w-full md:w-fit">
              <CardHeader>
                <CardTitle>Plants Uploads</CardTitle>
                <CardDescription>Uploaded Plants By Month</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] md:h-[400px] md:w-[500px] w-full ml-[-40px]">
                <DashBarChart />
              </CardContent>
            </Card>
          </div>
        </div>
      </PageTheme>
    </ProtectedRoutes>
  );
};

export default Dash;

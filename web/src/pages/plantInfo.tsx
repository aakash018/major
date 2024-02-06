import PageTheme from "@/components/custom/PageTheme";
import ProtectedRoutes from "@/components/custom/ProtectedRoute";

import { useParams } from "react-router-dom";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import axiosInstance from "@/axiosInstance";
import { PlantsType, ServerResponse } from "@/types/global";
import { toast } from "sonner";
import plantDiseaseData from "../plantInfo.json";

const monthAbbreviations = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const PlantInfo = () => {
  const { plantId } = useParams();
  const [plant, setPlant] = useState<PlantsType | null>(null);
  useEffect(() => {
    (async () => {
      try {
        const res = await axiosInstance.get<
          ServerResponse & { plant: PlantsType }
        >("/plant/getOnePlant", {
          params: {
            id: plantId,
          },
        });

        if (res.data.status === "ok") {
          setPlant(res.data.plant);
        } else {
          toast(res.data.message, { style: { color: "red" } });
        }
      } catch (error) {
        toast("failed to connect to server", { style: { color: "red" } });
      }
    })();
  }, []);
  return (
    <ProtectedRoutes>
      <PageTheme>
        <div className="mt-5 flex flex-col gap-7">
          {!plant && <div>Loading...</div>}
          {plant && (
            <>
              {" "}
              <div className="flex items-center gap-3 md:gap-10">
                <div className="w-[150px] h-[150px] rounded-full overflow-hidden">
                  <img
                    src={plant.imageURL}
                    alt="plant"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                <div>
                  <div className="text-xl font-bold">{plant.name}</div>
                  <div className="text-muted-foreground">Tomato</div>
                  <div className="bg-card border p-2 rounded-md mt-4 shadow-lg">
                    <div>
                      <div className="text-sm text-muted-foreground ">
                        Infected By
                      </div>
                      <div className="text-md font-bold text-destructive">
                        {plant.disease}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-between md:justify-center md:gap-7">
                <NumberCard
                  title={"Added at"}
                  number={new Date(plant.createdAt).getDate()}
                  desc={`${
                    monthAbbreviations[new Date(plant.createdAt).getMonth()]
                  }  ${new Date(plant.createdAt).getFullYear()}`}
                />
                <NumberCard
                  title={"Recovery Days"}
                  number={plantDiseaseData[plant.disease].recovery_days}
                  desc={"Days"}
                />
                <NumberCard
                  title={"Confidence"}
                  number={plant.confidence}
                  desc={"%"}
                />
              </div>
              <div className="md:w-full md:flex md:justify-center">
                <div className="md:w-[80%]">
                  <div className="font-bold text-primary mb-2">
                    Segmentation
                  </div>
                  <Tabs
                    defaultValue="Unet"
                    className="w-full flex flex-col gap-1"
                  >
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="Unet">Unet</TabsTrigger>
                      <TabsTrigger value="YOLO">YOLO</TabsTrigger>
                    </TabsList>
                    <TabsContent value="Unet">
                      <img
                        src={plant.imageURL}
                        alt=""
                        className="w-full h-[300px] md:h-[600px] md:object-top object-cover rounded-lg"
                      />
                    </TabsContent>
                    <TabsContent value="YOLO">
                      <img
                        src={plant.unetURL}
                        alt=""
                        className="w-full h-[300px] md:h-[600px] md:object-top object-cover rounded-lg"
                      />
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
              <div className="md:flex md:justify-center mt-10">
                <div className="md:w-[80%]">
                  <div>
                    <div className="text-primary font-bold">
                      About Infection
                    </div>
                    <div>{plantDiseaseData[plant.disease].about_infection}</div>
                  </div>
                  <div>
                    <h2 className="text-primary font-bold  mb-2 mt-8">
                      Treatment Steps
                    </h2>
                    <ol className="list-decimal ml-6 mb-4">
                      {plantDiseaseData[plant.disease].treatment_steps.map(
                        (method, i) => (
                          <li className="mb-2" key={i}>
                            {method}
                          </li>
                        )
                      )}
                    </ol>
                    <h2 className="text-primary font-bold mb-2 mt-8">
                      Prevention Tips
                    </h2>
                    <ul className="list-disc ml-6 mb-4">
                      {plantDiseaseData[plant.disease].prevention_methods.map(
                        (method, i) => (
                          <li className="mb-2" key={i}>
                            {method}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </PageTheme>
    </ProtectedRoutes>
  );
};

interface NumberCardPropsType {
  title: string;
  number: number | string;
  desc: string;
}

const NumberCard: React.FC<NumberCardPropsType> = ({ desc, number, title }) => {
  return (
    <div className="bg-card border w-fit p-3 rounded-lg flex flex-col items-center gap-2 shadow-md">
      <div className="text-[10px] text-muted-foreground text-left w-full">
        {title}
      </div>
      <div className="text-3xl font-bold">{number}</div>
      <div className="text-sm">{desc}</div>
    </div>
  );
};

export default PlantInfo;

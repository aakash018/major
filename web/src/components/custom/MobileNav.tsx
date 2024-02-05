import { House, Plus, PottedPlant } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";

const MobileNav = () => {
  const nav = useNavigate();
  return (
    <div className="text-white bg-[rgba(19,10,5,0.7)] backdrop-blur-[5px] h-[60px] fixed bottom-0 left-0 flex w-[100vw] md:hidden justify-around  items-center rounded-t-[30px]">
      <PottedPlant
        size={32}
        onClick={() => {
          nav("/plants");
        }}
      />
      <div
        style={{
          boxShadow: "0px 0px 0 5px hsl(var(--background))",
        }}
        onClick={() => {
          nav("/add");
        }}
        className="rounded-full border-black dark:border-white border-2 p-3 translate-y-[-40%] bg-background"
      >
        <Plus size={32} className="text-black dark:text-white" />
      </div>
      <House
        size={32}
        onClick={() => {
          nav("/");
        }}
      />
    </div>
  );
};

export default MobileNav;

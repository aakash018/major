import React from "react";
import NavBar from "./NavBar";
import MobileNav from "./MobileNav";

interface Props {
  children: React.ReactNode;
  className?: string;
  isNotLogin?: boolean;
}

const PageTheme: React.FC<Props> = ({
  children,
  className,
  isNotLogin = true,
}) => {
  return (
    <div
      className={`w-full min-h-[100vh]  bg-background ${className} flex justify-center`}
    >
      <div className={`w-[80%]  h-full pb-20`}>
        {isNotLogin && (
          <div>
            <NavBar />
          </div>
        )}
        {children}
        {isNotLogin && <MobileNav />}
      </div>
    </div>
  );
};

export default PageTheme;

import { Avatar, AvatarFallback } from "../ui/avatar";

import { Switch } from "../ui/switch";
import { Moon, Sun } from "@phosphor-icons/react";
import { useTheme } from "../ui/theme-provider";
import { useUser } from "@/context/User";

import axiosInstance from "@/axiosInstance";
import { ServerResponse } from "@/types/global";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";
import { setAccessToken } from "@/accessToken";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "../ui/navigation-menu";

const NavBar = () => {
  const nav = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await axiosInstance.get<ServerResponse>("/auth/logout", {
        withCredentials: true,
      });

      if (res.data.status === "ok") {
        toast("logged out successful", { style: { color: "green" } });
        setAccessToken("");
        nav("/login");
      } else {
        toast(res.data.message, { style: { color: "red" } });
      }
    } catch {
      toast("internal server error", { style: { color: "red" } });
    }
  };

  const { setTheme, theme } = useTheme();
  const { user } = useUser();

  return (
    <div>
      <div className="flex justify-between items-center w-full py-5">
        <div className="text-lg">GardenXpert</div>
        <div className="flex gap-5 items-center">
          <Switch
            id="airplane-mode"
            icon={theme === "dark" ? <Moon /> : <Sun />}
            checked={theme === "dark" ? false : true}
            onCheckedChange={(isOn) => {
              if (isOn) setTheme("light");
              else setTheme("dark");
            }}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar>
                <AvatarFallback>
                  {user?.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-fit mr-5">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  className="text-red-500"
                  onClick={handleLogout}
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="hidden md:block">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to="/">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Dashboard
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/plants">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Plants
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/add">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Add New Plant
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
};

export default NavBar;

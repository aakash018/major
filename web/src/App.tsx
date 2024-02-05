import { ThemeProvider } from "./components/ui/theme-provider";
import Login from "./pages/login";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Signup from "./pages/signup";
import Dash from "./pages/dash";
import { Toaster } from "@/components/ui/sonner";
import { UserProvider } from "./context/User";
import Add from "./pages/add";
import Plants from "./pages/plants";
import PlantInfo from "./pages/plantInfo";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dash />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/add",
    element: <Add />,
  },
  {
    path: "/plants",
    element: <Plants />,
  },
  {
    path: "/plant/:plantId",
    element: <PlantInfo />,
  },
]);

function App() {
  return (
    <UserProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <>
          <Toaster />
          <div className="text-foreground">
            <RouterProvider router={router} />
          </div>
        </>
      </ThemeProvider>
    </UserProvider>
  );
}

export default App;

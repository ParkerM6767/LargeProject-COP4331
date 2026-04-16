// import { useMemo } from "react";
import { Map } from "./components/Map";
import { MapZoom } from "./components/MapZoom";
import { useState } from "react";
import "./index.css";
import { LoginModal } from "./components/LoginModal";
import { Button } from "./components/ui/button";
import { Dialog, DialogTrigger } from "./components/ui/dialog";
import { PostSidebar, SideBarToggle } from "./components/PostSidebar";
import { SidebarInset, SidebarProvider } from "./components/ui/shad-sidebar";
import { ModeToggle } from "./components/ui/themes";
import { logout } from "./lib/fetch";

// const UCFLong = 28.60235;
// const UCFLat = -81.2002;

function App() {
  const [user, setUser] = useState<{
    firstName: string;
    lastName: string;
  } | null>(null);

  let inBrowser = true;

  // Detect user agent for mobile app and hide react components if on mobile
  if (navigator.userAgent.includes("soracl")) {
    inBrowser = false;
  }

  function LoginButton() {
    return (user ? (
      <Button
        onClick={() => {
          logout();
          setUser(null);
        }}
        size="lg"
        className="absolute top-6 right-10 p-4 w-[8rem] h-[3rem] text-2xl inset-shadow-[0_2px_8px_rgba(0,0,0,0.2)] shadow-[0_0_10px_rgba(0,0,0,.5)]  shadow-white"
      >
        Logout
      </Button>
    ) : (
      <Dialog>
        <DialogTrigger asChild>
          <Button className="absolute top-6 right-10 p-4 w-[8rem] h-[3rem] text-2xl inset-shadow-[0_2px_8px_rgba(0,0,0,0.2)] shadow-[0_0_10px_rgba(0,0,0,.5)]  shadow-white">
            Login
          </Button>
        </DialogTrigger>
        <LoginModal onLoginSuccess={(userData) => setUser(userData)} />
      </Dialog>
    ))
  }

  return (
    <SidebarProvider className="w-screen h-screen absolute top-0 left-0">
      {inBrowser ? <PostSidebar user={user} /> : null}

      <SidebarInset>
        {/* Everything that gets moved by the sidebar goes below */}

        <Map user={user}>
          <div className="flex gap-2">
            {inBrowser ? <SideBarToggle /> : null}
            <MapZoom />
            <ModeToggle />
          </div>

          {inBrowser ? <LoginButton /> : null}
        </Map>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default App;

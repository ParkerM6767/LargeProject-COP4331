// import { useMemo } from "react";
import { Map } from "./components/Map";
import { MapZoom } from "./components/MapZoom";
import { useContext, useEffect, useState } from "react";
import "./index.css";
import { LoginModal } from "./components/LoginModal";
import { Button } from "./components/ui/button";
import { Dialog, DialogTrigger } from "./components/ui/dialog";
import { PostSidebar, SideBarToggle } from "./components/PostSidebar";
import { SidebarInset, SidebarProvider } from "./components/ui/shad-sidebar";
import { ModeToggle } from "./components/ui/themes";
import { logout } from "./lib/fetch";
import { type Map as MapType } from "leaflet";
import { PostContext } from "./lib/postContext";

// const UCFLong = 28.60235;
// const UCFLat = -81.2002;

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activePost, setActivePost] = useState<Post | null>(null);
  const { posts } = useContext(PostContext);

  // For the post sidebar to get access to the map, it has to use a ref,
  // but a ref callback is used instead of useRef to trigger a refresh
  const [map, setMap] = useState<MapType | null>(null);

  // Whenever the posts update, update the active post to the most recent version
  useEffect(() => {
    setActivePost(
      (oldActive) => posts.find((p) => p._id === oldActive?._id) || null,
    );
  }, [posts]);

  return (
    <SidebarProvider className="w-screen h-screen absolute top-0 left-0">
      <PostSidebar user={user} map={map} setActivePost={setActivePost} />

      <SidebarInset>
        {/* Everything that gets moved by the sidebar goes below */}

        <Map
          user={user}
          activePost={activePost}
          setActivePost={setActivePost}
          ref={setMap}
        >
          <div className="flex gap-2">
            <SideBarToggle />
            <MapZoom />
            <ModeToggle />
          </div>

          {user ? (
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
          )}
        </Map>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default App;

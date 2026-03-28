import { useMemo } from "react";
import { Map } from "./components/Map";
import { MapZoom } from "./components/MapZoom";
import { useState } from "react";
import "./index.css";
import { LoginModal } from "./components/LoginModal";
import { Button } from "./components/ui/button";
import { Dialog, DialogTrigger } from "./components/ui/dialog";
import { PostSidebar, SideBarToggle } from "./components/PostSidebar";
import { SidebarInset, SidebarProvider } from "./components/ui/shad-sidebar";

const UCFLong = 28.60235;
const UCFLat = -81.2002;

const fakePosts: Post[] = [
  {
    creatorId: "1",
    description: "Some class",
    image: undefined,
    lattitude: UCFLat - 0.0002,
    longitude: UCFLong + 0.0013,
    upvotes: 0,
    downvotes: 0,
  },
  {
    creatorId: "5",
    description: "Really annoying construction",
    image: undefined,
    lattitude: UCFLat + 0.003,
    longitude: UCFLong - 0.0045,
    upvotes: 10,
    downvotes: 0,
  },
];

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Spoof getting the posts from the api
  const fetchedPosts = useMemo(
    () =>
      new Promise<Post[]>((resolve) =>
        setTimeout(() => resolve(fakePosts), 1500),
      ),
    [],
  );

  return (
    <SidebarProvider className="w-screen h-screen absolute top-0 left-0">
      <PostSidebar posts={fetchedPosts} />

      <SidebarInset className="h-full">
        {/* Everything that gets moved by the sidebar goes below */}

        <Map posts={fetchedPosts}>
          <div className="flex gap-2">
            <SideBarToggle />
            <MapZoom />
            {/* Darkmode here */}
          </div>

          {isLoggedIn ? (
            <Button
              onClick={() => setIsLoggedIn(false)}
              size="lg"
              className="absolute top-6 right-10 p-4 bg-orange-500"
            >
              Logout
            </Button>
          ) : (
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  className="absolute top-6 right-10 p-4 bg-orange-500"
                >
                  Login
                </Button>
              </DialogTrigger>
              <LoginModal onLoginSuccess={() => setIsLoggedIn(true)} />
            </Dialog>
          )}
        </Map>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default App;

import { LucideSidebarClose, LucideSidebarOpen, Search } from "lucide-react";
import { Suspense, useContext, useState } from "react";
import blackLogo from "../assets/black-ucf-logo.png";
import plus from "../assets/plus.svg";
import yellowPlus from "../assets/yellow-plus.svg";
import yellowLogo from "../assets/yellow-ucf-logo.png";
import { AddEventModal } from "./AddEventModal";
import { Button } from "./ui/button";
import { Dialog, DialogTrigger } from "./ui/dialog";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "./ui/shad-sidebar";
import { Skeleton } from "./ui/skeleton";
import { Input } from "./ui/input";
import { useGeolocation } from "../lib/hooks";
import { PostContext } from "../lib/postContext";
import { SidebarPagination } from "./SidebarPagination";
import { type Map } from "leaflet";

export function PostSidebar({
  user,
  map,
  setActivePost,
}: {
  user: { firstName: string; lastName: string } | null;
  map: Map | null;
  setActivePost: (post: Post | null) => void;
}) {
  const [showModal, setShowModal] = useState(false);
  const { posts, setSearch, setPage } = useContext(PostContext);

  const { coords, getLocation, clearCoords } = useGeolocation();
  // What should we do if the user rejects?

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center">
        <img
          src={blackLogo}
          width={250}
          height={250}
          className="block dark:hidden"
        />
        <img
          src={yellowLogo}
          width={250}
          height={250}
          className="hidden dark:block"
        />
        <h1 className="text-3xl semi-bold text-center px-6">
          Campus Community Report
        </h1>
      </SidebarHeader>
      <SidebarContent>
        <div className="relative  mx-4 w-[18rem]  mt-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black w-8 h-8" />
          <Input
            type="text"
            placeholder="Search"
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="h-[5vh] pl-13 text-black dark:text-white text-xl! placeholder:text-xl placeholder:text-black dark:placeholder:text-white rounded-md border-none bg-white dark:bg-zinc-500"
          />
        </div>

        <SidebarPagination />

        <div className="overflow-auto">
          {user && (
            <Dialog
              open={showModal}
              onOpenChange={(state) => {
                if (state) {
                  setShowModal(true);
                  getLocation();
                } else {
                  setShowModal(false);
                  clearCoords();
                }
              }}
            >
              <DialogTrigger asChild>
                <Button size="lg" className=" mx-4 my-6 text-2xl">
                  <img
                    src={plus}
                    width={50}
                    height={50}
                    className="block dark:hidden"
                  />
                  <img
                    src={yellowPlus}
                    width={50}
                    height={50}
                    className="hidden dark:block"
                  />
                  Post Event
                </Button>
              </DialogTrigger>
              <AddEventModal
                latitude={coords?.lat ?? null}
                longitude={coords?.lng ?? null}
                closeModal={() => setShowModal(false)}
              />
            </Dialog>
          )}
          <Suspense fallback={<PostGlimmers />}>
            <ListPosts posts={posts} map={map} setActivePost={setActivePost} />
          </Suspense>
        </div>
      </SidebarContent>
      <SidebarFooter>
        {user && (
          <p className="text-white">
            Hello {user.firstName} {user.lastName}
          </p>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}

/**
 * Display all the posts loaded, optionally with a filter in the future
 */
function ListPosts({
  posts,
  map,
  setActivePost,
}: {
  posts: Post[];
  map: Map | null;
  setActivePost: (post: Post | null) => void;
}) {
  return (
    <>
      {posts.map((post) => (
        <div
          key={post._id}
          className="p-4 mx-4 mt-4 border border-muted-foreground rounded-md"
          onClick={() => {
            setActivePost(post);
            map?.panTo([post.latitude, post.longitude]);
          }}
        >
          {post.imageUrl && <img src={post.imageUrl} />}
          <div>
            <p>{post.title}</p>
            <p>{post.description}</p>
          </div>
        </div>
      ))}
    </>
  );
}

/**
 * A placeholder to show that posts are still being loaded
 */
function PostGlimmers() {
  return (
    <>
      {Array(10)
        .fill(undefined)
        .map((_, index) => (
          <Skeleton key={index} className="mx-4 mt-4 h-15 bg-border" />
        ))}
    </>
  );
}

/**
 * A button that, when clicked, opens or closes the sidebar.
 * The correct icon is shown automatically
 */
export function SideBarToggle() {
  const { open, toggleSidebar } = useSidebar();

  return (
    <Button onClick={toggleSidebar} variant="outline">
      {open ? <LucideSidebarClose /> : <LucideSidebarOpen />}
    </Button>
  );
}

import { useState, useEffect, useContext, Suspense } from "react";
import { LucideSidebarClose, LucideSidebarOpen, Search } from "lucide-react";
import blackLogo from "../assets/black-ucf-logo.png";
import plus from "../assets/plus.svg";
import yellowPlus from "../assets/yellow-plus.svg";
import yellowLogo from "../assets/yellow-ucf-logo.png";
import { AddEventModal } from "./AddEventModal";
import { Button } from "./ui/button";
import { Dialog } from "./ui/dialog";
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
import { LocationAlert } from "./LocationAlert";

export function PostSidebar({
  // posts,
  user,
}: {
  // posts: Post[];
  user: { firstName: string; lastName: string } | null;
}) {
  // const [showModal, setShowModal] = useState(false);
  const { posts, setSearch, setPage } = useContext(PostContext);
  const [postingOpen, setPostingOpen] = useState<boolean>(false);
  const { coords, geoError, geoLoading, getLocation } = useGeolocation();

  useEffect(() => {
    getLocation();
  }, [])
  
  function openModal() {
    if (coords) {
      setPostingOpen(true);
    } else {
      getLocation();
    }
  }

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
        {user && geoError === "" && (
          <>
            <Button
              onClick={openModal}
              size="lg"
              className=" mx-4 my-6 text-2xl"                            
              disabled={geoLoading}
            >
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
            <Dialog open={postingOpen} onOpenChange={setPostingOpen}>
              <AddEventModal 
                setPostingOpen={setPostingOpen} 
                geoLocation={{coords}}
              />
            </Dialog>
          </>
        )}
        {user && geoError === 'Location access denied. Please allow location access to report events.' && (
          <LocationAlert/>
        )}
        <Suspense fallback={<PostGlimmers />}>
          <ListPosts posts={posts} />
        </Suspense>
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
function ListPosts({ posts }: { posts: Post[] }) {
  return (
    <>
      {posts.map((post) => (
        <div
          key={post._id}
          className="p-4 mx-4 mt-4 border border-muted-foreground rounded-md"
        >
          <img 
            className="rounded mr-3"
            src={`http://localhost:8000/images/posts/${post.imageUrl}`}
            width={60}
            height={60}
          />
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

import { LucideSidebarClose, LucideSidebarOpen, Search } from "lucide-react";
import { Button } from "./ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "./ui/shad-sidebar";
import {
  Dialog,
  DialogTrigger
} from "./ui/dialog";
import { Suspense } from "react";
import { Skeleton } from "./ui/skeleton";
import { AddEventModal } from "./AddEventModal";
import yellowPlus from "../assets/yellow-plus.svg"
import yellowLogo from "../assets/yellow-ucf-logo.png"
import blackLogo from "../assets/black-ucf-logo.png"
import plus from "../assets/plus.svg"

import { Input } from "./ui/input";

export function PostSidebar({ posts, user }: { posts: Post[]; user: { firstName: string; lastName: string } | null}) {
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
        <h1 className="text-3xl semi-bold text-center px-6">Campus Community Report</h1>
      </SidebarHeader>
      <SidebarContent>
        <div className="relative  mx-4 w-[18rem]  mt-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black w-8 h-8" />
          <Input 
            type="text"
            placeholder="Search"
            className="h-[5vh] pl-13 text-black dark:text-white text-xl! placeholder:text-xl placeholder:text-black dark:placeholder:text-white rounded-md border-none bg-white dark:bg-zinc-500"
          />
        </div>
        {user && (
          <Dialog>
            <DialogTrigger asChild>
              <Button
                size="lg"
                className=" mx-4 my-6 text-2xl"
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
            </DialogTrigger>
            <AddEventModal/>
          </Dialog>
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
        <div key={post.description} className="p-4 mx-4 mt-4 border border-muted-foreground rounded-md">
          <img src={post.image}/>
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

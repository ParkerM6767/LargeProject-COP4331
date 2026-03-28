import { LucideSidebarClose, LucideSidebarOpen } from "lucide-react";
import { Button } from "./ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "./ui/shad-sidebar";
import { Suspense, use } from "react";
import { Skeleton } from "./ui/skeleton";

export function PostSidebar({ posts }: { posts: Promise<Post[]> }) {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="text-xl">Posts</div>
      </SidebarHeader>
      <SidebarContent>
        <Suspense fallback={<PostGlimmers />}>
          <ListPosts posts={posts} />
        </Suspense>
      </SidebarContent>
      <SidebarFooter>Some footer, presumably</SidebarFooter>
    </Sidebar>
  );
}

/**
 * Display all the posts loaded, optionally with a filter in the future
 */
function ListPosts({ posts }: { posts: Promise<Post[]> }) {
  const resolvedPosts = use(posts);

  return (
    <>
      {resolvedPosts.map((post) => (
        <div className="p-4 mx-4 mt-4 border border-muted-foreground rounded-md">
          {post.description}
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
        .map(() => (
          <Skeleton className="mx-4 mt-4 h-15 bg-border" />
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

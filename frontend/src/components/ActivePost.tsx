import { ThumbsDown, ThumbsUp, X } from "lucide-react";
import { Button } from "./ui/button";
import { useMapEvent } from "react-leaflet";
import { cn } from "../lib/utils";
import { useContext, useEffect, useState } from "react";
import { Separator } from "./ui/separator";
import { downvotePost, upvotePost } from "../lib/fetch";
import { PostContext } from "../lib/postContext";

export function ActivePost({
  post,
  user,
  clear,
}: {
  post: Post;
  user: User | null;
  clear: () => void;
}) {
  const [liked, setLiked] = useState(user ? post.userUpvoted : false);
  const [disliked, setDisliked] = useState(user ? post.userDownvoted : false);
  const [closing, setClosing] = useState(false);
  const { refetch } = useContext(PostContext);

  // If the info for the active post changes, update the liked/disliked
  useEffect(() => {
    if (!user) return;
    setLiked(post.userUpvoted);
    setDisliked(post.userDownvoted);
  }, [post.userUpvoted, post.userDownvoted, user]);

  // Clear the active post when the map is touched
  function fadeOut() {
    setClosing(true);
    setTimeout(() => clear(), 200);
  }
  useMapEvent("dragstart", fadeOut);

  // Logic for liking and disliking
  function onLike() {
    if (!user) return;

    upvotePost(post._id).then(refetch);

    if (liked) {
      setLiked(false);
    } else {
      setLiked(true);
      setDisliked(false);
    }
  }
  function onDisike() {
    if (!user) return;

    downvotePost(post._id).then(refetch);

    if (disliked) {
      setDisliked(false);
    } else {
      setDisliked(true);
      setLiked(false);
    }
  }

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        `}</style>
      <div
        key={post._id}
        className={cn(
          "absolute z-1010 isolate w-full h-[40%] pointer-events-none cursor-auto top-0 flex justify-center",
        )}
        style={{
          animation: closing
            ? "fadeOut 0.25s ease-in forwards"
            : "fadeIn 0.2s ease-out forwards",
        }}
        // Prevent dragging through the box
        onMouseDownCapture={(e) => {
          e.stopPropagation();
        }}
        onScroll={(e) => e.stopPropagation()}
      >
        {/* Popup */}
        <div className="absolute bottom-0 max-w-[50%] max-h-full overflow-auto border rounded-lg bg-background border-border pointer-events-auto">
          {/* Header */}
          <div className="w-full p-2 text-lg bg-primary rounded-t-lg grid grid-cols-[40px_1fr_40px] items-center">
            <Button
              className="bg-primary-foreground cursor-pointer"
              size="icon-sm"
              onClick={fadeOut}
            >
              <X className="stroke-primary" />
            </Button>
            <div className="grow text-center">{post.title}</div>
            {/* Technically a grid cell goes unused */}
          </div>

          {/* Body */}
          <div className="p-3">
            {/* Description */}
            <div>{post.description}</div>

            {/* Image, doesn't work yet since image upload isn't in main as of 4/14 */}
            {post.imageUrl && (
              <div className=" m-auto">
                <img
                  src={
                    import.meta.env.VITE_API_BASE +
                    `/images/posts/${post.imageUrl}`
                  }
                />
              </div>
            )}

            <Separator className="my-2" />

            {/* Votes */}
            <div className="grid grid-cols-2 place-items-center">
              <div
                className="grid grid-cols-2 place-items-center"
                onClick={onLike}
              >
                <div>{post.upvote}</div>
                <ThumbsUp fill={liked ? "green" : "transparent"} />
              </div>

              <div
                className="grid grid-cols-2 place-items-center"
                onClick={onDisike}
              >
                <ThumbsDown fill={disliked ? "red" : "transparent"} />
                <div>{post.downvote}</div>
              </div>
            </div>
          </div>
        </div>

        {/* The small point at the bottom */}

        <div
          className="absolute -bottom-5 border-transparent border-t-background"
          style={{
            borderStyle: "solid",
            borderWidth: "21px 21px 0px 21px",
            // borderColor: "transparent transparent transparent",
          }}
        ></div>
      </div>
    </>
  );
}

import {
  createContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import { fetchPosts } from "./fetch";

export const PostContext = createContext<{
  posts: Post[];
  page: number;
  setPage: (page: number) => void;
  setSearch: (search: string) => void;
}>({
  posts: [],
  page: -1,
  setPage: () => {
    throw new Error("`PostProvider` not found in the React tree!");
  },
  setSearch: () => {
    throw new Error("`PostProvider` not found in the React tree!");
  },
});

export function PostProvider({
  limit = 20,
  children,
}: PropsWithChildren<{ limit?: number }>) {
  const [search, setSearch] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    // Flag to mark the most recent fetch
    let currentFetch = true;

    fetchPosts(search, page, limit).then((newPosts) => {
      if (!currentFetch) return;
      setPosts(newPosts);
    });

    return () => {
      currentFetch = false;
    };
  }, [search, page, limit]);

  return (
    <PostContext.Provider value={{ posts, page, setPage, setSearch }}>
      {children}
    </PostContext.Provider>
  );
}

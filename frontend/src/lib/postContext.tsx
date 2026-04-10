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
  refresh: () => void;
}>({
  posts: [],
  page: -1,
  setPage: () => {
    throw new Error("`PostProvider` not found in the React tree!");
  },
  setSearch: () => {
    throw new Error("`PostProvider` not found in the React tree!");
  },
  refresh: () => {
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

  // A trick to force a refresh when needed
  const [key, setKey] = useState(0);

  useEffect(() => {
    // Flag to mark the most recent fetch
    let currentFetch = true;

    fetchPosts(search, page, limit).then((newPosts) => {
      if (!currentFetch) return;
      console.log(newPosts)
      setPosts(newPosts);
    });

    return () => {
      currentFetch = false;
    };
  }, [search, page, limit, key]);

  function refresh() {
    setKey((k) => k + 1);
  }

  return (
    <PostContext.Provider value={{ posts, page, setPage, setSearch, refresh }}>
      {children}
    </PostContext.Provider>
  );
}

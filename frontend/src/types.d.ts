// Any env variables the frontend needs
interface ImportMetaEnv {
  readonly VITE_API_BASE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Post {
  creatorId: string;
  description: string;
  image: unknown;
  lattitude: number;
  longitude: number;

  upvotes: number;
  downvotes: number;
}

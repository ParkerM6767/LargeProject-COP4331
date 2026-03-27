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

interface LoginForm {
    email: string,
    password: string
}

interface SignupForm extends LoginForm{
    firstName: string,
    lastName: string
}

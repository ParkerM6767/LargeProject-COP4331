// Any env variables the frontend needs
interface ImportMetaEnv {
  readonly VITE_API_BASE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Post {
  _id: string;
  creatorId: string;
  description: string;
  imageUrl: string;
  latitude: number;
  longitude: number;
  title: string;
  upvote: number;
  downvote: number;
  userUpvoted: boolean;
  userDownvoted: boolean;
}

interface User {
  firstName: string;
  lastName: string;
}

interface LoginForm {
  email: string;
  password: string;
}

interface SignupForm extends LoginForm {
  first_name: string;
  last_name: string;
}

interface EventFormResponse {
  title: string;
  longitude: number;
  latitude: number;
  description: string;
  imageUrl: string;
}

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
  image: string;
  latitude: number;
  longitude: number;
  title: string
  upvotes: number;
  downvotes: number;
}

interface LoginForm {
  email: string,
  password: string
}

interface SignupForm extends LoginForm{
  first_name: string,
  last_name: string
}

interface EventForm { 
  title: string, 
  longitude: number, 
  latitude: number, 
  description: string, 
  imageUrl: string
}
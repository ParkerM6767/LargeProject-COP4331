import { useMemo } from "react";
import { Map } from "./components/Map";
import { MapZoom } from "./components/MapZoom";
import { useState } from "react";
import "./index.css";
import { LoginModal } from "./components/LoginModal";

const UCFLong = 28.60235;
const UCFLat = -81.2002;

const fakePosts: Post[] = [
  {
    creatorId: "1",
    description: "Some class",
    image: undefined,
    lattitude: UCFLat - 0.0002,
    longitude: UCFLong + 0.0013,
    upvotes: 0,
    downvotes: 0,
  },
  {
    creatorId: "5",
    description: "Really annoying construction",
    image: undefined,
    lattitude: UCFLat + 0.003,
    longitude: UCFLong - 0.0045,
    upvotes: 10,
    downvotes: 0,
  },
];

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setIsModalOpen(false);
  };

const UCFLong = 28.60235;
const UCFLat = -81.2002;

const fakePosts: Post[] = [
  {
    creatorId: "1",
    description: "Some class",
    image: undefined,
    lattitude: UCFLat - 0.0002,
    longitude: UCFLong + 0.0013,
    upvotes: 0,
    downvotes: 0,
  },
  {
    creatorId: "5",
    description: "Really annoying construction",
    image: undefined,
    lattitude: UCFLat + 0.003,
    longitude: UCFLong - 0.0045,
    upvotes: 10,
    downvotes: 0,
  },
];

export default App;

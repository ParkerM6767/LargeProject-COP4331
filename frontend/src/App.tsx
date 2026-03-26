import { useMemo } from "react";
import { Map } from "./components/Map";
import { MapZoom } from "./components/MapZoom";

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
  // Spoof getting the posts from the api
  const fetchedPosts = useMemo(
    () => new Promise<Post[]>((resolve) => setTimeout(() => resolve(fakePosts), 1500)),
    [],
  );

  return (
    <div className="w-screen h-screen absolute top-0 left-0">
      <Map posts={fetchedPosts}>
        <MapZoom />

        {/* The login component can be placed here, possibly
         in an absolute div for more control over position */}
      </Map>
    </div>
  );
}

export default App;

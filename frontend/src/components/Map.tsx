import { divIcon, type Map as MapType } from "leaflet";
import {
  Suspense,
  useContext,
  useEffect,
  useRef,
  type PropsWithChildren,
  type Ref,
} from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  type MapContainerProps,
} from "react-leaflet";
import { PostContext } from "../lib/postContext";
import { PostAnywhere } from "./PostAnywhere";
import { useTheme } from "./ui/themes";
import { ActivePost } from "./ActivePost";

export function Map({
  user,
  activePost,
  setActivePost,
  ref,
  children,
}: PropsWithChildren<{
  user: User | null;
  activePost: Post | null;
  setActivePost: (post: Post | null) => void;
  ref?: Ref<MapType | null>;
}>) {
  const mapRef = useRef<MapType>(null);
  const divRef = useRef<HTMLDivElement>(null);

  const { posts } = useContext(PostContext);

  // Leaflet doesn't recognize resizes on its own, so
  // we have to help with an observer
  useEffect(() => {
    const observer = new ResizeObserver(() => mapRef.current?.invalidateSize());

    if (divRef.current) {
      observer.observe(divRef.current);
    }

    return () => observer.disconnect();
  });

  // Constant props for the map pulled out for readability
  const mapConfig: Partial<MapContainerProps> = {
    center: [28.60235, -81.2002],
    maxBounds: [
      [28.58163, -81.24503],
      [28.61193, -81.17455],
    ],
    maxBoundsViscosity: 1,
    zoom: 16,
    minZoom: 13,
    zoomControl: false,
    doubleClickZoom: false,
    className: "h-full",
  };

  return (
    <div className="w-full h-full" ref={divRef}>
      <MapContainer
        {...mapConfig}
        ref={(r) => {
          mapRef.current = r;

          // Share the ref with the parent
          if (ref) {
            if (typeof ref === "function") {
              ref(r);
            } else {
              ref.current = r;
            }
          }
        }}
      >
        {/* Coloring for the map's dark mode */}
        <style>{`
          .dark .map-tiles {
            filter: brightness(0.6) invert(1) contrast(3) hue-rotate(200deg) saturate(0.3) brightness(0.7);
          }
        `}</style>

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="map-tiles"
        />

        {/* Allow the map to show while posts are being loaded */}
        <Suspense fallback={<></>}>
          <RenderPosts posts={posts} setActivePost={setActivePost} />
        </Suspense>

        {/* Let the user drop a new post by clicking on the map */}
        <PostAnywhere user={user} />

        {/* Details about the currently selected post */}
        {activePost && (
          <ActivePost post={activePost} user={user} clear={() => setActivePost(null)} />
        )}

        {/* Show any children in a layer above the map */}
        <div className="w-full z-1001 relative p-4">{children}</div>
      </MapContainer>
    </div>
  );
}

// To use `Suspense` properly, the `use` has to happen in a separate component.
// `use` in components is about the same as `await` in most cases
function RenderPosts({
  posts,
  setActivePost,
}: {
  posts: Post[];
  setActivePost: (post: Post | null) => void;
}) {
  const { theme } = useTheme();
  const map = useMap();

  return (
    <>
      {posts.map((post) => (
        <Marker
          key={post._id}
          icon={createEventIcon(theme === "dark")}
          position={[post.latitude, post.longitude]}
          eventHandlers={{
            click() {
              map.panTo([post.latitude, post.longitude]);
              setActivePost(post);
            },
          }}
        />
      ))}
    </>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function createEventIcon(darkmode: boolean) {
  // Gold on dark mode, black on light mode
  const color = darkmode ? "#ffc906" : "#171717";

  const svg = `
  <svg
    fill="${color}"
    viewBox="-64 0 512 512"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"></path>
  </svg>
  `;

  return divIcon({
    html: svg,
    className: "event-marker",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, 0],
  });
}

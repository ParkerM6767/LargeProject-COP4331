import { divIcon, type Map as MapType } from "leaflet";
import { Suspense, useEffect, useRef, type PropsWithChildren } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { PostAnywhere } from "./PostAnywhere";
import { useTheme } from "./ui/themes";

export function Map({
  posts,
  user,
  children,
}: PropsWithChildren<{
  posts: Post[];
  user: { firstName: string; lastName: string } | null;
}>) {
  const mapRef = useRef<MapType>(null);
  const divRef = useRef<HTMLDivElement>(null);

  // Leaflet doesn't recognize resizes on its own, so
  // we have to help with an observer
  useEffect(() => {
    const observer = new ResizeObserver(() => mapRef.current?.invalidateSize());

    if (divRef.current) {
      observer.observe(divRef.current);
    }

    return () => observer.disconnect();
  });

  return (
    <div className="w-full h-full" ref={divRef}>
      <MapContainer
        center={[28.60235, -81.2002]}
        maxBounds={[
          [28.58163, -81.24503],
          [28.61193, -81.17455],
        ]}
        maxBoundsViscosity={1}
        zoom={16}
        minZoom={13}
        zoomControl={false}
        doubleClickZoom={false}
        className="h-full"
        ref={mapRef}
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
          <RenderPosts posts={posts} />
        </Suspense>

        {/* Let the user drop a new post by clicking on the map */}
        <PostAnywhere user={user} />

        {/* Show any children in a layer above the map */}
        <div className="w-full h-full z-1001 relative p-4">{children}</div>
      </MapContainer>
    </div>
  );
}

// To use `Suspense` properly, the `use` has to happen in a separate component.
// `use` in components is about the same as `await` in most cases
function RenderPosts({ posts }: { posts: Post[] }) {
  const { theme } = useTheme();

  return (
    <>
      {posts.map((post) => (
        <Marker
          key={post._id}
          icon={createEventIcon(theme === "dark")}
          position={[post.latitude, post.longitude]}
        >
          <Popup>{post.description}</Popup>
        </Marker>
      ))}
    </>
  );
}

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

import type { Map as MapType } from "leaflet";
import { Suspense, useEffect, useRef, type PropsWithChildren } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { PostAnywhere } from "./PostAnywhere";

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
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
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
  return (
    <>
      {posts.map((post) => (
        <Marker key={post._id} position={[post.latitude, post.longitude]}>
          <Popup>{post.description}</Popup>
        </Marker>
      ))}
    </>
  );
}

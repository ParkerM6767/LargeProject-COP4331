import { Suspense, type PropsWithChildren } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

export function Map({
  posts,
  children,
}: PropsWithChildren<{ posts: Promise<Post[]> }>) {
  return (
    <MapContainer
      center={[28.60235, -81.2002]}
      zoom={16}
      zoomControl={false}
      className="h-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Allow the map to show while posts are being loaded */}
      <Suspense fallback={<></>}>
        <RenderPosts posts={posts} />
      </Suspense>

      {/* Show any children in a layer above the map */}
      <div className="w-full h-full z-1001 relative p-4">{children}</div>
    </MapContainer>
  );
}

// To use `Suspense` properly, the `await` has to happen in a separate component
async function RenderPosts({ posts }: { posts: Promise<Post[]> }) {
  return (
    <>
      {(await posts).map((post) => (
        <Marker position={[post.longitude, post.lattitude]}>
          <Popup>{post.description}</Popup>
        </Marker>
      ))}
    </>
  );
}

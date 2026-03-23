import { type PropsWithChildren } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

export function Map({
  posts,
  children,
}: PropsWithChildren<{ posts: Post[] | null }>) {
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
      {posts &&
        posts.map((post) => (
          <Marker position={[post.longitude, post.lattitude]}>
            <Popup>{post.description}</Popup>
          </Marker>
        ))}
      <div className="w-full h-full z-1001 relative p-4">{children}</div>
    </MapContainer>
  );
}

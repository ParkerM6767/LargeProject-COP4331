import { useState } from "react";
import { Marker, useMapEvent } from "react-leaflet";

import { Button } from "./ui/button";
import { Dialog } from "./ui/dialog";
import { AddEventModal } from "./AddEventModal";

export function PostAnywhere({
  user,
}: {
  user: { firstName: string; lastName: string } | null;
}) {
  const [menuCoords, setMenuCoords] = useState<{
    left: number;
    top: number;
  } | null>(null);
  const [postCoords, setPostCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [showModal, setShowModal] = useState(false);

  // Grab coordinates when the user right-clicks
  useMapEvent("contextmenu", (event) => {
    if (!user) return;

    setMenuCoords({
      left: event.containerPoint.x,
      top: event.containerPoint.y,
    });
    setPostCoords(event.latlng);
  });

  return (
    user && (
      <>
        {postCoords && <Marker position={postCoords}></Marker>}
        {menuCoords && (
          <div
            className="relative z-1050 w-0 h-0 flex justify-center"
            style={{ left: menuCoords.left, top: menuCoords.top + 8 }}
          >
            <Button variant="outline" onClick={() => setShowModal(true)}>
              Create Post
            </Button>
          </div>
        )}

        <Dialog
          open={showModal}
          onOpenChange={(state) => {
            if (state) {
              setShowModal(true);
            } else {
              setShowModal(false);
              setPostCoords(null);
              setMenuCoords(null);
            }
          }}
        >
          <AddEventModal
            longitude={postCoords?.lng || null}
            latitude={postCoords?.lat || null}
            closeModal={() => setShowModal(false)}
          />
        </Dialog>
      </>
    )
  );
}

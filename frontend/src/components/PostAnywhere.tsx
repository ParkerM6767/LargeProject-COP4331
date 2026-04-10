import { useState } from "react";
import { Marker, useMapEvents } from "react-leaflet";

import { Button } from "./ui/button";
import { Dialog } from "./ui/dialog";
import { AddEventModal } from "./AddEventModal";
import { createEventIcon } from "./Map";
import { useTheme } from "./ui/themes";

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
  const { theme } = useTheme();

  useMapEvents({
    // Grab coordinates when the user right-clicks
    contextmenu: (event) => {
      setMenuCoords({
        left: event.containerPoint.x,
        top: event.containerPoint.y,
      });
      setPostCoords(event.latlng);
    },
    // Clear the point when the user drags
    drag: () => {
      setMenuCoords(null);
      setPostCoords(null);
    },
  });

  return (
    <>
      {postCoords && (
        <Marker
          position={postCoords}
          icon={createEventIcon(theme === "dark")}
        ></Marker>
      )}
      {menuCoords && (
        <div
          className="relative z-1050 w-0 h-0 flex justify-center"
          style={{ left: menuCoords.left, top: menuCoords.top + 8 }}
        >
          <Button
            variant="outline"
            className="disabled:opacity-100"
            onClick={(event) => {
              console.log("clicked");
              event.stopPropagation();
              setShowModal(true);
            }}
            disabled={user === null}
          >
            {user ? "Create Post" : "Log in to create a post"}
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
          closeModal={() => {
            setShowModal(false);
            setPostCoords(null);
            setMenuCoords(null);
          }}
        />
      </Dialog>
    </>
  );
}

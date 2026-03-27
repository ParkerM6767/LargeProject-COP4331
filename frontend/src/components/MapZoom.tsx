import { ButtonGroup } from "./ui/button-group";
import { Button } from "./ui/button";
import { Minus, Plus } from "lucide-react";
import { useMap } from "react-leaflet";

export function MapZoom() {
  const map = useMap();

  return (
    <ButtonGroup className="z-500">
      <Button
        onClick={(e) => {
          map.zoomIn();
          e.stopPropagation();
        }}
      >
        <Plus />
      </Button>
      <Button
        onClick={(e) => {
          map.zoomOut();
          e.stopPropagation();
        }}
      >
        <Minus />
      </Button>
    </ButtonGroup>
  );
}

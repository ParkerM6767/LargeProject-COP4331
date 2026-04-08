import * as React from "react";
import { useCallback, useState } from "react";

const MOBILE_BREAKPOINT = 768;

// Pulled from shadcn
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined,
  );

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}

export function useGeolocation() {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [geoError, setGeoError] = useState("");
  const [geoLoading, setGeoLoading] = useState(false);

  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported by your browser.");
      return;
    }

    setGeoLoading(true);
    setGeoError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setGeoLoading(false);
      },
      (err) => {
        const messages: Record<number, string> = {
          1: "Location access denied. Please allow location access to report events.",
          2: "Location unavailable. Please try again.",
          3: "Location request timed out. Please try again.",
        };
        setGeoError(messages[err.code] || "Failed to get location.");
        setGeoLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  }, []);

  const clearCoords = useCallback(() => {
    setCoords(null);
    setGeoError("");
  }, []);

  return { coords, geoError, geoLoading, getLocation, clearCoords };
}

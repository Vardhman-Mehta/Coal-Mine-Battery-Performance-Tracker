import Map from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

export default function MapPreview() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "12px",
        overflow: "hidden",
        pointerEvents: "none", // 🔥 Disable interaction in preview
      }}
    >

      <Map
        ref={mapRef}
        mapboxAccessToken={MAPBOX_TOKEN}
        initialViewState={{
          latitude: 23.5,
          longitude: 77.2,
          zoom: 15,
          pitch: 60,
          bearing: -20,
        }}
        mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
        style={{ width: "100%", height: "100%" }}
        maxPitch={85}
        dragPan
        dragRotate
        scrollZoom
        touchZoomRotate
        pitchWithRotate
        keyboard
        interactive
      >
        <NavigationControl position="bottom-right" />
      </Map>
    </div>
  );
}
import { Interactive } from "@react-three/xr";
import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";

import Panel3D from "../components/Panel3D";
import MapPreview from "../components/MapPreview";
import ExperienceGuide3D from "../components/ExperienceGuide3D";

import HumidityChart3D from "../components/3DCharts/HumidityChart3D";
import HumidityTemperatureChart3D from "../components/3DCharts/HumidityTemperatureChart3D";
import TemperatureHumidityRelation3D from "../components/3DCharts/TemperatureHumidityRelation3D";
import VoltageTemperatureChart3D from "../components/3DCharts/VoltageTemperatureChart3D";
import GaugeChart3D from "../components/3DCharts/GaugeChart3D";

import { useChartData } from "../hooks/useChartData";

export default function ControlRoom({
  activePanelRef,
  onActivePanelChange,
  experiencePOV = false,
  isPresenting = false,
  onToggleExperience,
  experienceEyeRef,
  experienceLookTargetRef,
}) {
  const [activePanel, setActivePanel] = useState(null);
  const chartData = useChartData(3000);

  const panels = {
    tempHum: useRef(),
    tempHumidityChart: useRef(),
    humidity: useRef(),
    map: useRef(),
    voltage: useRef(),
    bottom: useRef(),
  };

  const baseZ = {
    back: -0.2,
    middle: 0,
  };

  const defaultZ = {
    tempHum: baseZ.back,
    tempHumidityChart: baseZ.back,
    humidity: baseZ.middle,
    map: baseZ.middle,
    voltage: baseZ.middle,
    bottom: baseZ.middle,
  };

  const interactionsLocked = experiencePOV;

  const togglePanel = (key) => {
    if (interactionsLocked) {
      return;
    }

    setActivePanel((currentPanel) => (currentPanel === key ? null : key));
  };

  useEffect(() => {
    if (activePanel === "map" && !experiencePOV) {
      window.dispatchEvent(new Event("open-map"));
    }
  }, [activePanel, experiencePOV]);

  useEffect(() => {
    const closeMap = () => {
      setActivePanel(null);
    };

    window.addEventListener("close-map", closeMap);

    return () => {
      window.removeEventListener("close-map", closeMap);
    };
  }, []);

  useEffect(() => {
    onActivePanelChange?.(activePanel);
  }, [activePanel, onActivePanelChange]);

  useEffect(() => {
    if (!experiencePOV) {
      return;
    }

    setActivePanel(null);
    window.dispatchEvent(new Event("close-map"));
  }, [experiencePOV]);

  useFrame(() => {
    if (experiencePOV) {
      if (activePanelRef) {
        activePanelRef.current = null;
      }
      return;
    }

    let foundActive = false;

    Object.entries(panels).forEach(([key, ref]) => {
      if (!ref.current) return;

      if (activePanel === key && activePanelRef) {
        activePanelRef.current = ref.current;
        foundActive = true;
      }
    });

    if (!foundActive && activePanelRef) {
      activePanelRef.current = null;
    }
  });

  return (
    <group onClick={() => !interactionsLocked && setActivePanel(null)}>
      <ExperienceGuide3D
        isActive={experiencePOV}
        disabled={isPresenting}
        onToggle={onToggleExperience}
        eyeAnchorRef={experienceEyeRef}
        lookTargetRef={experienceLookTargetRef}
      />

      <Interactive onSelect={() => togglePanel("tempHum")}>
        <group
          ref={panels.tempHum}
          position={[-1.6, 0.8, defaultZ.tempHum]}
          onClick={(event) => {
            event.stopPropagation();
            togglePanel("tempHum");
          }}
        >
          <Panel3D isActive={activePanel === "tempHum"}>
            <TemperatureHumidityRelation3D data={chartData.data} />
          </Panel3D>
        </group>
      </Interactive>

      <Interactive onSelect={() => togglePanel("tempHumidityChart")}>
        <group
          ref={panels.tempHumidityChart}
          position={[1.6, 0.8, defaultZ.tempHumidityChart]}
          onClick={(event) => {
            event.stopPropagation();
            togglePanel("tempHumidityChart");
          }}
        >
          <Panel3D isActive={activePanel === "tempHumidityChart"}>
            <HumidityTemperatureChart3D data={chartData.data} />
          </Panel3D>
        </group>
      </Interactive>

      <Interactive onSelect={() => togglePanel("humidity")}>
        <group
          ref={panels.humidity}
          position={[-1.6, 0, defaultZ.humidity]}
          onClick={(event) => {
            event.stopPropagation();
            togglePanel("humidity");
          }}
        >
          <Panel3D isActive={activePanel === "humidity"}>
            <HumidityChart3D humidity={chartData.humidity} data={chartData.data} />
          </Panel3D>
        </group>
      </Interactive>

      <Interactive onSelect={() => togglePanel("map")}>
        <group
          ref={panels.map}
          position={[0, 0, defaultZ.map]}
          onClick={(event) => {
            event.stopPropagation();
            togglePanel("map");
          }}
        >
          <Panel3D title="Location Tracing" isActive={activePanel === "map"}>
            {activePanel !== "map" && (
              <Html
                transform
                position={[0, 0, 0.05]}
                style={{
                  width: "360px",
                  height: "180px",
                }}
                distanceFactor={1.5}
                pointerEvents={experiencePOV ? "none" : "auto"}
                zIndexRange={[50, 0]}
              >
                <MapPreview />
              </Html>
            )}
          </Panel3D>
        </group>
      </Interactive>

      <Interactive onSelect={() => togglePanel("voltage")}>
        <group
          ref={panels.voltage}
          position={[1.6, 0, defaultZ.voltage]}
          onClick={(event) => {
            event.stopPropagation();
            togglePanel("voltage");
          }}
        >
          <Panel3D isActive={activePanel === "voltage"}>
            <VoltageTemperatureChart3D data={chartData.data} />
          </Panel3D>
        </group>
      </Interactive>

      <Interactive onSelect={() => togglePanel("bottom")}>
        <group
          ref={panels.bottom}
          position={[0, -0.9, defaultZ.bottom]}
          onClick={(event) => {
            event.stopPropagation();
            togglePanel("bottom");
          }}
        >
          <Panel3D isActive={activePanel === "bottom"}>
            <GaugeChart3D
              humidity={chartData.humidity}
              temperature={chartData.temperature}
              voltage={chartData.voltage}
            />
          </Panel3D>
        </group>
      </Interactive>
    </group>
  );
}

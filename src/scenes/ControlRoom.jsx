




// import { Interactive } from "@react-three/xr";

// import Panel3D from "../components/Panel3D";
// import TextValue3D from "../components/TextValue3D";
// import MapPlane3D from "../components/MapPlane3D";

// export default function ControlRoom() {
//   const humidity = 0;
//   const temperature = 0;
//   const voltage1 = 0;
//   const voltage2 = 0.02;

//   return (
//     <group position={[0, 0, 0]}>

//       {/* ───────── TOP ROW (slightly back) ───────── */}
//       <Interactive onSelect={() => console.log("Temp-Hum Relation selected")}>
//         <Panel3D
//           title="Temp-Hum Relation"
//           position={[-1.8, 0.8, -0.2]}   // 👈 z = -0.2
//         />
//       </Interactive>

//       <Interactive onSelect={() => console.log("Temp-Humidity Chart selected")}>
//         <Panel3D
//           title="Temp-Humidity Chart"
//           position={[1.8, 0.8, -0.2]}    // 👈 z = -0.2
//         />
//       </Interactive>

//       {/* ───────── MIDDLE ROW (base plane) ───────── */}
//       <Interactive onSelect={() => console.log("Humidity Monitoring selected")}>
//         <Panel3D
//           title="Humidity Monitoring"
//           position={[-1.8, 0, 0]}        // 👈 z = 0
//         >
//           <TextValue3D label="Humidity" value={humidity} position={[0, 0.1, 0]} />
//         </Panel3D>
//       </Interactive>

//       {/* Map stays in middle plane */}
//       <MapPlane3D position={[0, 0, 0]} />

//       <Interactive onSelect={() => console.log("Voltage-Temp selected")}>
//         <Panel3D
//           title="Voltage-Temp"
//           position={[1.8, 0, 0]}         // 👈 z = 0
//         >
//           <TextValue3D label="Voltage" value={voltage1} position={[0, 0.1, 0]} />
//           <TextValue3D label="Temp" value={temperature} position={[0, -0.1, 0]} />
//         </Panel3D>
//       </Interactive>

//       {/* ───────── BOTTOM ROW (slightly forward) ───────── */}
//       <Interactive onSelect={() => console.log("Voltage Monitoring selected")}>
//         <Panel3D
//           title="Voltage Monitoring & Temp"
//           position={[0, -0.9, 0.2]}      // 👈 z = +0.2
//         >
//           <TextValue3D label="V1" value={voltage1} position={[-0.5, 0, 0]} />
//           <TextValue3D label="V2" value={voltage2} position={[0.5, 0, 0]} />
//         </Panel3D>
//       </Interactive>

//     </group>
//   );
// }



import { Interactive } from "@react-three/xr";
import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";

import Panel3D from "../components/Panel3D";
import TextValue3D from "../components/TextValue3D";
import MapPlane3D from "../components/MapPlane3D";

export default function ControlRoom({activePanelRef}) {
  const [activePanel, setActivePanel] = useState(null);

  const panels = {
    tempHum: useRef(),
    tempHumidityChart: useRef(),
    humidity: useRef(),
    voltage: useRef(),
    bottom: useRef(),
  };

  const baseZ = {
    back: -0.2,
    middle: 0,
    front: 0.35,
  };

  const defaultZ = {
    tempHum: baseZ.back,
    tempHumidityChart: baseZ.back,
    humidity: baseZ.middle,
    voltage: baseZ.middle,
    bottom: baseZ.middle,
  };

  // Smooth animation
  useFrame(() => {
    let foundActive = false;
  
    Object.entries(panels).forEach(([key, ref]) => {
      if (!ref.current) return;
  
      const isActive = activePanel === key;
      const targetZ = isActive ? baseZ.front : defaultZ[key];
      const targetScale = isActive ? 1.05 : 1;
  
      ref.current.position.z +=
        (targetZ - ref.current.position.z) * 0.08;
  
      ref.current.scale.x +=
        (targetScale - ref.current.scale.x) * 0.08;
      ref.current.scale.y +=
        (targetScale - ref.current.scale.y) * 0.08;
      ref.current.scale.z +=
        (targetScale - ref.current.scale.z) * 0.08;
  
      // ✅ Set active panel ref safely
      if (isActive && activePanelRef) {
        activePanelRef.current = ref.current;
        foundActive = true;
      }
    });
  
    // ✅ Clear ref when nothing active
    if (!foundActive && activePanelRef) {
      activePanelRef.current = null;
    }
  });
  

  return (
    <group onClick={() => setActivePanel(null)}>
      
      {/* ───── TOP LEFT ───── */}
      <Interactive onSelect={() => setActivePanel(activePanel === "tempHum" ? null : "tempHum")}>
        <group
          ref={panels.tempHum}
          position={[-1.6, 0.8, defaultZ.tempHum]}
          onClick={(e) => {
            e.stopPropagation();
            setActivePanel(activePanel === "tempHum" ? null : "tempHum");
          }}
        >
          <Panel3D
            title="Temp-Hum Relation"
            isActive={activePanel === "tempHum"}
          />
        </group>
      </Interactive>

      {/* ───── TOP RIGHT ───── */}
      <Interactive onSelect={() => setActivePanel(activePanel === "tempHumidityChart" ? null : "tempHumidityChart")}>
        <group
          ref={panels.tempHumidityChart}
          position={[1.6, 0.8, defaultZ.tempHumidityChart]}
          onClick={(e) => {
            e.stopPropagation();
            setActivePanel(activePanel === "tempHumidityChart" ? null : "tempHumidityChart");
          }}
        >
          <Panel3D
            title="Temp-Humidity Chart"
            isActive={activePanel === "tempHumidityChart"}
          />
        </group>
      </Interactive>

      {/* ───── MIDDLE LEFT ───── */}
      <Interactive onSelect={() => setActivePanel(activePanel === "humidity" ? null : "humidity")}>
        <group
          ref={panels.humidity}
          position={[-1.6, 0, defaultZ.humidity]}
          onClick={(e) => {
            e.stopPropagation();
            setActivePanel(activePanel === "humidity" ? null : "humidity");
          }}
        >
          <Panel3D
            title="Humidity Monitoring"
            isActive={activePanel === "humidity"}
          >
            <TextValue3D label="Humidity" value={0} position={[0, 0.1, 0]} />
          </Panel3D>
        </group>
      </Interactive>

      {/* ───── MAP (VISUAL ONLY) ───── */}
      <MapPlane3D position={[0, 0, baseZ.middle]} />

      {/* ───── MIDDLE RIGHT ───── */}
      <Interactive onSelect={() => setActivePanel(activePanel === "voltage" ? null : "voltage")}>
        <group
          ref={panels.voltage}
          position={[1.6, 0, defaultZ.voltage]}
          onClick={(e) => {
            e.stopPropagation();
            setActivePanel(activePanel === "voltage" ? null : "voltage");
          }}
        >
          <Panel3D
            title="Voltage-Temp"
            isActive={activePanel === "voltage"}
          >
            <TextValue3D label="Voltage" value={0} position={[0, 0.1, 0]} />
            <TextValue3D label="Temp" value={0} position={[0, -0.1, 0]} />
          </Panel3D>
        </group>
      </Interactive>

      {/* ───── BOTTOM ───── */}
      <Interactive onSelect={() => setActivePanel(activePanel === "bottom" ? null : "bottom")}>
        <group
          ref={panels.bottom}
          position={[0, -0.9, defaultZ.bottom]}
          onClick={(e) => {
            e.stopPropagation();
            setActivePanel(activePanel === "bottom" ? null : "bottom");
          }}
        >
          <Panel3D
            title="Voltage Monitoring & Temp"
            isActive={activePanel === "bottom"}
          >
            <TextValue3D label="V1" value={0} position={[-0.5, 0, 0]} />
            <TextValue3D label="V2" value={0.02} position={[0.5, 0, 0]} />
          </Panel3D>
        </group>
      </Interactive>

    </group>
  );
}

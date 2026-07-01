import React, { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export default function FloatingShapes({ scrollProgress, mousePosition }) {
  const groupRef = useRef();
  const { viewport } = useThree();
  
  const shapes = useMemo(() => [
    { type: "icosahedron", position: [-3, 2, -2], scale: 0.8, color: "#84cc16", rotationSpeed: 0.3 },
    { type: "octahedron", position: [3, -1, -3], scale: 0.6, color: "#a3e635", rotationSpeed: -0.2 },
    { type: "dodecahedron", position: [-2, -3, -4], scale: 0.7, color: "#22c55e", rotationSpeed: 0.25 },
    { type: "tetrahedron", position: [4, 3, -2.5], scale: 0.5, color: "#34d399", rotationSpeed: -0.35 },
    { type: "sphere", position: [0, 4, -5], scale: 0.9, color: "#65a30d", rotationSpeed: 0.15 },
    { type: "torus", position: [-4, -2, -3.5], scale: 0.6, color: "#84cc16", rotationSpeed: 0.4 },
  ], []);
  
  useFrame((state) => {
    if (!groupRef.current) return;
    
    const time = state.clock.getElapsedTime();
    
    shapes.forEach((shape, index) => {
      const mesh = groupRef.current.children[index];
      if (mesh) {
        // Base rotation
        mesh.rotation.x += shape.rotationSpeed * 0.01;
        mesh.rotation.y += shape.rotationSpeed * 0.015;
        
        // Floating motion
        mesh.position.y = shape.position[1] + Math.sin(time * 0.5 + index) * 0.3;
        
        // Scroll-based movement
        mesh.position.x = shape.position[0] + Math.sin(scrollProgress * 0.01 + index) * 0.5;
        mesh.position.z = shape.position[2] + Math.cos(scrollProgress * 0.008 + index) * 0.3;
        
        // Mouse interaction - slight parallax
        if (mousePosition) {
          mesh.rotation.x += mousePosition.y * 0.1;
          mesh.rotation.y += mousePosition.x * 0.1;
        }
        
        // Scale pulse effect
        const scalePulse = 1 + Math.sin(time * 2 + index) * 0.05;
        mesh.scale.setScalar(shape.scale * scalePulse);
      }
    });
  });
  
  return (
    <group ref={groupRef}>
      {shapes.map((shape, index) => {
        const geometryProps = {
          icosahedron: { args: [1, 0] },
          octahedron: { args: [1, 0] },
          dodecahedron: { args: [1, 0] },
          tetrahedron: { args: [1, 0] },
          sphere: { args: [1, 32, 32] },
          torus: { args: [1, 0.3, 16, 32] },
        };
        
        return (
          <mesh
            key={index}
            position={shape.position}
          >
            {shape.type === "icosahedron" && <icosahedronGeometry {...geometryProps[shape.type]} />}
            {shape.type === "octahedron" && <octahedronGeometry {...geometryProps[shape.type]} />}
            {shape.type === "dodecahedron" && <dodecahedronGeometry {...geometryProps[shape.type]} />}
            {shape.type === "tetrahedron" && <tetrahedronGeometry {...geometryProps[shape.type]} />}
            {shape.type === "sphere" && <sphereGeometry {...geometryProps[shape.type]} />}
            {shape.type === "torus" && <torusGeometry {...geometryProps[shape.type]} />}
            <meshPhysicalMaterial
              color={shape.color}
              transparent
              opacity={0.6}
              roughness={0.2}
              metalness={0.8}
              transmission={0.5}
              thickness={1}
            />
          </mesh>
        );
      })}
    </group>
  );
}
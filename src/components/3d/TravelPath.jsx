import React, { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export default function TravelPath({ scrollProgress }) {
  const lineRef = useRef();
  const dotsRef = useRef();
  const { viewport } = useThree();
  
  const pathData = useMemo(() => {
    // Create a winding path representing travel routes
    const points = [];
    const dotPositions = [];
    
    // Generate a curved path
    for (let i = 0; i <= 50; i++) {
      const t = i / 50;
      const x = (t - 0.5) * viewport.width * 2.5;
      const y = Math.sin(t * Math.PI * 3) * 3 + (t - 0.5) * viewport.height;
      const z = Math.cos(t * Math.PI * 2) * 2 - 3;
      points.push(new THREE.Vector3(x, y, z));
      
      // Add dots at certain intervals
      if (i % 10 === 0) {
        dotPositions.push(new THREE.Vector3(x, y, z));
      }
    }
    
    return { points, dotPositions };
  }, [viewport]);
  
  useFrame((state) => {
    if (!lineRef.current || !dotsRef.current) return;
    
    const time = state.clock.getElapsedTime();
    
    // Animate the path visibility based on scroll
    const drawRange = Math.min(1, scrollProgress * 0.001 + 0.1);
    lineRef.current.geometry.setDrawRange(0, Math.floor(50 * drawRange));
    
    // Animate dots
    dotsRef.current.children.forEach((dot, index) => {
      const visible = index < Math.ceil(drawRange * 5);
      dot.visible = visible;
      
      if (visible) {
        const pulse = 1 + Math.sin(time * 3 + index) * 0.3;
        dot.scale.setScalar(pulse);
        dot.material.opacity = 0.5 + Math.sin(time * 2 + index) * 0.3;
      }
    });
  });
  
  return (
    <group>
      {/* Animated path line */}
      <line ref={lineRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={pathData.points.length}
            array={new Float32Array(pathData.points.flatMap(p => [p.x, p.y, p.z]))}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#84cc16" transparent opacity={0.4} linewidth={2} />
      </line>
      
      {/* Glowing dots along the path */}
      <group ref={dotsRef}>
        {pathData.dotPositions.map((pos, index) => (
          <mesh key={index} position={pos}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshBasicMaterial 
              color="#a3e635" 
              transparent 
              opacity={0.8}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}
import React, { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export default function ScrollingParticles({ scrollProgress, count = 200 }) {
  const points = useRef();
  const { viewport } = useThree();
  
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const speeds = new Float32Array(count);
    
    const colorPalette = [
      new THREE.Color("#84cc16"), // lime-500
      new THREE.Color("#a3e635"), // lime-400
      new THREE.Color("#65a30d"), // lime-600
      new THREE.Color("#22c55e"), // green-500
      new THREE.Color("#34d399"), // emerald-400
    ];
    
    for (let i = 0; i < count; i++) {
      // Position particles in a wave-like pattern
      const i3 = i * 3;
      const x = (Math.random() - 0.5) * viewport.width * 3;
      const y = (Math.random() - 0.5) * viewport.height * 3;
      const z = (Math.random() - 0.5) * 20 - 5;
      
      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;
      
      // Random color from palette
      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
      
      sizes[i] = Math.random() * 0.5 + 0.1;
      speeds[i] = Math.random() * 0.5 + 0.5;
    }
    
    return { positions, colors, sizes, speeds };
  }, [count, viewport]);
  
  useFrame((state) => {
    if (!points.current) return;
    
    const positions = points.current.geometry.attributes.position.array;
    const time = state.clock.getElapsedTime();
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const speed = particlesPosition.speeds[i];
      
      // Create flowing wave motion
      positions[i3 + 1] += Math.sin(time * speed + positions[i3]) * 0.002;
      positions[i3] += Math.cos(time * speed * 0.5 + positions[i3 + 1]) * 0.001;
      
      // Scroll-based vertical movement
      positions[i3 + 1] -= scrollProgress * 0.01 * speed;
      
      // Wrap around effect
      if (positions[i3 + 1] < -viewport.height * 2) {
        positions[i3 + 1] = viewport.height * 2;
      }
    }
    
    points.current.geometry.attributes.position.needsUpdate = true;
  });
  
  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesPosition.positions.length / 3}
          array={particlesPosition.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particlesPosition.colors.length / 3}
          array={particlesPosition.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
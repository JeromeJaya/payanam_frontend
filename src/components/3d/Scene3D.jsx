import React, { Suspense, useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Environment, Float } from "@react-three/drei";
import ScrollingParticles from "./ScrollingParticles";
import FloatingShapes from "./FloatingShapes";
import TravelPath from "./TravelPath";

function CameraController({ scrollProgress }) {
  const { camera } = useThree();
  
  useFrame(() => {
    // Smooth camera movement based on scroll
    const targetY = scrollProgress * 0.005;
    camera.position.y += (targetY - camera.position.y) * 0.05;
    camera.lookAt(0, camera.position.y * 0.5, 0);
  });
  
  return null;
}

function SceneContent({ scrollProgress, mousePosition }) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
      <CameraController scrollProgress={scrollProgress} />
      
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.8} color="#84cc16" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#a3e635" />
      <spotLight
        position={[0, 10, 5]}
        angle={0.5}
        penumbra={1}
        intensity={1}
        castShadow
      />
      
      {/* Environment for reflections */}
      <Environment preset="city" />
      
      {/* 3D Elements */}
      <ScrollingParticles scrollProgress={scrollProgress} count={150} />
      <FloatingShapes scrollProgress={scrollProgress} mousePosition={mousePosition} />
      <TravelPath scrollProgress={scrollProgress} />
      
      {/* Optional: OrbitControls for user interaction */}
      <OrbitControls 
        enableZoom={false} 
        enablePan={false}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 1.5}
        minAzimuthAngle={-Math.PI / 6}
        maxAzimuthAngle={Math.PI / 6}
      />
    </>
  );
}

export default function Scene3D({ scrollProgress, mousePosition }) {
  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      <Canvas
        dpr={[1, 2]}
        gl={{ 
          antialias: true, 
          alpha: true,
          toneMapping: 3,
          toneMappingExposure: 1.2
        }}
        className="w-full h-full"
      >
        <Suspense fallback={null}>
          <SceneContent scrollProgress={scrollProgress} mousePosition={mousePosition} />
        </Suspense>
      </Canvas>
    </div>
  );
}
"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import React, { useRef, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

interface StudioCanvasProps {
  imageUrl: string | null;
  frameColor: string;
  layoutSize: "Mini" | "Square" | "Wide";
  customText: string;
  materialType: "acrylic" | "wood" | "matte";
}

// 3D Model representing the physical frame
function FrameModel({ imageUrl, frameColor, layoutSize, customText, materialType }: StudioCanvasProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [dynamicTexture, setDynamicTexture] = useState<THREE.CanvasTexture | null>(null);

  // Determine physical dimensions based on selected size (FR-1.3)
  let width = 2.5;
  let height = 2.5;

  if (layoutSize === "Mini") {
    width = 2.0;
    height = 3.0;
  } else if (layoutSize === "Wide") {
    width = 3.5;
    height = 2.5;
  }

  // Effect to generate and update dynamic texture map merging image and custom text (FR-1.2)
  useEffect(() => {
    // Create offscreen canvas to merge photo and text overlay
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      // 1. Fill base Polaroid white matte card
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, 1024, 1024);

      // 2. Load and draw the uploaded photo
      if (imageUrl) {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          // Photo dimensions and layout on card
          // Photo is centered vertically/horizontally in its designated photo zone
          const margin = 50;
          const photoW = 1024 - (margin * 2);
          const photoH = 780; // reserve space at bottom for text
          
          // Draw image inside photo boundaries (fit cover)
          const imgRatio = img.width / img.height;
          const zoneRatio = photoW / photoH;
          
          let drawW = photoW;
          let drawH = photoH;
          let dx = margin;
          let dy = margin;

          if (imgRatio > zoneRatio) {
            // image is wider
            const scale = photoH / img.height;
            drawW = img.width * scale;
            dx = margin - (drawW - photoW) / 2;
          } else {
            // image is taller
            const scale = photoW / img.width;
            drawH = img.height * scale;
            dy = margin - (drawH - photoH) / 2;
          }

          // Clip image to photo zone
          ctx.save();
          ctx.beginPath();
          ctx.rect(margin, margin, photoW, photoH);
          ctx.clip();
          ctx.drawImage(img, dx, dy, drawW, drawH);
          ctx.restore();

          // 3. Draw polaroid inner frame shadow outline
          ctx.strokeStyle = "rgba(0,0,0,0.08)";
          ctx.lineWidth = 4;
          ctx.strokeRect(margin, margin, photoW, photoH);

          // 4. Draw Custom Handwriting Overlay text at the bottom margin
          if (customText) {
            ctx.fillStyle = "#2d2d2d";
            ctx.font = "bold 48px 'Caveat', cursive, 'Segoe Print'";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(customText, 1024 / 2, 910);
          }

          // Update texture
          const newTex = new THREE.CanvasTexture(canvas);
          newTex.needsUpdate = true;
          setDynamicTexture(newTex);
        };
        img.src = imageUrl;
      } else {
        // Draw placeholder layout
        ctx.fillStyle = "#f3f3f0";
        ctx.fillRect(80, 80, 1024 - 160, 720);
        
        ctx.fillStyle = "#a3a3a0";
        ctx.font = "40px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Upload Photo to Render", 1024 / 2, 440);

        if (customText) {
          ctx.fillStyle = "#2d2d2d";
          ctx.font = "bold 48px 'Caveat', cursive, 'Segoe Print'";
          ctx.textAlign = "center";
          ctx.fillText(customText, 1024 / 2, 910);
        }

        const newTex = new THREE.CanvasTexture(canvas);
        newTex.needsUpdate = true;
        setDynamicTexture(newTex);
      }
    }
  }, [imageUrl, customText, layoutSize]);

  // Handle auto-rotation tilt
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y = -0.2;
    }
  }, []);

  // Frame colors & material configurations
  let frameRoughness = 0.2;
  let frameMetalness = 0.1;
  const frameColorValue = frameColor;

  if (materialType === "acrylic") {
    frameRoughness = 0.05;
    frameMetalness = 0.4;
  } else if (materialType === "wood") {
    frameRoughness = 0.8;
    frameMetalness = 0.0;
  }

  return (
    <group>
      {/* 1. Main outer border (The Frame Material) */}
      <mesh ref={meshRef} castShadow receiveShadow>
        <boxGeometry args={[width, height, 0.16]} />
        <meshStandardMaterial 
          color={frameColorValue} 
          roughness={frameRoughness} 
          metalness={frameMetalness}
        />

        {/* 2. Front Face Polaroid Film Paper Stock */}
        <mesh position={[0, 0, 0.09]}>
          <planeGeometry args={[width - 0.15, height - 0.15]} />
          {dynamicTexture ? (
            <meshStandardMaterial map={dynamicTexture} roughness={0.65} />
          ) : (
            <meshStandardMaterial color="#FAF9F6" roughness={0.7} />
          )}
        </mesh>

        {/* 3. Shadow catcher backing plate */}
        <mesh position={[0, 0, -0.09]} receiveShadow>
          <planeGeometry args={[width, height]} />
          <meshStandardMaterial color="#555555" roughness={0.9} />
        </mesh>
      </mesh>
    </group>
  );
}

export default function StudioCanvas(props: StudioCanvasProps) {
  return (
    <div className="w-full h-full min-h-[350px] relative rounded-2xl overflow-hidden bg-neutral-900 shadow-inner flex items-center justify-center">
      {/* Floating Instructions */}
      <div className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg text-white/80 text-[11px] font-sans pointer-events-none select-none">
        Drag to rotate 3D view &middot; Pinch to zoom
      </div>

      <Canvas
        shadows
        camera={{ position: [0, 0, 4.2], fov: 50 }}
        style={{ width: "100%", height: "100%" }}
      >
        <ambientLight intensity={0.95} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[-5, -5, -5]} intensity={0.5} />

        <React.Suspense fallback={null}>
          <FrameModel {...props} />
        </React.Suspense>

        <OrbitControls 
          enableDamping 
          dampingFactor={0.05} 
          minDistance={1.8} 
          maxDistance={8} 
        />
      </Canvas>
    </div>
  );
}

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  Rotate3d,
  Maximize2,
  Minimize2,
  Sun,
  Eye,
  Camera,
  Layers,
  Sparkles,
  Box,
  RotateCcw,
  Sliders
} from 'lucide-react';

export type ModelType = 'gamer_desk' | 'printed_stand' | 'cnc_relief' | 'toolpath_wireframe';

interface Interactive3DViewerProps {
  initialModel?: ModelType;
  height?: string;
  showControls?: boolean;
  className?: string;
}

export const Interactive3DViewer: React.FC<Interactive3DViewerProps> = ({
  initialModel = 'gamer_desk',
  height = '420px',
  showControls = true,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [modelType, setModelType] = useState<ModelType>(initialModel);
  const [materialFinish, setMaterialFinish] = useState<'freijo' | 'black_tx' | 'white_tx' | 'petg_cyan'>('freijo');
  const [isWireframe, setIsWireframe] = useState<boolean>(false);
  const [isRotating, setIsRotating] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // References to keep Three.js instances
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const currentMeshGroupRef = useRef<THREE.Group | null>(null);
  const frameIdRef = useRef<number | null>(null);

  // Mouse interaction state
  const isDraggingRef = useRef<boolean>(false);
  const previousMousePositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const heightPx = containerRef.current.clientHeight || 420;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0e0c0b);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / heightPx, 0.1, 1000);
    camera.position.set(0, 15, 25);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    renderer.setSize(width, heightPx);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(renderer.domElement);

    // 4. Studio Lighting (Warm Artisan Wood Studio)
    const ambientLight = new THREE.AmbientLight(0xfff5ea, 0.9);
    scene.add(ambientLight);

    const mainKeyLight = new THREE.DirectionalLight(0xf5c27f, 1.6);
    mainKeyLight.position.set(15, 25, 15);
    mainKeyLight.castShadow = true;
    mainKeyLight.shadow.mapSize.width = 1024;
    mainKeyLight.shadow.mapSize.height = 1024;
    scene.add(mainKeyLight);

    const rimLight = new THREE.DirectionalLight(0x7dd396, 0.8);
    rimLight.position.set(-15, 10, -15);
    scene.add(rimLight);

    // Floor Grid Shadow Receiver
    const gridHelper = new THREE.GridHelper(30, 30, 0x2f2722, 0x1b1715);
    gridHelper.position.y = -5;
    scene.add(gridHelper);

    // 5. Animation Loop
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);

      if (currentMeshGroupRef.current && isRotating && !isDraggingRef.current) {
        currentMeshGroupRef.current.rotation.y += 0.005;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 6. Resize Observer
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight || 420;
      cameraRef.current.aspect = newWidth / newHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (frameIdRef.current) cancelAnimationFrame(frameIdRef.current);
      renderer.dispose();
    };
  }, []);

  // Update 3D Geometry whenever modelType, materialFinish or wireframe changes
  useEffect(() => {
    if (!sceneRef.current) return;

    // Remove existing mesh group
    if (currentMeshGroupRef.current) {
      sceneRef.current.remove(currentMeshGroupRef.current);
    }

    const group = new THREE.Group();
    currentMeshGroupRef.current = group;

    // Colors & Textures
    const colorMap = {
      freijo: 0xc4945d, // Louro Freijó
      black_tx: 0x1f1916, // Grafite/Preto TX
      white_tx: 0xf5eeea, // Branco TX
      petg_cyan: 0x2a9d8f, // Filamento 3D PETG
    };

    const mainColor = colorMap[materialFinish];

    const woodMaterial = new THREE.MeshStandardMaterial({
      color: mainColor,
      roughness: materialFinish === 'petg_cyan' ? 0.3 : 0.65,
      metalness: materialFinish === 'petg_cyan' ? 0.2 : 0.05,
      wireframe: isWireframe,
    });

    const metalMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      roughness: 0.3,
      metalness: 0.85,
      wireframe: isWireframe,
    });

    const ledGlowMaterial = new THREE.MeshBasicMaterial({
      color: 0x7dd396,
      wireframe: isWireframe,
    });

    const toolpathMaterial = new THREE.LineBasicMaterial({
      color: 0xf5c27f,
      linewidth: 2,
    });

    // BUILD DIFFERENT 3D MODELS
    if (modelType === 'gamer_desk') {
      // 1. Table Top (Chapa de MDF com chanfro)
      const topGeo = new THREE.BoxGeometry(16, 0.8, 8);
      const topMesh = new THREE.Mesh(topGeo, woodMaterial);
      topMesh.position.y = 1;
      topMesh.castShadow = true;
      topMesh.receiveShadow = true;
      group.add(topMesh);

      // Ergo Beveled Cutout in Front
      const cutoutGeo = new THREE.BoxGeometry(6, 0.85, 1.2);
      const cutoutMat = new THREE.MeshStandardMaterial({ color: 0x120e0c, roughness: 0.8 });
      const cutoutMesh = new THREE.Mesh(cutoutGeo, cutoutMat);
      cutoutMesh.position.set(0, 1.01, 3.5);
      group.add(cutoutMesh);

      // 2. Industrial Steel Legs (Pés em tubo industrial)
      const legGeo = new THREE.BoxGeometry(0.8, 6, 6);
      const leftLeg = new THREE.Mesh(legGeo, metalMaterial);
      leftLeg.position.set(-6.8, -2, 0);
      leftLeg.castShadow = true;
      group.add(leftLeg);

      const rightLeg = new THREE.Mesh(legGeo, metalMaterial);
      rightLeg.position.set(6.8, -2, 0);
      rightLeg.castShadow = true;
      group.add(rightLeg);

      // 3. 3D Printed Headphone Mount (FDM Lab)
      const mountGeo = new THREE.CylinderGeometry(0.5, 0.7, 2, 16);
      const mountMat = new THREE.MeshStandardMaterial({ color: 0x2a9d8f, roughness: 0.4 });
      const mountMesh = new THREE.Mesh(mountGeo, mountMat);
      mountMesh.position.set(-7.5, 0, 2);
      mountMesh.rotation.z = Math.PI / 2;
      group.add(mountMesh);

      // 4. Ambient Underglow LED Strip
      const ledGeo = new THREE.BoxGeometry(15.6, 0.1, 0.1);
      const ledMesh = new THREE.Mesh(ledGeo, ledGlowMaterial);
      ledMesh.position.set(0, 0.55, -3.8);
      group.add(ledMesh);
    } else if (modelType === 'printed_stand') {
      // Headphone Stand printed on 3D printer
      // Base
      const baseGeo = new THREE.CylinderGeometry(4, 4.5, 0.8, 32);
      const base = new THREE.Mesh(baseGeo, woodMaterial);
      base.position.y = -3;
      base.castShadow = true;
      group.add(base);

      // Spine
      const spineGeo = new THREE.BoxGeometry(1, 8, 0.8);
      const spine = new THREE.Mesh(spineGeo, woodMaterial);
      spine.position.set(0, 1, 0);
      spine.castShadow = true;
      group.add(spine);

      // Cradle Top
      const cradleGeo = new THREE.TorusGeometry(2, 0.5, 16, 32, Math.PI);
      const cradle = new THREE.Mesh(cradleGeo, woodMaterial);
      cradle.position.set(0, 5, 0);
      cradle.rotation.x = Math.PI;
      group.add(cradle);

      // 3D Printing Layer Lines Visual simulation rings
      for (let i = -3; i < 5; i += 0.8) {
        const ringGeo = new THREE.TorusGeometry(0.7, 0.05, 8, 16);
        const ring = new THREE.Mesh(ringGeo, ledGlowMaterial);
        ring.position.set(0, i, 0);
        ring.rotation.x = Math.PI / 2;
        group.add(ring);
      }
    } else if (modelType === 'cnc_relief') {
      // Wood Slab with CNC Pockets, Holes and Chamfers
      const slabGeo = new THREE.BoxGeometry(14, 1.2, 10);
      const slab = new THREE.Mesh(slabGeo, woodMaterial);
      slab.castShadow = true;
      group.add(slab);

      // CNC Deep Pocket (Rebaixo 8mm)
      const pocketGeo = new THREE.BoxGeometry(8, 0.6, 5);
      const pocketMat = new THREE.MeshStandardMaterial({ color: 0x14100e, roughness: 0.9 });
      const pocket = new THREE.Mesh(pocketGeo, pocketMat);
      pocket.position.set(0, 0.4, 0);
      group.add(pocket);

      // Hinge Cup Holes Ø35mm
      const holeGeo = new THREE.CylinderGeometry(0.9, 0.9, 0.7, 24);
      const holeMat = new THREE.MeshBasicMaterial({ color: 0x080706 });
      const hole1 = new THREE.Mesh(holeGeo, holeMat);
      hole1.position.set(-5, 0.4, -3.5);
      group.add(hole1);

      const hole2 = new THREE.Mesh(holeGeo, holeMat);
      hole2.position.set(5, 0.4, -3.5);
      group.add(hole2);
    } else if (modelType === 'toolpath_wireframe') {
      // 3D CNC Toolpath Wireframe with Multi-Pass Z-Depths
      const slabGeo = new THREE.BoxGeometry(14, 0.4, 10);
      const slab = new THREE.Mesh(slabGeo, new THREE.MeshBasicMaterial({ color: 0x1b1715, wireframe: true }));
      group.add(slab);

      // Generate Spiral and ZigZag Cut Paths
      const points: THREE.Vector3[] = [];
      const numPoints = 120;
      for (let i = 0; i < numPoints; i++) {
        const angle = i * 0.2;
        const r = 0.5 + i * 0.04;
        const x = Math.cos(angle) * r;
        const z = Math.sin(angle) * r;
        const y = 0.5 - (i / numPoints) * 1.5; // Z plunge down
        points.push(new THREE.Vector3(x, y, z));
      }

      const pathGeo = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(pathGeo, toolpathMaterial);
      group.add(line);

      // Simulated Cutter Bit (Fresa de topo helicoidal)
      const bitGeo = new THREE.CylinderGeometry(0.2, 0.2, 3, 16);
      const bitMat = new THREE.MeshStandardMaterial({ color: 0xff4444, metalness: 0.9, roughness: 0.2 });
      const bit = new THREE.Mesh(bitGeo, bitMat);
      bit.position.set(points[points.length - 1].x, points[points.length - 1].y + 1.5, points[points.length - 1].z);
      group.add(bit);
    }

    sceneRef.current.add(group);
  }, [modelType, materialFinish, isWireframe]);

  // Handle Mouse Drag for 3D Orbit
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !currentMeshGroupRef.current) return;
    const deltaX = e.clientX - previousMousePositionRef.current.x;
    const deltaY = e.clientY - previousMousePositionRef.current.y;

    currentMeshGroupRef.current.rotation.y += deltaX * 0.01;
    currentMeshGroupRef.current.rotation.x += deltaY * 0.01;

    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!cameraRef.current) return;
    cameraRef.current.position.z = Math.max(10, Math.min(50, cameraRef.current.position.z + e.deltaY * 0.02));
  };

  const handleResetCamera = () => {
    if (!currentMeshGroupRef.current || !cameraRef.current) return;
    currentMeshGroupRef.current.rotation.set(0, 0, 0);
    cameraRef.current.position.set(0, 15, 25);
    cameraRef.current.lookAt(0, 0, 0);
  };

  const handleCaptureSnapshot = () => {
    if (!rendererRef.current) return;
    const dataUrl = rendererRef.current.domElement.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `woodbit-3d-${modelType}-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <div
      className={`relative rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-lowest)] overflow-hidden beveled-card select-none group ${className} ${
        isFullscreen ? 'fixed inset-4 z-50 h-auto shadow-2xl' : ''
      }`}
      style={{ height: isFullscreen ? 'calc(100vh - 32px)' : height }}
    >
      {/* 3D WebGL Canvas Target */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      />

      {/* Top Overlay Badge & Model Switcher */}
      <div className="absolute top-3.5 left-3.5 flex items-center gap-2 z-10">
        <span className="text-xs px-2.5 py-1 rounded-full bg-[var(--bg-container)]/90 backdrop-blur-md text-[var(--color-primary)] font-mono font-bold border border-[var(--color-primary)]/40 flex items-center gap-1.5 shadow-md">
          <Rotate3d className="w-3.5 h-3.5 text-[var(--color-primary)]" />
          WebGL 3D Engine • Three.js
        </span>

        <div className="flex bg-[var(--bg-container)]/90 backdrop-blur-md rounded-xl p-0.5 border border-[var(--border-subtle)] text-xs">
          <button
            onClick={() => setModelType('gamer_desk')}
            className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
              modelType === 'gamer_desk'
                ? 'bg-[var(--color-primary-container)] text-[var(--color-primary)] border border-[var(--color-primary)]/30'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            Mesa Gamer
          </button>
          <button
            onClick={() => setModelType('cnc_relief')}
            className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
              modelType === 'cnc_relief'
                ? 'bg-[var(--color-primary-container)] text-[var(--color-primary)] border border-[var(--color-primary)]/30'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            Usinagem CNC
          </button>
          <button
            onClick={() => setModelType('printed_stand')}
            className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
              modelType === 'printed_stand'
                ? 'bg-[var(--color-primary-container)] text-[var(--color-primary)] border border-[var(--color-primary)]/30'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            Suporte 3D FDM
          </button>
          <button
            onClick={() => setModelType('toolpath_wireframe')}
            className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
              modelType === 'toolpath_wireframe'
                ? 'bg-[var(--color-primary-container)] text-[var(--color-primary)] border border-[var(--color-primary)]/30'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            Trajetória CAM Z
          </button>
        </div>
      </div>

      {/* Top Right Quick Actions */}
      <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5 z-10">
        <button
          onClick={handleCaptureSnapshot}
          className="p-2 rounded-xl bg-[var(--bg-container)]/90 backdrop-blur-md border border-[var(--border-subtle)] hover:border-[var(--color-primary)] text-[var(--text-muted)] hover:text-[var(--color-primary)] transition cursor-pointer shadow-md"
          title="Capturar imagem renderizada (PNG)"
        >
          <Camera className="w-4 h-4" />
        </button>

        <button
          onClick={handleResetCamera}
          className="p-2 rounded-xl bg-[var(--bg-container)]/90 backdrop-blur-md border border-[var(--border-subtle)] hover:border-[var(--color-primary)] text-[var(--text-muted)] hover:text-[var(--color-primary)] transition cursor-pointer shadow-md"
          title="Resetar visão da câmera"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="p-2 rounded-xl bg-[var(--bg-container)]/90 backdrop-blur-md border border-[var(--border-subtle)] hover:border-[var(--color-primary)] text-[var(--text-muted)] hover:text-[var(--color-primary)] transition cursor-pointer shadow-md"
          title={isFullscreen ? 'Sair da tela cheia' : 'Expandir para tela cheia'}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Bottom Floating Control Bar */}
      {showControls && (
        <div className="absolute bottom-3.5 inset-x-3.5 flex items-center justify-between gap-3 z-10 pointer-events-none">
          {/* Material Finishes */}
          <div className="flex items-center gap-1.5 bg-[var(--bg-container)]/90 backdrop-blur-md p-1.5 rounded-xl border border-[var(--border-subtle)] shadow-lg pointer-events-auto text-xs">
            <span className="text-xs text-[var(--text-faint)] font-bold px-1.5">Acabamento:</span>
            <button
              onClick={() => setMaterialFinish('freijo')}
              className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                materialFinish === 'freijo'
                  ? 'bg-[#3d2404] text-[var(--color-primary)] border border-[var(--color-primary)]/40 font-bold'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#c4945d]"></span>
              Freijó
            </button>
            <button
              onClick={() => setMaterialFinish('black_tx')}
              className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                materialFinish === 'black_tx'
                  ? 'bg-[#1b1715] text-[var(--color-primary)] border border-[var(--color-primary)]/40 font-bold'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#2a201c]"></span>
              Grafite TX
            </button>
            <button
              onClick={() => setMaterialFinish('white_tx')}
              className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                materialFinish === 'white_tx'
                  ? 'bg-[#24201d] text-[var(--color-primary)] border border-[var(--color-primary)]/40 font-bold'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#f5eeea]"></span>
              Branco TX
            </button>
            <button
              onClick={() => setMaterialFinish('petg_cyan')}
              className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                materialFinish === 'petg_cyan'
                  ? 'bg-[#14381b] text-[var(--color-secondary)] border border-[var(--color-secondary)]/40 font-bold'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#2a9d8f]"></span>
              PETG 3D
            </button>
          </div>

          {/* View Mode Controls */}
          <div className="flex items-center gap-1.5 bg-[var(--bg-container)]/90 backdrop-blur-md p-1.5 rounded-xl border border-[var(--border-subtle)] shadow-lg pointer-events-auto text-xs">
            <button
              onClick={() => setIsRotating(!isRotating)}
              className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 cursor-pointer ${
                isRotating
                  ? 'bg-[var(--color-primary-container)] text-[var(--color-primary)] border border-[var(--color-primary)]/30'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} />
              {isRotating ? 'Giro Ativo' : 'Pausado'}
            </button>

            <button
              onClick={() => setIsWireframe(!isWireframe)}
              className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 cursor-pointer ${
                isWireframe
                  ? 'bg-[var(--color-primary-container)] text-[var(--color-primary)] border border-[var(--color-primary)]/30'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              {isWireframe ? 'Wireframe' : 'Sólido'}
            </button>
          </div>
        </div>
      )}

      {/* Orbit Helper Tip */}
      <div className="absolute bottom-16 right-3.5 text-xs font-mono text-[var(--text-faint)] bg-[var(--bg-lowest)]/80 px-2 py-0.5 rounded border border-[var(--border-subtle)] pointer-events-none">
        Clique e arraste para orbitar • Scroll para zoom
      </div>
    </div>
  );
};

"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export interface CountryData {
  id: string;
  name: string;
  flag: string;
  lat: number;
  lon: number;
  capital: string;
  isOrigin?: boolean;
}

export const ORIGIN_COUNTRY: CountryData = {
  id: "india",
  name: "India",
  flag: "🇮🇳",
  lat: 20.5937,
  lon: 78.9629,
  capital: "New Delhi",
  isOrigin: true,
};

export const DESTINATION_COUNTRIES: CountryData[] = [
  { id: "usa", name: "USA", flag: "🇺🇸", lat: 34.0522, lon: -118.2437, capital: "Washington D.C. / LA" },
  { id: "egypt", name: "Egypt", flag: "🇪🇬", lat: 26.8206, lon: 30.8025, capital: "Cairo" },
  { id: "libya", name: "Libya", flag: "🇱🇾", lat: 26.3351, lon: 17.2283, capital: "Tripoli" },
  { id: "iran", name: "Iran", flag: "🇮🇷", lat: 32.4279, lon: 53.688, capital: "Tehran" },
  { id: "saudi_arabia", name: "Saudi Arabia", flag: "🇸🇦", lat: 23.8859, lon: 45.0792, capital: "Riyadh" },
  { id: "russia", name: "Russia", flag: "🇷🇺", lat: 61.524, lon: 105.3188, capital: "Moscow" },
];

const ALL_COUNTRIES = [ORIGIN_COUNTRY, ...DESTINATION_COUNTRIES];

// Map lat/lon to 3D map plane coordinates
function latLongTo3DMapPlane(lat: number, lon: number, planeWidth = 52, planeHeight = 26): THREE.Vector3 {
  const normX = (lon + 180) / 360.0;
  const normY = (90 - lat) / 180.0;

  const marginX = 0.18;
  const marginY = 0.12;

  const scaledX = marginX + normX * (1.0 - 2 * marginX);
  const scaledY = marginY + normY * (1.0 - 2 * marginY);

  const x = (scaledX - 0.5) * planeWidth;
  const y = (0.5 - scaledY) * planeHeight;
  const z = -Math.pow(x / 24, 2) * 1.6 - Math.pow(y / 14, 2) * 0.6 + 0.15;
  return new THREE.Vector3(x, y, z);
}

function createGlowSpriteTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d")!;
  const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0.0, "rgba(255, 255, 255, 1)");
  grad.addColorStop(0.25, "#ffea00");
  grad.addColorStop(0.55, "rgba(255, 234, 0, 0.35)");
  grad.addColorStop(1.0, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(canvas);
}

function isWebGLAvailable(): boolean {
  if (typeof window === "undefined" || typeof document === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch (e) {
    return false;
  }
}

export default function DottedWorldMap() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hoveredCountry, setHoveredCountry] = useState<CountryData | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const containerEl = mountRef.current;
    if (!containerEl || !isWebGLAvailable()) return;

    const width = containerEl.clientWidth || window.innerWidth;
    const height = containerEl.clientHeight || 550;

    // 1. Scene & Camera Setup (Dynamic FOV & Position for Mobile Devices)
    const scene = new THREE.Scene();
    scene.background = null;

    const initialZ = width < 640 ? 27.5 : width < 1024 ? 23.5 : 20.5;
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 0, initialZ);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
      renderer.setClearColor(0x000000, 0);
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      containerEl.appendChild(renderer.domElement);
    } catch (e) {
      console.warn("WebGL initialization failed:", e);
      return;
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff7ed, 2.2);
    sunLight.position.set(15, 18, 20);
    scene.add(sunLight);

    // Controls: Locked for clean view
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableRotate = false;
    controls.enableZoom = false;
    controls.enablePan = false;

    // 2. Fixed Tilted 3D Map Group
    const mapGroup = new THREE.Group();
    mapGroup.rotation.x = -0.32;
    scene.add(mapGroup);

    const planeWidth = 52;
    const planeHeight = 26;
    const mapGeo = new THREE.PlaneGeometry(planeWidth, planeHeight, 80, 40);

    // 3D Surface Curvature
    const pos = mapGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const vx = pos.getX(i);
      const vy = pos.getY(i);
      const vz = -Math.pow(vx / 24, 2) * 1.6 - Math.pow(vy / 14, 2) * 0.6;
      pos.setZ(i, vz);
    }
    mapGeo.computeVertexNormals();

    const mapMat = new THREE.MeshStandardMaterial({
      transparent: true,
      opacity: 0.98,
      roughness: 0.45,
      side: THREE.DoubleSide,
    });

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load("/earth-vector-ref-colors.png", (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      mapMat.map = tex;
      mapMat.needsUpdate = true;
    });

    const mapMesh = new THREE.Mesh(mapGeo, mapMat);
    mapGroup.add(mapMesh);

    // 3. Yellow Sun-Yellow Hover Points (Slightly Scaled for Touch)
    const glowTexture = createGlowSpriteTexture();
    const markersGroup = new THREE.Group();
    mapGroup.add(markersGroup);

    const markersList: any[] = [];
    const raycastTargets: THREE.Mesh[] = [];

    ALL_COUNTRIES.forEach((country) => {
      const p = latLongTo3DMapPlane(country.lat, country.lon, planeWidth, planeHeight);
      const markerContainer = new THREE.Group();
      markerContainer.position.copy(p);

      const color = 0xffea00;

      // Core 3D Dot Mesh
      const dotMesh = new THREE.Mesh(
        new THREE.SphereGeometry(country.isOrigin ? 0.35 : 0.25, 16, 16),
        new THREE.MeshStandardMaterial({
          color,
          emissive: color,
          emissiveIntensity: 4.0,
          roughness: 0.05,
          transparent: true,
          opacity: 1.0,
        })
      );
      markerContainer.add(dotMesh);

      // Hitbox Target (Generous size for mobile touch taps)
      const hitMesh = new THREE.Mesh(
        new THREE.SphereGeometry(1.4, 12, 12),
        new THREE.MeshBasicMaterial({ visible: false })
      );
      hitMesh.userData = { country };
      markerContainer.add(hitMesh);
      raycastTargets.push(hitMesh);

      // Sun Glow Sprite Halo
      const sprite = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: glowTexture,
          color,
          transparent: true,
          opacity: 0.9,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        })
      );
      sprite.scale.set(1.2, 1.2, 1.0);
      markerContainer.add(sprite);

      // Pulsing Ring
      const ringMesh = new THREE.Mesh(
        new THREE.RingGeometry(0.22, 0.5, 32),
        new THREE.MeshBasicMaterial({
          color,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.85,
          depthWrite: false,
        })
      );
      markerContainer.add(ringMesh);

      markersGroup.add(markerContainer);

      markersList.push({
        country,
        dotMesh,
        sprite,
        ringMesh,
        currentScale: 1.0,
        targetScale: 1.0,
        visibilityAlpha: 1.0,
        targetAlpha: 1.0,
        pulseTime: Math.random() * Math.PI * 2,
      });
    });

    // 4. Dynamic 3D Arc Lines Radiating OUT from India (HQ)
    const arcsGroup = new THREE.Group();
    mapGroup.add(arcsGroup);
    const arcsList: any[] = [];

    const startPos = latLongTo3DMapPlane(ORIGIN_COUNTRY.lat, ORIGIN_COUNTRY.lon, planeWidth, planeHeight);

    DESTINATION_COUNTRIES.forEach((country) => {
      const endPos = latLongTo3DMapPlane(country.lat, country.lon, planeWidth, planeHeight);
      const dist = startPos.distanceTo(endPos);

      // High 3D Bezier Curve
      const midPos = startPos
        .clone()
        .add(endPos)
        .multiplyScalar(0.5);
      midPos.z += Math.max(dist * 0.38, 3.2);

      const curve = new THREE.QuadraticBezierCurve3(startPos, midPos, endPos);
      const totalPoints = 140;
      const fullPoints = curve.getPoints(totalPoints);

      // Base Track Line
      const baseLine = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(fullPoints),
        new THREE.LineBasicMaterial({ color: 0xffea00, transparent: true, opacity: 0.25 })
      );
      arcsGroup.add(baseLine);

      // Dynamic Synchronized Pulse Line
      const dynamicGeo = new THREE.BufferGeometry();
      const posArr = new Float32Array(totalPoints * 3);
      const colArr = new Float32Array(totalPoints * 3);
      dynamicGeo.setAttribute("position", new THREE.BufferAttribute(posArr, 3));
      dynamicGeo.setAttribute("color", new THREE.Float32BufferAttribute(colArr, 3));

      const dynamicMat = new THREE.LineBasicMaterial({
        vertexColors: true,
        linewidth: 3,
        transparent: true,
        opacity: 0.95,
      });
      const dynamicLine = new THREE.Line(dynamicGeo, dynamicMat);
      arcsGroup.add(dynamicLine);

      arcsList.push({
        countryId: country.id,
        fullPoints,
        totalPoints,
        dynamicGeo,
        dynamicMat,
      });
    });

    // 5. Pointer / Touch Event Handlers for Mobile & Desktop
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-1000, -1000);
    let activeHovered: CountryData | null = null;

    const updateMousePos = (clientX: number, clientY: number) => {
      if (!containerEl) return;
      const rect = containerEl.getBoundingClientRect();
      mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    };

    const handlePointerMove = (e: PointerEvent) => {
      updateMousePos(e.clientX, e.clientY);
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        updateMousePos(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    containerEl.addEventListener("pointermove", handlePointerMove);
    containerEl.addEventListener("touchstart", handleTouchStart, { passive: true });

    // Resize Observer for Dynamic Mobile Camera Distance
    const resizeObserver = new ResizeObserver(() => {
      if (!containerEl || !camera || !renderer) return;
      const w = containerEl.clientWidth;
      const h = containerEl.clientHeight || w;
      camera.aspect = w / h;

      // Adapt camera Z distance dynamically to fit all 7 continents on small mobile screens
      if (w < 640) {
        camera.position.z = 28.5;
      } else if (w < 1024) {
        camera.position.z = 24.0;
      } else {
        camera.position.z = 20.5;
      }

      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    resizeObserver.observe(containerEl);

    // 6. Animation Loop
    const clock = new THREE.Clock();
    let animId: number;
    let sharedProgress = 0.0;

    function animateLoop() {
      animId = requestAnimationFrame(animateLoop);
      const delta = clock.getDelta();

      sharedProgress += delta * 0.45;
      if (sharedProgress > 1.25) {
        sharedProgress = 0.0;
      }

      controls.update();

      // Update Markers Pulse & Growth
      markersList.forEach((m) => {
        m.pulseTime += delta * 3;
        m.visibilityAlpha += (m.targetAlpha - m.visibilityAlpha) * 0.12;

        if (m.dotMesh?.material) m.dotMesh.material.opacity = m.visibilityAlpha;
        if (m.sprite?.material) m.sprite.material.opacity = m.visibilityAlpha * 0.9;

        if (m.visibilityAlpha > 0.05 && m.ringMesh?.material) {
          const phase = (m.pulseTime % (Math.PI * 2)) / (Math.PI * 2);
          m.ringMesh.scale.setScalar(1.0 + phase * 1.4);
          m.ringMesh.material.opacity = (1.0 - phase) * 0.85 * m.visibilityAlpha;
        }

        m.currentScale += (m.targetScale - m.currentScale) * 0.15;
        if (m.dotMesh) m.dotMesh.scale.setScalar(m.currentScale);
        if (m.sprite) m.sprite.scale.setScalar(1.2 * m.currentScale);
      });

      // Update Synchronized Pulse Lines
      arcsList.forEach((arc) => {
        const pulseLen = 0.24;
        const head = sharedProgress;
        const tail = Math.max(0, head - pulseLen);

        const headIdx = Math.floor(Math.min(head, 1.0) * arc.totalPoints);
        const tailIdx = Math.floor(Math.min(tail, 1.0) * arc.totalPoints);

        const posAttr = arc.dynamicGeo.attributes.position;
        const colAttr = arc.dynamicGeo.attributes.color;

        const cStart = new THREE.Color(0xffea00);
        const cTail = new THREE.Color(0xca8a04);

        for (let i = 0; i < arc.totalPoints; i++) {
          const pt = arc.fullPoints[i];
          posAttr.setXYZ(i, pt.x, pt.y, pt.z);

          if (i >= tailIdx && i <= headIdx && headIdx > 0) {
            const factor = (i - tailIdx) / Math.max(1, headIdx - tailIdx);
            const col = cTail.clone().lerp(cStart, factor);
            colAttr.setXYZ(i, col.r, col.g, col.b);
          } else {
            colAttr.setXYZ(i, 0, 0, 0);
          }
        }

        posAttr.needsUpdate = true;
        colAttr.needsUpdate = true;
        arc.dynamicGeo.setDrawRange(tailIdx, Math.max(1, headIdx - tailIdx));
      });

      // Raycast Hover & Touch Test
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(raycastTargets);

      if (intersects.length > 0) {
        const country: CountryData = intersects[0].object.userData.country;
        if (activeHovered !== country) {
          activeHovered = country;
          setHoveredCountry(country);

          markersList.forEach((m) => {
            m.targetScale = m.country.id === country.id ? 1.85 : 1.0;
          });
        }

        if (containerEl) {
          const worldPos = new THREE.Vector3();
          intersects[0].object.getWorldPosition(worldPos);
          const screenPos = worldPos.project(camera);
          const rect = containerEl.getBoundingClientRect();
          const x = (screenPos.x * 0.5 + 0.5) * rect.width;
          const y = (-(screenPos.y * 0.5) + 0.5) * rect.height;

          setTooltipPos({ x, y });
        }
      } else {
        if (activeHovered !== null) {
          activeHovered = null;
          setHoveredCountry(null);
          markersList.forEach((m) => {
            m.targetScale = 1.0;
          });
        }
      }

      renderer.render(scene, camera);
    }

    animateLoop();

    return () => {
      if (containerEl) {
        containerEl.removeEventListener("pointermove", handlePointerMove);
        containerEl.removeEventListener("touchstart", handleTouchStart);
        if (renderer && containerEl.contains(renderer.domElement)) {
          containerEl.removeChild(renderer.domElement);
        }
      }
      resizeObserver.disconnect();
      if (animId) cancelAnimationFrame(animId);
      if (renderer) renderer.dispose();
    };
  }, []);

  return (
    <div className="relative h-full w-full select-none overflow-hidden">
      {/* 3D Canvas Mount Point */}
      <div ref={mountRef} className="h-full w-full" />

      {/* Floating Glass Tooltip (Optimized for Touch & Mobile Viewports) */}
      {hoveredCountry && (
        <div
          className="pointer-events-none absolute z-50 -translate-x-1/2 -translate-y-[130%] rounded-2xl border border-white/60 bg-white/50 px-3.5 py-2.5 text-xs text-slate-900 shadow-[0_16px_40px_rgba(0,0,0,0.15)] backdrop-blur-2xl transition-all duration-150 whitespace-nowrap"
          style={{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px` }}
        >
          <div className="flex items-center gap-2 font-extrabold text-slate-900 text-xs sm:text-sm">
            <span>{hoveredCountry.flag}</span>
            <span>{hoveredCountry.name}</span>
            {hoveredCountry.isOrigin && (
              <span className="rounded-full bg-vblue/20 px-2 py-0.5 text-[0.55rem] font-bold text-vblue shadow-xs">
                HQ ORIGIN
              </span>
            )}
          </div>
          <div className="text-[0.68rem] sm:text-[0.72rem] font-bold text-vblue mt-0.5">
            Capital: {hoveredCountry.capital}
          </div>
        </div>
      )}
    </div>
  );
}

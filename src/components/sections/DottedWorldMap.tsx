"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

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
  { id: "usa", name: "USA", flag: "🇺🇸", lat: 37.0902, lon: -95.7129, capital: "Washington D.C. / LA" },
  { id: "egypt", name: "Egypt", flag: "🇪🇬", lat: 26.8206, lon: 30.8025, capital: "Cairo" },
  { id: "libya", name: "Libya", flag: "🇱🇾", lat: 26.3351, lon: 17.2283, capital: "Tripoli" },
  { id: "iran", name: "Iran", flag: "🇮🇷", lat: 32.4279, lon: 53.688, capital: "Tehran" },
  { id: "saudi_arabia", name: "Saudi Arabia", flag: "🇸🇦", lat: 23.8859, lon: 45.0792, capital: "Riyadh" },
  { id: "russia", name: "Russia", flag: "🇷🇺", lat: 55.7558, lon: 37.6173, capital: "Moscow" },
];

const ALL_COUNTRIES = [ORIGIN_COUNTRY, ...DESTINATION_COUNTRIES];

// Map lat/lon to 3D map plane coordinates matching 0.5 larger map scale (9% margin)
function latLongTo3DMapPlane(lat: number, lon: number, planeWidth = 52, planeHeight = 26): THREE.Vector3 {
  const normX = (lon + 180) / 360.0;
  const normY = (90 - lat) / 180.0;

  const marginX = 0.09; // 9% margin left/right (50% larger map scale!)
  const marginY = 0.06; // 6% margin top/bottom

  const scaledX = marginX + normX * (1.0 - 2 * marginX);
  const scaledY = marginY + normY * (1.0 - 2 * marginY);

  const x = (scaledX - 0.5) * planeWidth;
  const baseY = (0.5 - scaledY) * planeHeight;

  // Semicircle Arch Y-bending & Z-curvature
  const y = baseY - Math.pow(x / 24, 2) * 2.5;
  const z = -Math.pow(x / 24, 2) * 3.2 - Math.pow(baseY / 12, 2) * 1.2 + 0.15;
  return new THREE.Vector3(x, y, z);
}

function createGlowSpriteTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d")!;
  const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  grad.addColorStop(0.0, "rgba(255, 255, 255, 1)");
  grad.addColorStop(0.25, "#ffea00");
  grad.addColorStop(0.55, "rgba(255, 234, 0, 0.35)");
  grad.addColorStop(1.0, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(canvas);
}

function createSmokeTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;

  const grad = ctx.createRadialGradient(256, 256, 15, 256, 256, 240);
  grad.addColorStop(0, "rgba(255, 255, 255, 0.95)");
  grad.addColorStop(0.25, "rgba(140, 210, 255, 0.7)");
  grad.addColorStop(0.5, "rgba(30, 130, 240, 0.35)");
  grad.addColorStop(0.75, "rgba(10, 60, 140, 0.12)");
  grad.addColorStop(1, "rgba(0, 0, 0, 0)");

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

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

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    scene.background = null;

    const initialZ = width < 640 ? 28.5 : width < 1024 ? 24.5 : 21.5;
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 0, initialZ);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        precision: "highp",
      });
      renderer.setClearColor(0x000000, 0);
      renderer.setSize(width, height, true);
      const dpr = Math.min(window.devicePixelRatio || 1, 3);
      renderer.setPixelRatio(dpr);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      
      // Allow smooth touch scrolling on mobile viewports
      renderer.domElement.style.touchAction = "pan-y";
      
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

    // 2. Fixed Tilted 3D Map Group BENT into Semicircle Arch Dome
    const mapGroup = new THREE.Group();
    mapGroup.rotation.x = -0.28;
    scene.add(mapGroup);

    const planeWidth = 52;
    const planeHeight = 26;
    const mapGeo = new THREE.PlaneGeometry(planeWidth, planeHeight, 90, 45);

    // Bend left and right rectangle corners downward and inward into a smooth Semicircle Arch Dome!
    const pos = mapGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const vx = pos.getX(i);
      const vy = pos.getY(i);
      const archY = vy - Math.pow(vx / 24, 2) * 2.5;
      const vz = -Math.pow(vx / 24, 2) * 3.2 - Math.pow(vy / 12, 2) * 1.2;
      pos.setY(i, archY);
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
      tex.generateMipmaps = true;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
      if (renderer.capabilities) {
        tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
      }
      mapMat.map = tex;
      mapMat.needsUpdate = true;
    });

    const mapMesh = new THREE.Mesh(mapGeo, mapMat);
    mapGroup.add(mapMesh);

    // 3D Volumetric Smoky Atmosphere Rim Mesh behind Semicircle Arch
    const smokeTexture = createSmokeTexture();
    smokeTexture.minFilter = THREE.LinearFilter;

    const smokeGeo = new THREE.PlaneGeometry(planeWidth + 10, planeHeight + 8, 90, 45);
    const smokePos = smokeGeo.attributes.position;
    for (let i = 0; i < smokePos.count; i++) {
      const vx = smokePos.getX(i);
      const vy = smokePos.getY(i);
      const archY = vy - Math.pow(vx / 26, 2) * 2.8;
      const vz = -Math.pow(vx / 26, 2) * 3.4 - Math.pow(vy / 14, 2) * 1.3 - 0.35;
      smokePos.setY(i, archY);
      smokePos.setZ(i, vz);
    }
    smokeGeo.computeVertexNormals();

    const smokeMat = new THREE.MeshBasicMaterial({
      map: smokeTexture,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    });

    const smokeMesh = new THREE.Mesh(smokeGeo, smokeMat);
    mapGroup.add(smokeMesh);

    // 3. Sun-Yellow Hover Points
    const glowTexture = createGlowSpriteTexture();
    glowTexture.minFilter = THREE.LinearFilter;

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
        new THREE.SphereGeometry(country.isOrigin ? 0.35 : 0.25, 24, 24),
        new THREE.MeshStandardMaterial({
          color,
          emissive: color,
          emissiveIntensity: 4.5,
          roughness: 0.05,
          transparent: true,
          opacity: 1.0,
        })
      );
      markerContainer.add(dotMesh);

      // Hitbox Target for Mobile Touch & Mouse Hovering
      const hitMesh = new THREE.Mesh(
        new THREE.SphereGeometry(1.6, 12, 12),
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
          opacity: 0.95,
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

    // 5. Pointer & Touch Events
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

    // Resize Observer
    const resizeObserver = new ResizeObserver(() => {
      if (!containerEl || !camera || !renderer) return;
      const w = containerEl.clientWidth;
      const h = containerEl.clientHeight || w;
      camera.aspect = w / h;

      if (w < 640) {
        camera.position.z = 28.5;
      } else if (w < 1024) {
        camera.position.z = 24.5;
      } else {
        camera.position.z = 21.5;
      }

      camera.updateProjectionMatrix();

      const dpr = Math.min(window.devicePixelRatio || 1, 3);
      renderer.setPixelRatio(dpr);
      renderer.setSize(w, h, true);
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

      // Soft drifting 3D smoke rim pulse
      if (smokeMat) {
        smokeMat.opacity = 0.6 + Math.sin(clock.getElapsedTime() * 1.5) * 0.15;
      }

      // Update Markers Pulse & Growth
      markersList.forEach((m) => {
        m.pulseTime += delta * 3.5;
        m.visibilityAlpha += (m.targetAlpha - m.visibilityAlpha) * 0.12;

        if (m.dotMesh?.material) m.dotMesh.material.opacity = m.visibilityAlpha;
        if (m.sprite?.material) {
          const pulseIntensity = 0.75 + Math.sin(m.pulseTime * 2) * 0.25;
          m.sprite.material.opacity = m.visibilityAlpha * pulseIntensity;
        }

        if (m.visibilityAlpha > 0.05 && m.ringMesh?.material) {
          const phase = (m.pulseTime % (Math.PI * 2)) / (Math.PI * 2);
          m.ringMesh.scale.setScalar(1.0 + phase * 1.5);
          m.ringMesh.material.opacity = (1.0 - phase) * 0.9 * m.visibilityAlpha;
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
          const rawX = (screenPos.x * 0.5 + 0.5) * rect.width;
          const rawY = (-(screenPos.y * 0.5) + 0.5) * rect.height;

          const clampedX = Math.min(Math.max(90, rawX), rect.width - 90);

          setTooltipPos({ x: clampedX, y: rawY });
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
    <div className="relative h-full w-full select-none overflow-visible">
      {/* 3D Canvas Mount Point */}
      <div ref={mountRef} className="h-full w-full" />

      {/* Floating Glass Tooltip */}
      {hoveredCountry && (
        <div
          className="pointer-events-none absolute z-50 -translate-x-1/2 -translate-y-[125%] rounded-2xl border border-white/80 bg-white/95 px-4 py-2.5 text-xs text-slate-900 shadow-[0_20px_50px_rgba(0,0,0,0.22)] backdrop-blur-md transition-all duration-150 whitespace-nowrap"
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

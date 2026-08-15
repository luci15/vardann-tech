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

function latLongToVector3(lat: number, lon: number, radius = 16, altitude = 0.05): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const r = radius + altitude;
  return new THREE.Vector3(
    -(r * Math.sin(phi) * Math.cos(theta)),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta)
  );
}

function createFallbackTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const continents: [number, number][][] = [
    [[37, 10], [30, 32], [12, 43], [-12, 40], [-34, 20], [-34, 18], [5, 9], [15, -17], [32, -13], [37, 10]],
    [[36, -9], [43, -9], [44, 8], [55, 8], [70, 25], [70, 170], [60, 160], [40, 145], [22, 120], [10, 105], [8, 77], [25, 65], [25, 55], [30, 35], [40, 28], [36, -9]],
    [[35, 75], [30, 88], [22, 90], [15, 80], [8, 77], [15, 73], [24, 68], [32, 70], [35, 75]],
    [[30, 33], [30, 48], [12, 44], [16, 53], [26, 56], [30, 48], [30, 33]],
    [[70, 30], [75, 100], [70, 175], [50, 140], [50, 100], [55, 60], [70, 30]],
    [[-12, 130], [-15, 145], [-38, 145], [-35, 115], [-20, 115], [-12, 130]],
    [[70, -165], [70, -60], [45, -60], [25, -80], [15, -90], [15, -105], [30, -120], [60, -165], [70, -165]],
    [[12, -75], [5, -50], [-10, -35], [-50, -70], [-45, -75], [0, -80], [12, -75]],
  ];

  ctx.fillStyle = "#64748b";
  ctx.strokeStyle = "#475569";
  ctx.lineWidth = 2;

  continents.forEach((poly) => {
    ctx.beginPath();
    poly.forEach(([lat, lon], idx) => {
      const x = ((lon + 180) / 360) * canvas.width;
      const y = ((90 - lat) / 180) * canvas.height;
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
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

export default function HalfGlobe() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hoveredCountry, setHoveredCountry] = useState<CountryData | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const containerEl = mountRef.current;
    if (!containerEl || !isWebGLAvailable()) return;

    const width = containerEl.clientWidth || 1000;
    const height = containerEl.clientHeight || 450;

    // 1. Scene & Camera (100% Transparent, No Flash)
    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 0, 20);

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
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff7ed, 1.8);
    sunLight.position.set(15, 12, 12);
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.9);
    rimLight.position.set(-15, -8, -10);
    scene.add(rimLight);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false;
    controls.enablePan = false;

    // 2. Semicircular Half Globe Horizon Mesh
    const radius = 16;
    const earthGeo = new THREE.SphereGeometry(radius, 64, 64);
    const fallbackTex = createFallbackTexture();
    const earthMat = new THREE.MeshStandardMaterial({
      map: fallbackTex,
      roughness: 0.65,
      metalness: 0.05,
    });

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load("/earth-half-globe.png", (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      earthMat.map = tex;
      earthMat.needsUpdate = true;
    });

    // Create the Globe Mesh & Position Center Below Baseline (Creating the Horizon Arc)
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    earthMesh.position.set(0, -13.2, 0);
    earthMesh.rotation.x = 0.38; // Tilt Northern Hemisphere forward matching reference image
    scene.add(earthMesh);

    // Subtle Horizon Atmosphere Glow Arc
    const atmosphereGeo = new THREE.SphereGeometry(radius * 1.05, 64, 64);
    const atmosphereMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.55 - dot(vNormal, vec3(0, 0, 1.0)), 2.8);
          gl_FragColor = vec4(0.2, 0.6, 1.0, 1.0) * intensity * 0.4;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeo, atmosphereMat);
    atmosphereMesh.position.set(0, -13.2, 0);
    atmosphereMesh.rotation.x = 0.38;
    scene.add(atmosphereMesh);

    // 3. 3D Glowing Markers & Pins on Horizon
    const glowTexture = createGlowSpriteTexture();
    const markersGroup = new THREE.Group();
    earthMesh.add(markersGroup);

    const markersList: any[] = [];
    const raycastTargets: THREE.Mesh[] = [];

    ALL_COUNTRIES.forEach((country) => {
      const pos = latLongToVector3(country.lat, country.lon, radius, 0.05);
      const markerContainer = new THREE.Group();
      markerContainer.position.copy(pos);
      markerContainer.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), pos.clone().normalize());

      const color = 0xffea00; // Sun Yellow

      // Core Sun Dot Mesh
      const dotMesh = new THREE.Mesh(
        new THREE.SphereGeometry(country.isOrigin ? 0.35 : 0.28, 16, 16),
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

      // Hitbox Target
      const hitMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.9, 12, 12),
        new THREE.MeshBasicMaterial({ visible: false })
      );
      hitMesh.userData = { country };
      markerContainer.add(hitMesh);
      raycastTargets.push(hitMesh);

      // Sun Glow Halo Sprite
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
      sprite.scale.set(1.4, 1.4, 1.0);
      markerContainer.add(sprite);

      // Pulsing Sun Ring
      const ringMesh = new THREE.Mesh(
        new THREE.RingGeometry(0.25, 0.55, 32),
        new THREE.MeshBasicMaterial({
          color,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.8,
          depthWrite: false,
        })
      );
      ringMesh.rotation.x = Math.PI / 2;
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

    // 4. Connection Arcs Curving Across Horizon (India -> Destinations)
    const arcsGroup = new THREE.Group();
    earthMesh.add(arcsGroup);
    const arcsList: any[] = [];

    const startPos = latLongToVector3(ORIGIN_COUNTRY.lat, ORIGIN_COUNTRY.lon, radius, 0.05);

    DESTINATION_COUNTRIES.forEach((country) => {
      const endPos = latLongToVector3(country.lat, country.lon, radius, 0.05);
      const dist = startPos.distanceTo(endPos);
      let midPos = startPos.clone().add(endPos).multiplyScalar(0.5);

      if (midPos.length() < 1.0) {
        midPos = new THREE.Vector3(0, radius + 5.0, 0);
      } else {
        midPos.normalize().multiplyScalar(radius + Math.max(dist * 0.35, 3.5));
      }

      const curve = new THREE.QuadraticBezierCurve3(startPos, midPos, endPos);
      const totalPoints = 120;
      const fullPoints = curve.getPoints(totalPoints);

      // Base Track Line
      const baseLine = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(fullPoints),
        new THREE.LineBasicMaterial({ color: 0xfacc15, transparent: true, opacity: 0.25 })
      );
      arcsGroup.add(baseLine);

      // Dynamic Flow Line
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
        progress: 0.0,
        speed: 0.22 + Math.random() * 0.06,
      });
    });

    // 5. Raycaster Interactivity
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-1000, -1000);
    let activeHovered: CountryData | null = null;

    const handlePointerMove = (e: PointerEvent) => {
      if (!containerEl) return;
      const rect = containerEl.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    containerEl.addEventListener("pointermove", handlePointerMove);

    // Resize Observer
    const resizeObserver = new ResizeObserver(() => {
      if (!containerEl || !camera || !renderer) return;
      const w = containerEl.clientWidth;
      const h = containerEl.clientHeight || w;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    resizeObserver.observe(containerEl);

    // 6. Smooth Horizon Rotation & Render Loop
    const clock = new THREE.Clock();
    let animId: number;

    function animateLoop() {
      animId = requestAnimationFrame(animateLoop);
      const delta = clock.getDelta();

      // Continuous 60fps Smooth Rotation around Y-axis
      earthMesh.rotation.y += 0.003;
      atmosphereMesh.rotation.y += 0.003;

      controls.update();

      // Update Markers Pulse & Growth
      markersList.forEach((m) => {
        m.pulseTime += delta * 3;
        m.visibilityAlpha += (m.targetAlpha - m.visibilityAlpha) * 0.12;

        if (m.dotMesh?.material) m.dotMesh.material.opacity = m.visibilityAlpha;
        if (m.sprite?.material) m.sprite.material.opacity = m.visibilityAlpha;

        if (m.visibilityAlpha > 0.05 && m.ringMesh?.material) {
          const phase = (m.pulseTime % (Math.PI * 2)) / (Math.PI * 2);
          m.ringMesh.scale.setScalar(1.0 + phase * 1.4);
          m.ringMesh.material.opacity = (1.0 - phase) * 0.8 * m.visibilityAlpha;
        }

        m.currentScale += (m.targetScale - m.currentScale) * 0.15;
        if (m.dotMesh) m.dotMesh.scale.setScalar(m.currentScale);
        if (m.sprite) m.sprite.scale.setScalar(1.4 * m.currentScale);
      });

      // Update Connection Flow Lines
      arcsList.forEach((arc) => {
        arc.progress += delta * arc.speed;
        if (arc.progress > 1.4) arc.progress = 0.0;

        const activeProgress = Math.min(arc.progress, 1.0);
        const activeCount = Math.max(2, Math.floor(activeProgress * arc.totalPoints));

        const posAttr = arc.dynamicGeo.attributes.position;
        const colAttr = arc.dynamicGeo.attributes.color;

        const cStart = new THREE.Color(0xffea00);
        const cEnd = new THREE.Color(0xfde047);

        for (let i = 0; i < arc.totalPoints; i++) {
          if (i < activeCount) {
            const pt = arc.fullPoints[i];
            posAttr.setXYZ(i, pt.x, pt.y, pt.z);
            const col = cStart.clone().lerp(cEnd, i / arc.totalPoints);
            colAttr.setXYZ(i, col.r, col.g, col.b);
          } else {
            const lastPt = arc.fullPoints[activeCount - 1];
            posAttr.setXYZ(i, lastPt.x, lastPt.y, lastPt.z);
            colAttr.setXYZ(i, 0, 0, 0);
          }
        }

        posAttr.needsUpdate = true;
        colAttr.needsUpdate = true;
        arc.dynamicGeo.setDrawRange(0, activeCount);
      });

      // Raycast Hover Test
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(raycastTargets);

      if (intersects.length > 0) {
        const country: CountryData = intersects[0].object.userData.country;
        if (activeHovered !== country) {
          activeHovered = country;
          setHoveredCountry(country);

          markersList.forEach((m) => {
            m.targetScale = m.country.id === country.id ? 1.8 : 1.0;
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

      {/* Floating Glass Tooltip */}
      {hoveredCountry && (
        <div
          className="pointer-events-none absolute z-50 -translate-x-1/2 -translate-y-[130%] rounded-2xl border border-white/60 bg-white/40 px-4 py-3 text-xs text-slate-900 shadow-[0_16px_40px_rgba(0,0,0,0.15)] backdrop-blur-2xl transition-all duration-150 whitespace-nowrap"
          style={{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px` }}
        >
          <div className="flex items-center gap-2 font-extrabold text-slate-900 text-sm">
            <span>{hoveredCountry.flag}</span>
            <span>{hoveredCountry.name}</span>
            {hoveredCountry.isOrigin && (
              <span className="rounded-full bg-vblue/20 px-2 py-0.5 text-[0.6rem] font-bold text-vblue shadow-xs">
                HQ ORIGIN
              </span>
            )}
          </div>
          <div className="text-[0.72rem] font-bold text-vblue mt-1">
            Capital: {hoveredCountry.capital}
          </div>
        </div>
      )}
    </div>
  );
}

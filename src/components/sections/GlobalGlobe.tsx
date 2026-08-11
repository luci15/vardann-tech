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
  { id: "egypt", name: "Egypt", flag: "🇪🇬", lat: 26.8206, lon: 30.8025, capital: "Cairo" },
  { id: "libya", name: "Libya", flag: "🇱🇾", lat: 26.3351, lon: 17.2283, capital: "Tripoli" },
  { id: "iran", name: "Iran", flag: "🇮🇷", lat: 32.4279, lon: 53.688, capital: "Tehran" },
  { id: "saudi_arabia", name: "Saudi Arabia", flag: "🇸🇦", lat: 23.8859, lon: 45.0792, capital: "Riyadh" },
  { id: "russia", name: "Russia", flag: "🇷🇺", lat: 61.524, lon: 105.3188, capital: "Moscow" },
];

const ALL_COUNTRIES = [ORIGIN_COUNTRY, ...DESTINATION_COUNTRIES];

function latLongToVector3(lat: number, lon: number, radius = 5, altitude = 0): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const r = radius + altitude;
  return new THREE.Vector3(
    -(r * Math.sin(phi) * Math.cos(theta)),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta)
  );
}

function createEarthTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d")!;

  // Soft Sky Blue Light Ocean Fill
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  oceanGrad.addColorStop(0, "#e0f2fe");
  oceanGrad.addColorStop(0.5, "#dbeafe");
  oceanGrad.addColorStop(1, "#e0f2fe");
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Lat/Lon Graticule Lines (Soft Brand Blue)
  ctx.strokeStyle = "rgba(0, 80, 160, 0.1)";
  ctx.lineWidth = 1;
  for (let lat = -80; lat <= 80; lat += 20) {
    const y = ((90 - lat) / 180) * canvas.height;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
  for (let lon = -180; lon <= 180; lon += 30) {
    const x = ((lon + 180) / 360) * canvas.width;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  // Continents Polygons (Vardann Blue Fill with Crisp White Borders)
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

  ctx.fillStyle = "#0050a0";
  ctx.strokeStyle = "rgba(255, 255, 255, 0.75)";
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

  // Warm Amber Glow Spots under Target Countries
  ALL_COUNTRIES.forEach((c) => {
    const cx = ((c.lon + 180) / 360) * canvas.width;
    const cy = ((90 - c.lat) / 180) * canvas.height;
    const grad = ctx.createRadialGradient(cx, cy, 2, cx, cy, 25);
    grad.addColorStop(0, "rgba(245, 158, 11, 0.95)");
    grad.addColorStop(0.5, "rgba(251, 191, 36, 0.4)");
    grad.addColorStop(1, "rgba(251, 191, 36, 0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, 25, 0, Math.PI * 2);
    ctx.fill();
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
  grad.addColorStop(0.25, "#f59e0b");
  grad.addColorStop(0.55, "rgba(245, 158, 11, 0.35)");
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

export default function GlobalGlobe() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hoveredCountry, setHoveredCountry] = useState<CountryData | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const container = mountRef.current;
    if (!container || !isWebGLAvailable()) return;

    const width = container.clientWidth || 550;
    const height = container.clientHeight || 550;

    // 1. Scene & Camera (Transparent Background)
    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 3.5, 13.5);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      container.appendChild(renderer.domElement);
    } catch (e) {
      console.warn("WebGL initialization failed:", e);
      return;
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff7ed, 1.6);
    sunLight.position.set(12, 10, 10);
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.8);
    rimLight.position.set(-10, -5, -10);
    scene.add(rimLight);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 6.5;
    controls.maxDistance = 22;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.6;

    // 2. Globe Mesh
    const radius = 5;
    const earthGeo = new THREE.SphereGeometry(radius, 64, 64);
    const earthMat = new THREE.MeshStandardMaterial({
      map: createEarthTexture(),
      roughness: 0.5,
      metalness: 0.1,
      emissive: new THREE.Color(0x070b16),
      emissiveIntensity: 0.2,
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    scene.add(earthMesh);

    // Atmosphere Glow
    const atmosphereGeo = new THREE.SphereGeometry(radius * 1.09, 64, 64);
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
          float intensity = pow(0.6 - dot(vNormal, vec3(0, 0, 1.0)), 2.5);
          gl_FragColor = vec4(0.2, 0.6, 1.0, 1.0) * intensity * 0.45;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
    });
    scene.add(new THREE.Mesh(atmosphereGeo, atmosphereMat));

    // Wireframe Lat/Lon Overlay
    const wireframeGeo = new THREE.SphereGeometry(radius + 0.015, 36, 18);
    const wireframeMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.08,
    });
    scene.add(new THREE.Mesh(wireframeGeo, wireframeMat));

    // 3. 3D Glowing Markers
    const glowTexture = createGlowSpriteTexture();
    const markersGroup = new THREE.Group();
    scene.add(markersGroup);

    const markersList: any[] = [];
    const raycastTargets: THREE.Mesh[] = [];

    ALL_COUNTRIES.forEach((country) => {
      const pos = latLongToVector3(country.lat, country.lon, radius, 0.03);
      const markerContainer = new THREE.Group();
      markerContainer.position.copy(pos);
      markerContainer.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), pos.clone().normalize());

      const color = country.isOrigin ? 0xffea00 : 0xfacc15;

      // Core Dot Mesh
      const dotMesh = new THREE.Mesh(
        new THREE.SphereGeometry(country.isOrigin ? 0.1 : 0.08, 16, 16),
        new THREE.MeshStandardMaterial({
          color,
          emissive: color,
          emissiveIntensity: 3.0,
          roughness: 0.1,
          transparent: true,
          opacity: country.isOrigin ? 1.0 : 0.0,
        })
      );
      markerContainer.add(dotMesh);

      // Hitbox
      const hitMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.35, 12, 12),
        new THREE.MeshBasicMaterial({ visible: false })
      );
      hitMesh.userData = { country };
      markerContainer.add(hitMesh);
      raycastTargets.push(hitMesh);

      // Glow Sprite
      const sprite = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: glowTexture,
          color,
          transparent: true,
          opacity: country.isOrigin ? 0.95 : 0.0,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        })
      );
      sprite.scale.set(0.45, 0.45, 1.0);
      markerContainer.add(sprite);

      // Pulsing Ring
      const ringMesh = new THREE.Mesh(
        new THREE.RingGeometry(0.08, 0.18, 32),
        new THREE.MeshBasicMaterial({
          color,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: country.isOrigin ? 0.8 : 0.0,
          depthWrite: false,
        })
      );
      ringMesh.rotation.x = Math.PI / 2;
      markerContainer.add(ringMesh);

      // Pillar Beacon
      const pillarGeo = new THREE.CylinderGeometry(0.008, 0.02, 0.4, 8);
      pillarGeo.translate(0, 0.2, 0);
      const pillarMesh = new THREE.Mesh(
        pillarGeo,
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity: country.isOrigin ? 0.6 : 0.0 })
      );
      markerContainer.add(pillarMesh);

      markersGroup.add(markerContainer);

      markersList.push({
        country,
        dotMesh,
        sprite,
        ringMesh,
        pillarMesh,
        currentScale: country.isOrigin ? 1.0 : 0.0,
        targetScale: country.isOrigin ? 1.0 : 0.0,
        visibilityAlpha: country.isOrigin ? 1.0 : 0.0,
        targetAlpha: country.isOrigin ? 1.0 : 0.0,
        pulseTime: Math.random() * Math.PI * 2,
      });
    });

    // 4. Connection Arcs
    const arcsGroup = new THREE.Group();
    scene.add(arcsGroup);
    const arcsList: any[] = [];

    const startPos = latLongToVector3(ORIGIN_COUNTRY.lat, ORIGIN_COUNTRY.lon, radius, 0.03);

    DESTINATION_COUNTRIES.forEach((country) => {
      const endPos = latLongToVector3(country.lat, country.lon, radius, 0.03);
      const dist = startPos.distanceTo(endPos);
      const midPos = startPos
        .clone()
        .add(endPos)
        .multiplyScalar(0.5)
        .normalize()
        .multiplyScalar(radius + Math.min(dist * 0.35, 2.2));

      const curve = new THREE.QuadraticBezierCurve3(startPos, midPos, endPos);
      const totalPoints = 120;
      const fullPoints = curve.getPoints(totalPoints);

      // Track Line
      const baseLine = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(fullPoints),
        new THREE.LineBasicMaterial({ color: 0xfacc15, transparent: true, opacity: 0.2 })
      );
      arcsGroup.add(baseLine);

      // Flow Line
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
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    container.addEventListener("pointermove", handlePointerMove);

    // Resize Observer
    const resizeObserver = new ResizeObserver(() => {
      if (!container || !camera || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight || w;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    resizeObserver.observe(container);

    // 6. Animation Loop
    const clock = new THREE.Clock();
    let animId: number;

    function animate() {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      controls.update();

      // Update Markers
      markersList.forEach((m) => {
        m.pulseTime += delta * 3;
        m.visibilityAlpha += (m.targetAlpha - m.visibilityAlpha) * 0.12;

        m.dotMesh.material.opacity = m.visibilityAlpha;
        m.sprite.material.opacity = m.visibilityAlpha;
        m.pillarMesh.material.opacity = m.visibilityAlpha * 0.6;

        if (m.visibilityAlpha > 0.05) {
          const phase = (m.pulseTime % (Math.PI * 2)) / (Math.PI * 2);
          m.ringMesh.scale.setScalar(1.0 + phase * 1.4);
          m.ringMesh.material.opacity = (1.0 - phase) * 0.8 * m.visibilityAlpha;
        }

        m.currentScale += (m.targetScale - m.currentScale) * 0.15;
        m.dotMesh.scale.setScalar(m.currentScale);
        m.sprite.scale.setScalar(0.45 * m.currentScale);
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

        if (activeProgress >= 0.95) {
          const targetMarker = markersList.find((m) => m.country.id === arc.countryId);
          if (targetMarker) targetMarker.targetAlpha = 1.0;
        }
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
            m.targetScale = m.country.id === country.id ? 1.8 : m.country.isOrigin || m.targetAlpha > 0.5 ? 1.0 : 0.0;
          });
        }

        if (container) {
          const worldPos = new THREE.Vector3();
          intersects[0].object.getWorldPosition(worldPos);
          const screenPos = worldPos.project(camera);
          const rect = container.getBoundingClientRect();
          const x = (screenPos.x * 0.5 + 0.5) * rect.width;
          const y = (-(screenPos.y * 0.5) + 0.5) * rect.height;

          setTooltipPos({ x, y });
        }
      } else {
        if (activeHovered !== null) {
          activeHovered = null;
          setHoveredCountry(null);
          markersList.forEach((m) => {
            m.targetScale = m.country.isOrigin || m.targetAlpha > 0.5 ? 1.0 : 0.0;
          });
        }
      }

      renderer.render(scene, camera);
    }

    animate();

    return () => {
      if (container) {
        container.removeEventListener("pointermove", handlePointerMove);
        if (renderer && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      }
      resizeObserver.disconnect();
      if (animId) cancelAnimationFrame(animId);
      if (renderer) renderer.dispose();
    };
  }, []);

  return (
    <div className="relative h-[550px] w-full select-none">
      {/* 3D Canvas Mount Point (Transparent) */}
      <div ref={mountRef} className="h-full w-full" />

      {/* Floating Minimal Tooltip (Light Theme) */}
      {hoveredCountry && (
        <div
          className="pointer-events-none absolute z-50 -translate-x-1/2 -translate-y-[130%] rounded-xl border border-amber-400/60 bg-white/95 px-4 py-2.5 text-xs text-slate-800 shadow-[0_10px_30px_rgba(0,80,160,0.18)] backdrop-blur-md transition-all duration-150 whitespace-nowrap"
          style={{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px` }}
        >
          <div className="mb-1 flex items-center gap-1.5 font-bold text-amber-600">
            <span>{hoveredCountry.flag}</span>
            <span>{hoveredCountry.name}</span>
          </div>
          <div className="text-[0.72rem] font-medium text-slate-500">Capital: {hoveredCountry.capital}</div>
        </div>
      )}
    </div>
  );
}

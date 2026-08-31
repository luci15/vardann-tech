"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export interface CountryData {
  id: string;
  name: string;
  /** Short label for the on-globe tag chip — falls back to `name`. */
  short?: string;
  /** ISO alpha-2 code, shown as a small badge on the tag chip instead of a
   *  flag emoji — regional-indicator flag glyphs don't render as flags on
   *  this Windows/Chrome setup (they showed as bare letters, e.g. "IQ"),
   *  so a deliberate code badge is more reliable than relying on emoji
   *  font support. */
  code: string;
  flag: string;
  lat: number;
  lon: number;
  capital: string;
  isOrigin?: boolean;
}

export const ORIGIN_COUNTRY: CountryData = {
  id: "india",
  name: "India",
  code: "IN",
  flag: "🇮🇳",
  lat: 20.5937,
  lon: 78.9629,
  capital: "New Delhi",
  isOrigin: true,
};

// Matches the regions the company actually serves per its own profile
// ("clients across India, the Middle East, Africa, and the Asia-Pacific
// region") — the previous list (USA, Russia, Egypt, Libya) didn't.
export const DESTINATION_COUNTRIES: CountryData[] = [
  { id: "kuwait", name: "Kuwait", code: "KW", flag: "🇰🇼", lat: 29.3759, lon: 47.9774, capital: "Kuwait City" },
  { id: "saudi_arabia", name: "Saudi Arabia", code: "SA", flag: "🇸🇦", lat: 23.8859, lon: 45.0792, capital: "Riyadh" },
  { id: "qatar", name: "Qatar", code: "QA", flag: "🇶🇦", lat: 25.3548, lon: 51.1839, capital: "Doha" },
  { id: "iran", name: "Iran", code: "IR", flag: "🇮🇷", lat: 32.4279, lon: 53.688, capital: "Tehran" },
  { id: "iraq", name: "Iraq", code: "IQ", flag: "🇮🇶", lat: 33.2232, lon: 43.6793, capital: "Baghdad" },
  { id: "uae", name: "United Arab Emirates", short: "UAE", code: "AE", flag: "🇦🇪", lat: 23.4241, lon: 53.8478, capital: "Abu Dhabi" },
  { id: "thailand", name: "Thailand", code: "TH", flag: "🇹🇭", lat: 15.87, lon: 100.9925, capital: "Bangkok" },
  { id: "indonesia", name: "Indonesia", code: "ID", flag: "🇮🇩", lat: -0.7893, lon: 113.9213, capital: "Jakarta" },
  { id: "vietnam", name: "Vietnam", code: "VN", flag: "🇻🇳", lat: 14.0583, lon: 108.2772, capital: "Hanoi" },
  { id: "australia", name: "Australia", code: "AU", flag: "🇦🇺", lat: -25.2744, lon: 133.7751, capital: "Canberra" },
  { id: "new_zealand", name: "New Zealand", short: "NZ", code: "NZ", flag: "🇳🇿", lat: -40.9006, lon: 174.886, capital: "Wellington" },
  { id: "ghana", name: "Ghana", code: "GH", flag: "🇬🇭", lat: 7.9465, lon: -1.0232, capital: "Accra" },
  { id: "uganda", name: "Uganda", code: "UG", flag: "🇺🇬", lat: 1.3733, lon: 32.2903, capital: "Kampala" },
  { id: "kenya", name: "Kenya", code: "KE", flag: "🇰🇪", lat: -1.2921, lon: 36.8219, capital: "Nairobi" },
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

  // Pale Silvery Slate Ocean Fill (Matching Reference Theme)
  ctx.fillStyle = "#eaedf2";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Continents Polygons (Vardann Brand Blue with Crisp White Outlines)
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
    const containerEl = mountRef.current;
    if (!containerEl || !isWebGLAvailable()) return;
    containerEl.style.position = "relative";

    const width = containerEl.clientWidth || 550;
    const height = containerEl.clientHeight || 550;

    // 1. Scene & Camera (Transparent Background)
    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 3, 15.5);

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
    // Zoom/pan off: OrbitControls captures the mouse wheel by default, so
    // scrolling the page while the cursor passes over the globe dollied the
    // camera in instead — eventually landing closer than the sphere fits,
    // which is what cropped it. Dragging to rotate still works.
    controls.enableZoom = false;
    controls.enablePan = false;

    // Everything that shares the sphere's orientation lives in one group so
    // it can be rotated together as a single starting offset (see below) —
    // without this, the camera's default (0,3,15.5) position happened to
    // face the hemisphere OPPOSITE India/the Middle East on first load,
    // since nothing here ever compensated for where India's longitude
    // actually falls in the latLongToVector3 mapping.
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // 2. Globe Mesh with 4K Real Country Vector Outlines Texture
    const radius = 5;
    const earthGeo = new THREE.SphereGeometry(radius, 64, 64);
    const fallbackTex = createEarthTexture();
    const earthMat = new THREE.MeshStandardMaterial({
      map: fallbackTex,
      roughness: 0.6,
      metalness: 0.05,
    });

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load("/earth-vector-countries.png", (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      earthMat.map = tex;
      earthMat.needsUpdate = true;
    });

    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    globeGroup.add(earthMesh);

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
    globeGroup.add(new THREE.Mesh(atmosphereGeo, atmosphereMat));

    // Spherical Wireframe Grid Overlay (Matching Reference Image)
    const wireframeGeo = new THREE.SphereGeometry(radius + 0.015, 36, 18);
    const wireframeMat = new THREE.MeshBasicMaterial({
      color: 0x8592a6,
      wireframe: true,
      transparent: true,
      opacity: 0.14,
    });
    globeGroup.add(new THREE.Mesh(wireframeGeo, wireframeMat));

    // 3. 3D Glowing Markers + always-on country tag chips (HTML overlay,
    // not just the hover tooltip further down — updated imperatively every
    // frame rather than via React state, since ~15 labels re-rendering
    // through React on every frame would be wasteful).
    const glowTexture = createGlowSpriteTexture();
    const markersGroup = new THREE.Group();
    globeGroup.add(markersGroup);

    const labelsLayer = document.createElement("div");
    labelsLayer.style.cssText = "position:absolute;inset:0;pointer-events:none;overflow:visible;";
    containerEl.appendChild(labelsLayer);

    const markersList: any[] = [];
    const raycastTargets: THREE.Mesh[] = [];

    ALL_COUNTRIES.forEach((country) => {
      const pos = latLongToVector3(country.lat, country.lon, radius, 0.03);
      const markerContainer = new THREE.Group();
      markerContainer.position.copy(pos);
      markerContainer.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), pos.clone().normalize());

      const color = 0xffea00; // Bright Sun Yellow Color

      // Core Sun Dot Mesh
      const dotMesh = new THREE.Mesh(
        new THREE.SphereGeometry(country.isOrigin ? 0.12 : 0.09, 16, 16),
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
        new THREE.SphereGeometry(0.35, 12, 12),
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
      sprite.scale.set(0.45, 0.45, 1.0);
      markerContainer.add(sprite);

      // Pulsing Sun Ring
      const ringMesh = new THREE.Mesh(
        new THREE.RingGeometry(0.08, 0.18, 32),
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

      // Persistent tag chip — a compact code badge + short label, faded in
      // by facing direction and de-overlapped every frame below (see the
      // animation loop), independent of hover. Deliberately not a flag
      // emoji: regional-indicator flag glyphs render as bare two-letter
      // text (not an actual flag icon) in this environment's browser/OS
      // font stack, so a designed code badge is the reliable choice.
      const chipEl = document.createElement("div");
      chipEl.style.cssText = [
        "position:absolute",
        "left:0",
        "top:0",
        "display:flex",
        "align-items:center",
        "gap:5px",
        "white-space:nowrap",
        "padding:2px 8px 2px 2px",
        "border-radius:9999px",
        "background:rgba(255,255,255,0.94)",
        `border:1px solid ${country.isOrigin ? "rgba(248,192,40,0.6)" : "rgba(0,87,164,0.2)"}`,
        "box-shadow:0 3px 10px rgba(15,35,60,0.14)",
        "font-family:var(--font-instrument-sans, sans-serif)",
        "opacity:0",
        "will-change:transform,opacity",
      ].join(";");

      const badgeEl = document.createElement("span");
      badgeEl.textContent = country.code;
      badgeEl.style.cssText = [
        "display:inline-block",
        "padding:1.5px 5px",
        "border-radius:5px",
        `background:${country.isOrigin ? "#f8c028" : "#0057a4"}`,
        `color:${country.isOrigin ? "#283848" : "#ffffff"}`,
        "font-size:8.5px",
        "font-weight:800",
        "letter-spacing:0.02em",
      ].join(";");
      chipEl.appendChild(badgeEl);

      const nameEl = document.createElement("span");
      nameEl.textContent = `${country.short ?? country.name}${country.isOrigin ? " · HQ" : ""}`;
      nameEl.style.cssText = "font-size:10px;font-weight:700;color:#283848;";
      chipEl.appendChild(nameEl);

      labelsLayer.appendChild(chipEl);

      markersList.push({
        country,
        markerContainer,
        dotMesh,
        sprite,
        ringMesh,
        chipEl,
        chipAlpha: 0,
        chipX: 0,
        chipY: 0,
        currentScale: 1.0,
        targetScale: 1.0,
        visibilityAlpha: 1.0,
        targetAlpha: 1.0,
        pulseTime: Math.random() * Math.PI * 2,
      });
    });

    // 4. Connection Arcs (India -> Destinations)
    const arcsGroup = new THREE.Group();
    globeGroup.add(arcsGroup);
    const arcsList: any[] = [];

    const startPos = latLongToVector3(ORIGIN_COUNTRY.lat, ORIGIN_COUNTRY.lon, radius, 0.03);

    DESTINATION_COUNTRIES.forEach((country) => {
      const endPos = latLongToVector3(country.lat, country.lon, radius, 0.03);
      const dist = startPos.distanceTo(endPos);
      let midPos = startPos.clone().add(endPos).multiplyScalar(0.5);

      if (midPos.length() < 0.8) {
        midPos = new THREE.Vector3(0, radius + 2.8, 0);
      } else {
        midPos.normalize().multiplyScalar(radius + Math.max(dist * 0.38, 1.8));
      }

      const curve = new THREE.QuadraticBezierCurve3(startPos, midPos, endPos);
      const totalPoints = 120;
      const fullPoints = curve.getPoints(totalPoints);

      // Track Line — always-visible dim path so the destination reads even
      // between pulses.
      const baseLine = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(fullPoints),
        new THREE.LineBasicMaterial({ color: 0x0057a4, transparent: true, opacity: 0.3 })
      );
      arcsGroup.add(baseLine);

      // Traveling Pulse Line — a bright "comet" sweeps continuously along
      // the full, always-drawn path (per-vertex color falloff around a
      // moving head), instead of the old grow-then-instantly-reset reveal,
      // which read as a slow fill followed by a jarring snap rather than
      // motion.
      const dynamicGeo = new THREE.BufferGeometry().setFromPoints(fullPoints);
      const colArr = new Float32Array(totalPoints * 3);
      dynamicGeo.setAttribute("color", new THREE.Float32BufferAttribute(colArr, 3));

      const dynamicMat = new THREE.LineBasicMaterial({
        vertexColors: true,
        linewidth: 3,
        transparent: true,
        opacity: 1,
      });
      const dynamicLine = new THREE.Line(dynamicGeo, dynamicMat);
      arcsGroup.add(dynamicLine);

      // headT sweeps from -pulseWidth to 1+pulseWidth so the pulse fades
      // fully in before the start and fully out past the end, then loops —
      // staggered start + randomized speed keeps all the arcs from pulsing
      // in unison.
      const pulseWidth = 0.16;
      arcsList.push({
        countryId: country.id,
        fullPoints,
        totalPoints,
        colAttr: dynamicGeo.attributes.color,
        pulseWidth,
        headT: -pulseWidth + Math.random() * (1 + 2 * pulseWidth),
        speed: 0.45 + Math.random() * 0.3,
      });
    });

    // Orient the whole group so India — the hub every arc radiates from —
    // faces the camera by default. latLongToVector3 places a country at
    // theta=(lon+180) around the Y axis; the camera looks from +Z, i.e. the
    // "front" is theta=90°. Rotating the group by (currentAngle - 90°)
    // brings India's angle to exactly 90° regardless of its actual lon.
    const originUnit = latLongToVector3(ORIGIN_COUNTRY.lat, ORIGIN_COUNTRY.lon, 1, 0);
    globeGroup.rotation.y = Math.atan2(originUnit.z, originUnit.x) - Math.PI / 2;

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

    // 6. Animation Loop
    const clock = new THREE.Clock();
    let animId: number;
    const worldPosScratch = new THREE.Vector3();

    function animate() {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      controls.update();

      const rect = containerEl!.getBoundingClientRect();
      const camDir = camera.position.clone().normalize();

      // Update Markers Pulse & Growth & Tag Chips
      markersList.forEach((m) => {
        m.pulseTime += delta * 3;
        m.visibilityAlpha += (m.targetAlpha - m.visibilityAlpha) * 0.12;

        if (m.dotMesh?.material) {
          m.dotMesh.material.opacity = m.visibilityAlpha;
        }
        if (m.sprite?.material) {
          m.sprite.material.opacity = m.visibilityAlpha;
        }

        if (m.visibilityAlpha > 0.05 && m.ringMesh?.material) {
          const phase = (m.pulseTime % (Math.PI * 2)) / (Math.PI * 2);
          m.ringMesh.scale.setScalar(1.0 + phase * 1.4);
          m.ringMesh.material.opacity = (1.0 - phase) * 0.8 * m.visibilityAlpha;
        }

        m.currentScale += (m.targetScale - m.currentScale) * 0.15;
        if (m.dotMesh) m.dotMesh.scale.setScalar(m.currentScale);
        if (m.sprite) m.sprite.scale.setScalar(0.45 * m.currentScale);

        // Tag chip, pass 1: fade by how directly the marker faces the
        // camera (only the roughly-forward half of the globe, not the
        // whole visible hemisphere — with 14 destinations clustered near
        // India, showing every front-facing one at once was too crowded).
        m.markerContainer.getWorldPosition(worldPosScratch);
        const facing = worldPosScratch.clone().normalize().dot(camDir);
        const targetChipAlpha = Math.max(0, Math.min(1, (facing - 0.35) / 0.35)) * m.visibilityAlpha;
        m.chipAlpha += (targetChipAlpha - m.chipAlpha) * 0.15;
        if (m.chipAlpha > 0.02) {
          const screenPos = worldPosScratch.clone().project(camera);
          m.chipX = (screenPos.x * 0.5 + 0.5) * rect.width;
          m.chipY = (-(screenPos.y * 0.5) + 0.5) * rect.height;
        }
      });

      // Tag chip, pass 2: nudge apart any still-visible chips whose boxes
      // would overlap (the clustered Middle East countries otherwise stack
      // right on top of one another). Approximates each chip's box from
      // its label's character count rather than measuring the live DOM
      // every frame. A few relaxation passes are enough for ~14 labels.
      const visibleChips = markersList.filter((m) => m.chipAlpha > 0.05);
      visibleChips.forEach((m) => {
        const label = m.country.short ?? m.country.name;
        m.chipHalfW = (label.length * 5.4 + 34) / 2;
        m.chipHalfH = 11;
      });
      for (let pass = 0; pass < 3; pass++) {
        for (let i = 0; i < visibleChips.length; i++) {
          for (let j = i + 1; j < visibleChips.length; j++) {
            const a = visibleChips[i];
            const b = visibleChips[j];
            const dx = b.chipX - a.chipX;
            const dy = b.chipY - a.chipY;
            const overlapX = a.chipHalfW + b.chipHalfW - Math.abs(dx);
            const overlapY = a.chipHalfH + b.chipHalfH - Math.abs(dy);
            if (overlapX > 0 && overlapY > 0) {
              const push = overlapY / 2 + 1;
              if (dy >= 0) {
                a.chipY -= push;
                b.chipY += push;
              } else {
                a.chipY += push;
                b.chipY -= push;
              }
            }
          }
        }
      }

      markersList.forEach((m) => {
        if (!m.chipEl) return;
        m.chipEl.style.opacity = String(m.chipAlpha);
        if (m.chipAlpha > 0.02) {
          m.chipEl.style.transform = `translate(-50%, -150%) translate(${m.chipX}px, ${m.chipY}px)`;
        }
      });

      // Update Connection Flow Lines — a bright comet sweeps continuously
      // along each full arc; per-vertex color falls off from a dim base
      // tone up to a near-white flash at the moving head.
      arcsList.forEach((arc) => {
        arc.headT += delta * arc.speed;
        const cycleLen = 1 + 2 * arc.pulseWidth;
        if (arc.headT > 1 + arc.pulseWidth) arc.headT -= cycleLen;

        const colAttr = arc.colAttr;
        for (let i = 0; i < arc.totalPoints; i++) {
          const t = i / arc.totalPoints;
          const dist = Math.abs(t - arc.headT);
          // Squared falloff reads as a glowing pulse rather than a linear
          // ramp — brighter, snappier "pop" right at the head.
          const intensity = dist < arc.pulseWidth ? 1 - Math.pow(dist / arc.pulseWidth, 2) : 0;

          let r = 0.03, g = 0.08, b = 0.15; // dim navy base — always faintly visible
          if (intensity > 0) {
            // Brand blue through most of the tail, flashing toward white
            // right at the head for the "pop".
            const blueMix = Math.min(1, intensity * 1.3);
            let gr = 0.03 + (0.0 - 0.03) * blueMix;
            let gg = 0.08 + (0.341 - 0.08) * blueMix;
            let gb = 0.15 + (0.643 - 0.15) * blueMix;
            const flash = Math.max(0, (intensity - 0.75) / 0.25);
            r = gr + (1 - gr) * flash;
            g = gg + (1 - gg) * flash;
            b = gb + (1 - gb) * flash;
          }
          colAttr.setXYZ(i, r, g, b);
        }
        colAttr.needsUpdate = true;
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

        if (containerEl) {
          const worldPos = new THREE.Vector3();
          intersects[0].object.getWorldPosition(worldPos);
          const screenPos = worldPos.project(camera);
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
      if (containerEl) {
        containerEl.removeEventListener("pointermove", handlePointerMove);
        if (renderer && containerEl.contains(renderer.domElement)) {
          containerEl.removeChild(renderer.domElement);
        }
        if (containerEl.contains(labelsLayer)) {
          containerEl.removeChild(labelsLayer);
        }
      }
      resizeObserver.disconnect();
      if (animId) cancelAnimationFrame(animId);
      if (renderer) renderer.dispose();
    };
  }, []);

  return (
    <div className="relative h-full w-full select-none overflow-visible">
      {/* 3D Canvas Mount Point (also hosts the always-on country tag chips,
          appended imperatively above) */}
      <div ref={mountRef} className="h-full w-full" />

      {/* Floating Tooltip (Ultra-Transparent Glassmorphism) — extra detail
          (capital) on hover, on top of the always-visible tag chips. */}
      {hoveredCountry && (
        <div
          className="pointer-events-none absolute z-50 -translate-x-1/2 -translate-y-[130%] rounded-2xl border border-white/60 bg-white/30 px-4 py-3 text-xs text-slate-900 shadow-[0_16px_40px_rgba(0,0,0,0.15)] backdrop-blur-2xl transition-all duration-150 whitespace-nowrap"
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

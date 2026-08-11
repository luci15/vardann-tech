"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { createGeoJsonEarthTexture, createProceduralBumpTexture } from "./textureGenerator";

export interface GlobeMarker {
  location: [number, number];
  size?: number;
  label?: string;
}

export interface GlobeArc {
  from: [number, number];
  to: [number, number];
}

interface GlobeCdnProps {
  className?: string;
  speed?: number;
  scrollSensitivity?: number;
  markers?: GlobeMarker[];
  arcs?: GlobeArc[];
}

export class Globe {
  container: HTMLElement;
  radius: number;
  textureLoader: THREE.TextureLoader;
  scene!: THREE.Scene;
  camera!: THREE.PerspectiveCamera;
  renderer!: THREE.WebGLRenderer;
  sunLight!: THREE.DirectionalLight;
  earthMaterial!: THREE.MeshStandardMaterial;
  earthMesh!: THREE.Mesh;
  wireframeMesh!: THREE.Mesh;
  atmosphereMesh!: THREE.Mesh;
  stars!: THREE.Points;
  controls!: OrbitControls;
  animationFrameId?: number;
  onUpdate?: (globe: Globe) => void;

  constructor(container: HTMLElement, onUpdate?: (globe: Globe) => void) {
    this.container = container;
    this.radius = 5;
    this.onUpdate = onUpdate;

    this.textureLoader = new THREE.TextureLoader();

    this.initScene();
    this.initLights();
    this.initEarth();
    this.initAtmosphere();
    this.initStars();
    this.initControls();

    this.handleResize = this.handleResize.bind(this);
    window.addEventListener("resize", this.handleResize);

    this.animate();
  }

  initScene() {
    this.scene = new THREE.Scene();
    // Light mode transparent background
    this.scene.background = null;

    const width = this.container.clientWidth || 450;
    const height = this.container.clientHeight || width;

    this.camera = new THREE.PerspectiveCamera(
      45,
      width / height,
      0.1,
      1000
    );
    this.camera.position.set(0, 3, 14);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
      alpha: true,
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;

    this.container.appendChild(this.renderer.domElement);
  }

  initLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    this.scene.add(ambientLight);

    this.sunLight = new THREE.DirectionalLight(0xfff7ed, 1.8);
    this.sunLight.position.set(12, 10, 10);
    this.scene.add(this.sunLight);

    const rimLight = new THREE.DirectionalLight(0x94a3b8, 0.5);
    rimLight.position.set(-10, -5, -10);
    this.scene.add(rimLight);
  }

  initEarth() {
    const geometry = new THREE.SphereGeometry(this.radius, 64, 64);
    const bumpTexture = createProceduralBumpTexture();
    const geoJsonTexture = createGeoJsonEarthTexture();

    this.earthMaterial = new THREE.MeshStandardMaterial({
      map: geoJsonTexture,
      bumpMap: bumpTexture,
      bumpScale: 0.02,
      roughness: 0.6,
      metalness: 0.05,
      emissive: new THREE.Color(0xffffff),
      emissiveIntensity: 0.05,
    });

    this.earthMesh = new THREE.Mesh(geometry, this.earthMaterial);
    this.scene.add(this.earthMesh);

    // Grid lines
    const wireframeGeo = new THREE.SphereGeometry(this.radius + 0.015, 36, 18);
    const wireframeMat = new THREE.MeshBasicMaterial({
      color: 0x0050a0,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
    });
    this.wireframeMesh = new THREE.Mesh(wireframeGeo, wireframeMat);
    this.scene.add(this.wireframeMesh);
  }

  initAtmosphere() {
    const atmosphereGeo = new THREE.SphereGeometry(this.radius * 1.1, 64, 64);

    const atmosphereVertexShader = `
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const atmosphereFragmentShader = `
      varying vec3 vNormal;
      void main() {
        float intensity = pow(0.6 - dot(vNormal, vec3(0, 0, 1.0)), 2.5);
        gl_FragColor = vec4(0.0, 0.5, 0.95, 1.0) * intensity * 0.3;
      }
    `;

    const atmosphereMat = new THREE.ShaderMaterial({
      vertexShader: atmosphereVertexShader,
      fragmentShader: atmosphereFragmentShader,
      blending: THREE.NormalBlending,
      side: THREE.BackSide,
      transparent: true,
    });

    this.atmosphereMesh = new THREE.Mesh(atmosphereGeo, atmosphereMat);
    this.scene.add(this.atmosphereMesh);
  }

  initStars() {
    const starsCount = 1800;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starsCount * 3);
    const colors = new Float32Array(starsCount * 3);

    for (let i = 0; i < starsCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 350;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 350;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 350;

      if (Math.random() > 0.7) {
        colors[i * 3] = 0.98;
        colors[i * 3 + 1] = 0.88;
        colors[i * 3 + 2] = 0.28;
      } else {
        colors[i * 3] = 0.45;
        colors[i * 3 + 1] = 0.55;
        colors[i * 3 + 2] = 0.65;
      }
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.7,
      vertexColors: true,
      transparent: true,
      opacity: 0.25,
      sizeAttenuation: true,
    });

    this.stars = new THREE.Points(geometry, material);
    this.scene.add(this.stars);
  }

  initControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.minDistance = 6.5;
    this.controls.maxDistance = 25;
    this.controls.rotateSpeed = 0.8;
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = 0.6;
  }

  handleResize() {
    if (!this.container) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight || width;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    this.animationFrameId = requestAnimationFrame(() => this.animate());
    this.controls.update();
    if (this.stars) {
      this.stars.rotation.y += 0.0001;
    }
    if (this.onUpdate) {
      this.onUpdate(this);
    }
    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    window.removeEventListener("resize", this.handleResize);
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    this.renderer.dispose();
    if (this.container.contains(this.renderer.domElement)) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}

function latLonToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

export function GlobeCdn({
  className = "",
  markers = [],
  arcs = [],
}: GlobeCdnProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<Globe | null>(null);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const arcRefs = useRef<(SVGPathElement | null)[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const globe = new Globe(container, (g) => {
      if (!g.earthMesh || !g.camera) return;

      const width = container.clientWidth;
      const height = container.clientHeight || width;

      // Project Markers
      markers.forEach((m, i) => {
        const dot = dotRefs.current[i];
        if (!dot) return;

        const pos = latLonToVector3(m.location[0], m.location[1], 5.02);
        pos.applyMatrix4(g.earthMesh.matrixWorld);

        const isFront = pos.dot(g.camera.position) > 0;
        pos.project(g.camera);

        const px = (pos.x * 0.5 + 0.5) * width;
        const py = (-pos.y * 0.5 + 0.5) * height;

        dot.style.transform = `translate(${px}px, ${py}px) translate(-50%, -50%) scale(${isFront ? 1 : 0})`;
        dot.style.opacity = isFront ? "1" : "0";
      });

      // Project Arcs
      arcs.forEach((arc, i) => {
        const path = arcRefs.current[i];
        if (!path) return;

        const pos1 = latLonToVector3(arc.from[0], arc.from[1], 5.02);
        pos1.applyMatrix4(g.earthMesh.matrixWorld);
        const front1 = pos1.dot(g.camera.position) > 0;
        pos1.project(g.camera);
        const x1 = (pos1.x * 0.5 + 0.5) * width;
        const y1 = (-pos1.y * 0.5 + 0.5) * height;

        const pos2 = latLonToVector3(arc.to[0], arc.to[1], 5.02);
        pos2.applyMatrix4(g.earthMesh.matrixWorld);
        const front2 = pos2.dot(g.camera.position) > 0;
        pos2.project(g.camera);
        const x2 = (pos2.x * 0.5 + 0.5) * width;
        const y2 = (-pos2.y * 0.5 + 0.5) * height;

        const mx = (x1 + x2) / 2;
        const my = (y1 + y2) / 2 - width * 0.08;

        path.setAttribute("d", `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`);
        path.style.opacity = front1 && front2 ? "0.85" : "0";
      });
    });

    globeRef.current = globe;

    return () => {
      globe.destroy();
    };
  }, [markers, arcs]);

  return (
    <div className={`relative aspect-square select-none ${className}`}>
      <div ref={containerRef} className="relative z-10 h-full w-full" />
      <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
        <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
          <defs>
            <marker
              id="arc-arrow"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto"
            >
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#0050a0" />
            </marker>
          </defs>
          {arcs.map((arc) => (
            <path
              key={`${arc.from.join(",")}-${arc.to.join(",")}`}
              ref={(el) => {
                if (el) arcRefs.current.push(el);
              }}
              fill="none"
              stroke="#0050a0"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeDasharray="3 4"
              markerEnd="url(#arc-arrow)"
              opacity={0}
              style={{ animation: "arc-flow 1s linear infinite" }}
            />
          ))}
        </svg>
        {markers.map((m, i) => (
          <span
            key={m.location.join(",")}
            ref={(el) => {
              dotRefs.current[i] = el;
            }}
            className="absolute left-0 top-0 flex items-center gap-2"
            style={{ opacity: 0, transition: "opacity 120ms linear" }}
          >
            <span className="relative flex h-8 w-8 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full border border-gold/60 bg-gold/25 opacity-75" />
              <span className="absolute inline-flex h-5 w-5 rounded-full border border-gold/70 bg-gold/30" />
              <span className="relative h-2.5 w-2.5 shrink-0 rounded-full bg-gold shadow-[0_0_12px_3px_rgba(248,192,40,0.9)] ring-2 ring-white" />
            </span>
            {m.label && (
              <span className="whitespace-nowrap rounded bg-white/95 px-2 py-0.5 text-[0.62rem] font-bold tracking-wider text-slate-800 shadow-md border border-slate-200/90 font-sans">
                {m.label.toUpperCase()}
              </span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}

export default GlobeCdn;

"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function createArcCurve(maxOffset: number, seed: number) {
  const random = (s: number) => {
    const x = Math.sin(s * 12.9898 + seed) * 43758.5453;
    return x - Math.floor(x);
  };

  const basePoints: THREE.Vector3[] = [];
  for (let i = 0; i <= 200; i++) {
    const t = i / 200;
    const x = (t - 0.5) * 22;
    const y = Math.tanh((t - 0.5) * 5.5) * 8;
    basePoints.push(new THREE.Vector3(x, y, 0));
  }

  const baseCurve = new THREE.CatmullRomCurve3(basePoints, false, "centripetal", 0.1);
  const offsetX = (random(seed) - 0.5) * 2;
  const rawOffsetY = random(seed + 100);
  const offsetZ = (random(seed + 200) - 0.5) * 2;

  const finalPoints: THREE.Vector3[] = [];
  for (let i = 0; i <= 300; i++) {
    const t = i / 300;
    const point = baseCurve.getPoint(t);
    const k = 12;
    const w1 = Math.exp(-k * t);
    const w2 = Math.exp(-k * Math.abs(t - 0.5) * 2);
    const w3 = Math.exp(-k * (1 - t));
    const totalWeight = w1 + w2 + w3;
    const spreadFactor = 1 - totalWeight / (totalWeight + 0.3);
    const actualOffset = maxOffset * Math.pow(spreadFactor, 1.5);
    const blend = Math.tanh((t - 0.5) * 6);
    const offsetY = rawOffsetY * -blend * 2;
    point.x += offsetX * actualOffset;
    point.y += offsetY * actualOffset;
    point.z += offsetZ * actualOffset;
    finalPoints.push(point);
  }

  return new THREE.CatmullRomCurve3(finalPoints, false, "centripetal", 0.0);
}

type LineData = { type: string; baseOpacity: number };

export default function ArcScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const group = new THREE.Group();
    const lines: THREE.Line[] = [];

    const addLayer = (count: number, maxOffset: number, seedBase: number, color: number, opacity: number, points: number, type: string) => {
      for (let i = 0; i < count; i++) {
        const curve = createArcCurve(maxOffset, i * (7 - seedBase * 0.5) + seedBase * 1000);
        const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(points));
        const material = new THREE.LineBasicMaterial({ color, transparent: true, opacity, blending: THREE.AdditiveBlending });
        const line = new THREE.Line(geometry, material);
        line.userData = { type, baseOpacity: opacity } as LineData;
        lines.push(line);
        group.add(line);
      }
    };

    addLayer(15, 0.04,  0, 0xffffff, 0.85, 250, "brightest");
    addLayer(25, 0.1,   1, 0x00bbff, 0.60, 230, "core");
    addLayer(35, 0.4,   2, 0x0095cc, 0.45, 200, "medium");
    addLayer(50, 0.7,   3, 0x006f99, 0.30, 180, "filament");
    addLayer(35, 1.0,   4, 0x0088cc, 0.18, 150, "outer");

    // Star field
    const starCount = 800;
    const starPositions = new Float32Array(starCount * 3);
    const starSizes = new Float32Array(starCount);
    const rng = (s: number) => { const x = Math.sin(s * 9301 + 49297) * 233280; return x - Math.floor(x); };
    for (let i = 0; i < starCount; i++) {
      const r = 40 + rng(i * 3) * 60;
      const theta = rng(i * 3 + 1) * Math.PI * 2;
      const phi = Math.acos(2 * rng(i * 3 + 2) - 1);
      starPositions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPositions[i * 3 + 2] = r * Math.cos(phi);
      starSizes[i] = 0.5 + rng(i * 7) * 1.5;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute("size", new THREE.BufferAttribute(starSizes, 1));
    const starMat = new THREE.PointsMaterial({
      color: 0xaaddff,
      size: 0.12,
      transparent: true,
      opacity: 0.55,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);


    // Radial glow behind the arc
    const glowCanvas = document.createElement("canvas");
    glowCanvas.width = 512;
    glowCanvas.height = 512;
    const ctx = glowCanvas.getContext("2d")!;
    const grad = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
    grad.addColorStop(0.0,  "rgba(0, 160, 255, 0.08)");
    grad.addColorStop(0.35, "rgba(0, 100, 180, 0.04)");
    grad.addColorStop(0.7,  "rgba(0, 40,  100, 0.015)");
    grad.addColorStop(1.0,  "rgba(0, 0, 0, 0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);
    const glowTex = new THREE.CanvasTexture(glowCanvas);
    const glowMat = new THREE.MeshBasicMaterial({
      map: glowTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const glowMesh = new THREE.Mesh(new THREE.PlaneGeometry(32, 32), glowMat);
    // Position at the sigmoid inflection point (arc midpoint = group local origin = arcContainer x:-6)
    glowMesh.position.set(-6, 0, -1);

    const arcContainer = new THREE.Group();
    arcContainer.add(group);
    arcContainer.add(glowMesh);
    scene.add(arcContainer);

    scene.add(new THREE.AmbientLight(0x001133, 0.3));
    const pointLight = new THREE.PointLight(0x00ddff, 3, 50);
    scene.add(pointLight);
    const brightSpot = new THREE.PointLight(0xffffff, 2, 30);
    brightSpot.position.set(-3, -3, 2);
    scene.add(brightSpot);

    camera.lookAt(0, 0, 0);

    function updateArcForScreenSize() {
      const w = window.innerWidth;
      if (w <= 480) { group.scale.set(0.5, 0.5, 0.5); group.position.set(-2, 0, 0); camera.position.set(0, 0, 30); }
      else if (w <= 768) { group.scale.set(0.85, 0.85, 0.85); group.position.set(-7, 0, 0); camera.position.set(0, 0, 30); }
      else { group.scale.set(1, 1, 1); group.position.set(-6, 0, 0); camera.position.set(0, 0, 25); }
    }
    updateArcForScreenSize();

    const rotationState = { dampen: 1 };
    const mouseOffset = { targetX: 0, targetY: 0, currentX: 0, currentY: 0 };

    const onMouseMove = (e: MouseEvent) => {
      mouseOffset.targetX = -(e.clientX / window.innerWidth - 0.5) * 1.8;
      mouseOffset.targetY =  (e.clientY / window.innerHeight - 0.5) * 1.8;
    };
    document.addEventListener("mousemove", onMouseMove);

    const clock = new THREE.Clock();
    let animId: number;

    function animate() {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();
      lines.forEach((line, i) => {
        (line.material as THREE.LineBasicMaterial).opacity = line.userData.baseOpacity + Math.sin(time * 8 + i * 0.5) * 0.1;
      });
      group.rotation.y = Math.sin(time * 0.1) * (30 * Math.PI / 180) * rotationState.dampen;
      stars.rotation.y = time * 0.008;
      stars.rotation.x = time * 0.003;
      mouseOffset.currentX += (mouseOffset.targetX - mouseOffset.currentX) * 0.03;
      mouseOffset.currentY += (mouseOffset.targetY - mouseOffset.currentY) * 0.03;
      arcContainer.position.x = mouseOffset.currentX;
      arcContainer.position.y = mouseOffset.currentY;
      renderer.render(scene, camera);
    }
    animate();

    // Cursor glow
    const glow = glowRef.current;
    let glowTargetX = 0, glowTargetY = 0, glowCurrentX = 0, glowCurrentY = 0, lastTime = performance.now();
    const lagMs = 150;

    const onMouseGlow = (e: MouseEvent) => { glowTargetX = e.clientX; glowTargetY = e.clientY; };
    document.addEventListener("mousemove", onMouseGlow);

    let glowAnimId: number;
    function updateGlow() {
      glowAnimId = requestAnimationFrame(updateGlow);
      const now = performance.now();
      const dt = now - lastTime;
      lastTime = now;
      const factor = dt / (lagMs + dt);
      glowCurrentX += (glowTargetX - glowCurrentX) * factor;
      glowCurrentY += (glowTargetY - glowCurrentY) * factor;
      if (glow) { glow.style.left = glowCurrentX + "px"; glow.style.top = glowCurrentY + "px"; }
    }
    updateGlow();

    // Scroll animations
    const nav = document.querySelector(".main-nav");
    const heroTitle = document.querySelector(".hero-title");
    const navArcLogo = document.querySelector(".nav-arc-logo") as HTMLElement | null;

    function screenToWorld(sx: number, sy: number) {
      const vFov = camera.fov * Math.PI / 180;
      const dist = camera.position.z;
      const h = 2 * Math.tan(vFov / 2) * dist;
      const w = h * camera.aspect;
      return { x: (sx / window.innerWidth - 0.5) * w, y: -(sy / window.innerHeight - 0.5) * h };
    }

    function getInitial() {
      const w = window.innerWidth;
      if (w <= 480) return { scale: 0.5, posX: -2, camZ: 30 };
      if (w <= 768) return { scale: 0.85, posX: -7, camZ: 30 };
      return { scale: 1, posX: -6, camZ: 25 };
    }

    let scrollTl: gsap.core.Timeline | null = null;
    let bgTl: gsap.core.Timeline | null = null;

    function createTimelines() {
      scrollTl?.kill();
      bgTl?.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());

      const initial = getInitial();
      const target = window.innerWidth > 1300 ? screenToWorld(50, 40) : screenToWorld(35, 30);
      group.scale.set(initial.scale, initial.scale, initial.scale);
      group.position.set(initial.posX, 0, 0);
      rotationState.dampen = 1;

      scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top top",
          end: "+=300",
          scrub: 0.5,
          onUpdate(self) {
            if (self.progress > 0.3) nav?.classList.add("scrolled");
            else nav?.classList.remove("scrolled");

            const coreWhite = new THREE.Color(0xffffff);
            const coreCyan = new THREE.Color(0x00bbff);
            const coreColor = coreWhite.clone().lerp(coreCyan, self.progress);
            lines.forEach(l => { if (l.userData.type === "brightest") (l.material as THREE.LineBasicMaterial).color.copy(coreColor); });

            const fadeProg = Math.max(0, (self.progress - 0.7) / 0.3);
            if (canvas) canvas.style.opacity = String(1 - fadeProg);
            starMat.opacity = 0.55 * (1 - self.progress);
            glowMat.opacity = 1 - self.progress;
            if (navArcLogo) navArcLogo.style.opacity = String(fadeProg);
          }
        }
      });

      scrollTl.to(group.scale, { x: 0.07, y: 0.07, z: 0.07, ease: "none" }, 0);
      scrollTl.to(group.position, { x: target.x, y: target.y, z: 0, ease: "none" }, 0);
      scrollTl.to(rotationState, { dampen: 0, ease: "none" }, 0);
      scrollTl.to(heroTitle, { opacity: 0, y: -40, ease: "none" }, 0);

      bgTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top top",
          end: "+=300",
          scrub: 0.5,
          onUpdate(self) {
            if (self.progress > 0.8) { nav?.classList.add("light"); document.body.classList.add("light"); }
            else { nav?.classList.remove("light"); document.body.classList.remove("light"); }
          }
        }
      });
      bgTl.to(document.body, { backgroundColor: "#ffffff", ease: "none" }, 0);
    }

    createTimelines();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      updateArcForScreenSize();
      createTimelines();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animId);
      cancelAnimationFrame(glowAnimId);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mousemove", onMouseGlow);
      window.removeEventListener("resize", onResize);
      scrollTl?.kill();
      bgTl?.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
      renderer.dispose();
    };
  }, []);

  return (
    <>
      <div ref={glowRef} className="cursor-glow" />
      <canvas ref={canvasRef} id="webgl" />
    </>
  );
}

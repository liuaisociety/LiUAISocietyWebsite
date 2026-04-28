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

type ShootingStar = {
  mesh: THREE.Mesh;
  sprite: THREE.Sprite;
  head: THREE.Vector3;
  dir: THREE.Vector3;
  speed: number;
  trailLen: number;
  totalDist: number;
  maxDist: number;
  meshMat: THREE.MeshBasicMaterial;
  spriteMat: THREE.SpriteMaterial;
};

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
    const starCount = 1600;
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
      size: 0.22,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // Shooting stars
    const shootingStarsList: ShootingStar[] = [];
    let nextStarSpawn = 0.5; // first spawn after 0.5s, then every ~10s

    // Trail texture: gaussian cross-section (white core → blue glow → transparent edges)
    // U axis = along trail (0=tail, 1=head), V axis = across width (0=edge, 0.5=center, 1=edge)
    const shootingStarTrailTex = (() => {
      const W = 256, H = 64;
      const img = new ImageData(W, H);
      for (let x = 0; x < W; x++) {
        const u = x / (W - 1);
        const lFade = Math.pow(u, 1.8); // length fade: transparent at tail, bright at head
        for (let y = 0; y < H; y++) {
          const v = (y / (H - 1) - 0.5) * 2; // -1 (edge) to 1 (edge), 0 = center
          const core = Math.exp(-v * v / 0.015); // very narrow bright white core
          const glow = Math.exp(-v * v / 0.25);  // wider soft blue glow
          const alpha = lFade * Math.min(1, core * 0.95 + glow * 0.4);
          const idx = (y * W + x) * 4;
          img.data[idx + 0] = Math.round(lFade * Math.min(255, (core * 255 + glow * 80)));  // R
          img.data[idx + 1] = Math.round(lFade * Math.min(255, (core * 255 + glow * 100))); // G
          img.data[idx + 2] = Math.round(lFade * Math.min(255, (core * 255 + glow * 220))); // B: extra blue in glow
          img.data[idx + 3] = Math.round(alpha * 255);
        }
      }
      const c = document.createElement("canvas");
      c.width = W; c.height = H;
      c.getContext("2d")!.putImageData(img, 0, 0);
      return new THREE.CanvasTexture(c);
    })();

    // Head glow texture: radial gradient for the meteor head orb
    const shootingStarGlowTex = (() => {
      const c = document.createElement("canvas");
      c.width = 64; c.height = 64;
      const gctx = c.getContext("2d")!;
      const g = gctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      g.addColorStop(0,    "rgba(255, 255, 255, 1)");
      g.addColorStop(0.12, "rgba(220, 240, 255, 0.95)");
      g.addColorStop(0.35, "rgba(100, 180, 255, 0.5)");
      g.addColorStop(0.7,  "rgba(40, 100, 255, 0.15)");
      g.addColorStop(1,    "rgba(0, 40, 180, 0)");
      gctx.fillStyle = g;
      gctx.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(c);
    })();

    function spawnShootingStar(spawnTime: number) {
      const r = () => Math.random();

      // Start within the visible frustum (camera at z=25, FOV=50 → ~±11 Y, ±20 X at z=0)
      const startX = (r() - 0.5) * 34;
      const startY = -9 + r() * 18;
      const startZ = -10 + r() * 10;

      // Direction: mostly horizontal with a gentle downward drift
      const dx = (r() > 0.5 ? 1 : -1) * (0.6 + r() * 0.4);
      const dy = -(0.04 + r() * 0.18);
      const dz = (r() - 0.5) * 0.15;
      const dir = new THREE.Vector3(dx, dy, dz).normalize();

      const trailLen = 9 + r() * 9;
      const trailWidth = 0.28 + r() * 0.1; // world units — controls apparent thickness
      const head = new THREE.Vector3(startX, startY, startZ);

      // Trail: PlaneGeometry quad, local X = trail direction, local Y = perpendicular to camera
      // PlaneGeometry(length, height): U 0→1 maps to X −len/2 → +len/2 (tail → head after rotation)
      const geo = new THREE.PlaneGeometry(trailLen, trailWidth);
      const meshMat = new THREE.MeshBasicMaterial({
        map: shootingStarTrailTex,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(geo, meshMat);
      scene.add(mesh);

      // Head: small glowing sprite at the meteor tip
      const spriteMat = new THREE.SpriteMaterial({
        map: shootingStarGlowTex,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.scale.set(0.8, 0.8, 1);
      sprite.position.copy(head);
      scene.add(sprite);

      const maxDist = 20 + r() * 18;
      shootingStarsList.push({
        mesh, sprite,
        head: head.clone(), dir,
        speed: 10 + r() * 10,
        trailLen,
        totalDist: 0,
        maxDist,
        meshMat, spriteMat,
      });
      nextStarSpawn = spawnTime + 8 + Math.random() * 4;
    }

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
      if (w <= 480) { group.scale.set(0.5, 0.5, 0.5); group.position.set(0, 2.2, 0); camera.position.set(0, 0, 30); }
      else if (w <= 768) { group.scale.set(0.85, 0.85, 0.85); group.position.set(0, 2.2, 0); camera.position.set(0, 0, 30); }
      else { group.scale.set(1, 1, 1); group.position.set(-6, 0, 0); camera.position.set(0, 0, 25); }
    }
    updateArcForScreenSize();

    const rotationState = { dampen: 1 };
    const mouseOffset = { targetX: 0, targetY: 0, currentX: 0, currentY: 0 };
    const basePosition = { x: 0, y: 0 };

    const onMouseMove = (e: MouseEvent) => {
      mouseOffset.targetX = -(e.clientX / window.innerWidth - 0.5) * 1.8;
      mouseOffset.targetY =  (e.clientY / window.innerHeight - 0.5) * 1.8;
    };
    document.addEventListener("mousemove", onMouseMove);

    // Cursor glow state — declared here so animate() closure can access them
    const glow = glowRef.current;
    let glowTargetX = 0, glowTargetY = 0, glowCurrentX = 0, glowCurrentY = 0, lastGlowTime = performance.now();
    const lagMs = 150;
    const onMouseGlow = (e: MouseEvent) => { glowTargetX = e.clientX; glowTargetY = e.clientY; };
    document.addEventListener("mousemove", onMouseGlow);

    const timer = new THREE.Timer();
    let animId: number;
    let prevTime = 0;

    function animate() {
      animId = requestAnimationFrame(animate);
      timer.update();
      const time = timer.getElapsed();
      const dt = Math.min(time - prevTime, 0.05);
      prevTime = time;

      // Spawn shooting stars
      if (time >= nextStarSpawn && shootingStarsList.length === 0) spawnShootingStar(time);

      // Update shooting stars
      for (let si = shootingStarsList.length - 1; si >= 0; si--) {
        const star = shootingStarsList[si];
        star.totalDist += star.speed * dt;
        star.head.addScaledVector(star.dir, star.speed * dt);

        // Trail mesh: center at trail midpoint, oriented along dir and facing camera
        const mid = star.head.clone().addScaledVector(star.dir, -star.trailLen / 2);
        star.mesh.position.copy(mid);

        // Build orientation: local X = trail direction, local Y = perpendicular to trail & camera
        const toCam = camera.position.clone().sub(mid).normalize();
        let widthVec = new THREE.Vector3().crossVectors(star.dir, toCam);
        if (widthVec.lengthSq() < 0.0001) widthVec.set(0, 1, 0);
        else widthVec.normalize();
        const normalVec = new THREE.Vector3().crossVectors(star.dir, widthVec);
        star.mesh.setRotationFromMatrix(
          new THREE.Matrix4().makeBasis(star.dir, widthVec, normalVec)
        );

        // Head sprite
        star.sprite.position.copy(star.head);

        // Fade in over first 3 units, fade out over last 5 units
        const fadeIn  = Math.min(star.totalDist / 3, 1);
        const fadeOut = star.totalDist > star.maxDist - 5
          ? Math.max(0, 1 - (star.totalDist - (star.maxDist - 5)) / 5)
          : 1;
        const opacity = fadeIn * fadeOut;
        star.meshMat.opacity = opacity * 0.55;
        star.spriteMat.opacity = opacity * 0.7;

        if (star.totalDist > star.maxDist + star.trailLen) {
          scene.remove(star.mesh);
          scene.remove(star.sprite);
          star.mesh.geometry.dispose();
          star.meshMat.dispose();
          star.spriteMat.dispose();
          shootingStarsList.splice(si, 1);
        }
      }

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

      // Scroll with page: move arc up in world space as user scrolls down
      const worldHeight = 2 * Math.tan((camera.fov * Math.PI / 180) / 2) * camera.position.z;
      group.position.y = basePosition.y + (window.scrollY / window.innerHeight) * worldHeight;

      // Fade out stars and canvas as user scrolls down
      const scrollProgress = Math.min(window.scrollY / (window.innerHeight * 0.8), 1);
      starMat.opacity = 0.9 * (1 - scrollProgress);
      if (canvas) canvas.style.opacity = String(1 - Math.max(0, (scrollProgress - 0.7) / 0.3));
      renderer.render(scene, camera);

      // Cursor glow (merged — eliminates second RAF loop)
      const now = performance.now();
      const glowDt = now - lastGlowTime;
      lastGlowTime = now;
      const factor = glowDt / (lagMs + glowDt);
      glowCurrentX += (glowTargetX - glowCurrentX) * factor;
      glowCurrentY += (glowTargetY - glowCurrentY) * factor;
      if (glow) { glow.style.left = glowCurrentX + "px"; glow.style.top = glowCurrentY + "px"; }
    }

    const onVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(animId);
      } else {
        prevTime = timer.getElapsed();
        lastGlowTime = performance.now();
        animate();
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    animate();

    // Scroll animations
    const nav = document.querySelector(".main-nav");

    function getInitial() {
      const w = window.innerWidth;
      if (w <= 480) return { scale: 0.5, posX: 0, posY: 6.2, camZ: 30 };
      if (w <= 768) return { scale: 0.65, posX: 0, posY: 7.2, camZ: 30 };
      return { scale: 1, posX: -6, posY: 0, camZ: 25 };
    }

    let scrollTl: gsap.core.Timeline | null = null;
    let bgTl: gsap.core.Timeline | null = null;

    function createTimelines() {
      scrollTl?.kill();
      bgTl?.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());

      const initial = getInitial();
      basePosition.x = initial.posX;
      basePosition.y = initial.posY;
      group.scale.set(initial.scale, initial.scale, initial.scale);
      group.position.set(initial.posX, initial.posY, 0);
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
          }
        }
      });

      bgTl = gsap.timeline();
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
      document.removeEventListener("visibilitychange", onVisibilityChange);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mousemove", onMouseGlow);
      window.removeEventListener("resize", onResize);
      scrollTl?.kill();
      bgTl?.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
      shootingStarsList.forEach(s => {
        scene.remove(s.mesh);
        scene.remove(s.sprite);
        s.mesh.geometry.dispose();
        s.meshMat.dispose();
        s.spriteMat.dispose();
      });
      shootingStarTrailTex.dispose();
      shootingStarGlowTex.dispose();
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

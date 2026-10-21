"use client";

import { useEffect, useRef } from "react";
import type { MotionValue } from "framer-motion";
import {
  AmbientLight,
  Color,
  DirectionalLight,
  DoubleSide,
  Group,
  MathUtils,
  Mesh,
  MeshPhysicalMaterial,
  PerspectiveCamera,
  Plane,
  PMREMGenerator,
  Scene,
  SRGBColorSpace,
  ACESFilmicToneMapping,
  Timer,
  Vector3,
  WebGLRenderer,
  type BufferGeometry,
} from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { conducto, corona, raiz } from "@/lib/muela3d";

const tramo = (v: number, a: number, b: number) => MathUtils.smootherstep(v, a, b);

/**
 * Muela en 3D con three.js. Gira con el scroll y se abre por capas:
 * primero se corta el esmalte, luego la dentina, y queda la pulpa a la vista.
 */
export default function Escena({ progreso }: { progreso: MotionValue<number> }) {
  const contenedor = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = contenedor.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = SRGBColorSpace;
    renderer.localClippingEnabled = true;
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.95;
    renderer.domElement.style.display = "block";
    el.appendChild(renderer.domElement);

    const scene = new Scene();
    const pmrem = new PMREMGenerator(renderer);
    const entorno = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = entorno;
    pmrem.dispose();

    const camara = new PerspectiveCamera(32, 1, 0.1, 50);
    camara.position.set(0, 0, 7);

    scene.add(new AmbientLight(0xffffff, 0.12));
    const clave = new DirectionalLight(0xfff7ee, 2.6);
    clave.position.set(3.5, 4.5, 3);
    const contra = new DirectionalLight(0xcfdde6, 1.1);
    contra.position.set(-4, 1, -3);
    scene.add(clave, contra);

    // Planos de corte en el mundo: quitan la mitad que mira a la cámara.
    const corteEsmalte = new Plane(new Vector3(0, 0, -1), 4);
    const corteDentina = new Plane(new Vector3(0, 0, -1), 4);

    const mats = {
      esmalte: new MeshPhysicalMaterial({
        color: new Color("#eee6d8"),
        roughness: 0.32,
        clearcoat: 0.85,
        clearcoatRoughness: 0.18,
        envMapIntensity: 0.55,
        side: DoubleSide,
        clippingPlanes: [corteEsmalte],
      }),
      cemento: new MeshPhysicalMaterial({
        color: new Color("#e8dbbf"),
        roughness: 0.58,
        clearcoat: 0.2,
        envMapIntensity: 0.5,
        side: DoubleSide,
        clippingPlanes: [corteEsmalte],
      }),
      dentina: new MeshPhysicalMaterial({
        color: new Color("#e9cf98"),
        roughness: 0.6,
        envMapIntensity: 0.8,
        side: DoubleSide,
        clippingPlanes: [corteDentina],
      }),
      pulpa: new MeshPhysicalMaterial({
        color: new Color("#d46a76"),
        roughness: 0.42,
        clearcoat: 0.6,
        envMapIntensity: 0.9,
      }),
    };

    const muela = new Group();
    const pieza = new Group();
    pieza.position.y = 0.4;
    muela.add(pieza);
    const piezas: [BufferGeometry, MeshPhysicalMaterial, number][] = [
      [corona(1), mats.esmalte, 0],
      [raiz(-1), mats.cemento, 0],
      [raiz(1), mats.cemento, 0],
      [corona(0.84, 0.7), mats.dentina, 0.03],
      [raiz(-1, 0.78, 1.66), mats.dentina, 0],
      [raiz(1, 0.78, 1.66), mats.dentina, 0],
      [corona(0.33, 0.5), mats.pulpa, -0.02],
      [conducto(-1), mats.pulpa, 0],
      [conducto(1), mats.pulpa, 0],
    ];
    for (const [geo, mat, dy] of piezas) {
      const m = new Mesh(geo, mat);
      m.position.y = dy;
      pieza.add(m);
    }
    scene.add(muela);

    // Tamaño visible del mundo a la distancia de la muela
    let ancho = 1;
    let alto = 1;
    const medir = () => {
      const w = el.clientWidth || 1;
      const h = el.clientHeight || 1;
      renderer.setSize(w, h, false);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      camara.aspect = w / h;
      camara.updateProjectionMatrix();
      alto = 2 * camara.position.z * Math.tan(MathUtils.degToRad(camara.fov / 2));
      ancho = alto * camara.aspect;
    };
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(el);

    const raton = { x: 0, y: 0 };
    const alMover = (e: PointerEvent) => {
      raton.x = (e.clientX / window.innerWidth - 0.5) * 2;
      raton.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", alMover);

    const reloj = new Timer();
    let frame = 0;
    const pintar = (ahora: number) => {
      reloj.update(ahora);
      const dt = Math.min(reloj.getDelta(), 0.05);
      const t = reduce ? 0 : reloj.getElapsed();
      const v = progreso.get();
      const vertical = camara.aspect < 0.9;

      // 1. Portada: a la derecha y girando despacio. 2. Al bajar: al centro y algo más grande.
      const centrar = tramo(v, 0, 0.22);
      const xIni = vertical ? 0 : ancho * 0.22;
      const yIni = vertical ? -alto * 0.36 : 0.1;
      muela.position.x = MathUtils.lerp(xIni, 0, centrar);
      muela.position.y = MathUtils.lerp(yIni, vertical ? 0.2 : 0.05, centrar) + Math.sin(t * 0.9) * 0.05 * (1 - centrar);
      const base = Math.min(1, alto / 5.2, (ancho / 2.6) * 0.95);
      const ini = vertical ? 0.62 : 1;
      muela.scale.setScalar(base * MathUtils.lerp(ini, vertical ? 0.95 : 1.18, centrar));

      // Giro: vuelta y media a lo largo del recorrido, más el ratón en la portada
      const libre = 1 - centrar;
      const objY = v * Math.PI * 3 + t * 0.25 * libre + raton.x * 0.35 * libre;
      const objX = MathUtils.lerp(0.32, 0.08, centrar) + raton.y * 0.2 * libre;
      muela.rotation.y = MathUtils.damp(muela.rotation.y, objY, 6, dt);
      muela.rotation.x = MathUtils.damp(muela.rotation.x, objX, 6, dt);
      muela.rotation.z = MathUtils.damp(muela.rotation.z, -0.12 * libre, 6, dt);

      // 3. Cortes: primero se abre el esmalte, después la dentina
      corteEsmalte.constant = MathUtils.lerp(4, 0, tramo(v, 0.3, 0.46));
      corteDentina.constant = MathUtils.lerp(4, -0.02, tramo(v, 0.52, 0.68));

      renderer.render(scene, camara);
      frame = requestAnimationFrame(pintar);
    };
    frame = requestAnimationFrame(pintar);

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      window.removeEventListener("pointermove", alMover);
      for (const [geo] of piezas) geo.dispose();
      Object.values(mats).forEach((m) => m.dispose());
      entorno.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [progreso]);

  return <div ref={contenedor} className="absolute inset-0" aria-hidden />;
}

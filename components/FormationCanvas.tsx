"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Environment, Float } from "@react-three/drei";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { useRef, useState, useEffect, useMemo } from "react";
import * as THREE from "three";
import { easing } from "maath";
import { generateParticles } from "@/utils/generators";

const PARTICLE_COUNT = 4000;
const CUP_COLOR = "#facc15";

const particleData = generateParticles(PARTICLE_COUNT);

function Particles() {
    const meshRef = useRef<THREE.InstancedMesh>(null);

    const { chaosPositions, cupPositions } = particleData;

    const progress = useRef(0);
    const targetProgress = useRef(0);

    const [started, setStarted] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => {
            targetProgress.current = 1;
            setStarted(true);
        }, 1400);
        return () => clearTimeout(t);
    }, []);

    useFrame((state, delta) => {
        if (!meshRef.current) return;

        const target = targetProgress.current;

        easing.damp(progress, "current", target, 2.5, delta);

        const p = progress.current;
        const dummy = new THREE.Object3D();

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const cx = chaosPositions[i * 3];
            const cy = chaosPositions[i * 3 + 1];
            const cz = chaosPositions[i * 3 + 2];

            const tx = cupPositions[i * 3];
            const ty = cupPositions[i * 3 + 1];
            const tz = cupPositions[i * 3 + 2];

            dummy.position.set(
                cx + (tx - cx) * p,
                cy + (ty - cy) * p,
                cz + (tz - cz) * p
            );

            if (p < 0.9) {
                const fade = 1 - (p / 0.9);
                const noiseIntensity = fade * fade * fade * 4;

                const noise = Math.sin(state.clock.elapsedTime * 2 + i) * noiseIntensity;
                dummy.position.y += noise * 0.2;
            }

            const scale = 0.09;
            dummy.scale.set(scale, scale, scale);

            dummy.updateMatrix();
            meshRef.current.setMatrixAt(i, dummy.matrix);
        }
        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.2}>
            <instancedMesh
                ref={meshRef}
                args={[undefined, undefined, PARTICLE_COUNT]}
                visible={started}
            >
                <boxGeometry args={[1, 1, 1]} />
                <meshPhysicalMaterial
                    color={CUP_COLOR}
                    emissive={CUP_COLOR}
                    emissiveIntensity={0.5}
                    roughness={0.2}
                    metalness={0.8}
                    transmission={0.2}
                    thickness={1.5}
                    ior={1.5}
                    clearcoat={1}
                />
            </instancedMesh>
        </Float>
    );
}

export default function FormationCanvas() {
    return (
        <div className="w-full h-full relative">
            <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 8], fov: 45 }}>
                <color attach="background" args={["#09090b"]} />
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={100} castShadow />
                <pointLight position={[-10, -10, -10]} intensity={50} color="#eab308" />

                <SceneContent />
            </Canvas>
        </div>
    );
}

function SceneContent() {
    const { camera, size } = useThree();
    const controlsRef = useRef<OrbitControlsImpl>(null);

    useEffect(() => {
        const isMobile = size.width < 768;

        const targetZ = isMobile ? 11 : 8;

        const shiftX = isMobile ? 0.6 : 0.5;

        if (controlsRef.current) {
            controlsRef.current.target.set(shiftX, 0, 0);
            controlsRef.current.update();
        }

        camera.position.set(shiftX, 0, targetZ);

        camera.updateProjectionMatrix();

    }, [size.width, camera]);

    return (
        <>
            <Particles />
            <Particles />
            <StarField count={400} />
            <Environment preset="city" />
            <OrbitControls
                ref={controlsRef}
                enableZoom={false}
                enablePan={false}
                minPolarAngle={Math.PI / 4}
                maxPolarAngle={Math.PI / 1.5}
            />
        </>
    );
}

function generateStarTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const centerX = 64;
    const centerY = 64;

    ctx.clearRect(0, 0, 128, 128);

    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 60);
    gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(0.4, "rgba(255, 255, 255, 0.2)");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 60, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "rgba(255, 255, 255, 1.0)";
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, 2, 55, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(centerX, centerY, 2, 55, Math.PI / 2, 0, Math.PI * 2);
    ctx.fill();

    return new THREE.CanvasTexture(canvas);
}

const StarFieldMaterial = {
    vertexShader: `
    attribute float scale;
    attribute float shift;
    uniform float time;
    varying float vAlpha;
    void main() {
        vec3 pos = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        
        // Size Pulse
        float pulse = 1.0 + 0.2 * sin(time * 2.0 + shift);
        gl_PointSize = scale * pulse * 70.0 * (10.0 / gl_Position.w); // Perspective scaling

        // Twinkle Alpha
        vAlpha = 0.5 + 0.5 * sin(time * 1.5 + shift); 
    }
    `,
    fragmentShader: `
    uniform sampler2D map;
    varying float vAlpha;
    void main() {
        vec4 tex = texture2D(map, gl_PointCoord);
        if (tex.a < 0.05) discard;
        gl_FragColor = vec4(tex.rgb, tex.a * vAlpha);
    }
    `
};

function StarField({ count = 200 }: { count?: number }) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const meshRef = useRef<THREE.Points>(null);
    const [texture] = useState(() => typeof window !== "undefined" ? generateStarTexture() : null);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const pointsData = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const scales = new Float32Array(count);
        const shifts = new Float32Array(count);

        for (let i = 0; i < count; i++) {
            const r = 60 + Math.random() * 60;
            const theta = 2 * Math.PI * Math.random();
            const phi = Math.acos(2 * Math.random() - 1);

            positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = r * Math.cos(phi);

            scales[i] = Math.random() * 2.0 + 1.0;
            shifts[i] = Math.random() * 100;
        }
        return { positions, scales, shifts };
    }, [count]);

    useFrame((state) => {
        if (meshRef.current && meshRef.current.material) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            meshRef.current.material.uniforms.time.value = state.clock.elapsedTime;
        }
    });

    if (!texture) return null;

    return (
        <points ref={meshRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    args={[pointsData.positions, 3]}
                />
                <bufferAttribute
                    attach="attributes-scale"
                    count={count}
                    args={[pointsData.scales, 1]}
                />
                <bufferAttribute
                    attach="attributes-shift"
                    count={count}
                    args={[pointsData.shifts, 1]}
                />
            </bufferGeometry>
            <shaderMaterial
                uniforms={{
                    time: { value: 0 },
                    map: { value: texture }
                }}
                transparent
                depthWrite={false}
                vertexShader={StarFieldMaterial.vertexShader}
                fragmentShader={StarFieldMaterial.fragmentShader}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
}

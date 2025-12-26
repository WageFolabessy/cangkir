"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Environment, Float } from "@react-three/drei";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { useMemo, useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { easing } from "maath";
import { generateParticles } from "@/utils/generators";

const PARTICLE_COUNT = 1500;
const CUP_COLOR = "#f97316";

function Particles() {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const [hovered, setHovered] = useState(false);

    const { chaosPositions, cupPositions } = useMemo(() => {
        return generateParticles(PARTICLE_COUNT);
    }, []);

    const progress = useRef(0);
    const targetProgress = useRef(0);

    useEffect(() => {
        const t = setTimeout(() => {
            targetProgress.current = 1;
        }, 500);
        return () => clearTimeout(t);
    }, []);

    useFrame((state, delta) => {
        if (!meshRef.current) return;

        const target = hovered ? 0.6 : targetProgress.current;

        easing.damp(progress, "current", target, 1.2, delta);

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

            if (p < 0.9 && p > 0.1) {
                const noise = Math.sin(state.clock.elapsedTime * 2 + i) * (1 - p);
                dummy.position.y += noise * 0.5;
            }

            const scale = 0.08;
            dummy.scale.set(scale, scale, scale);

            dummy.updateMatrix();
            meshRef.current.setMatrixAt(i, dummy.matrix);
        }
        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <instancedMesh
                ref={meshRef}
                args={[undefined, undefined, PARTICLE_COUNT]}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
            >
                <boxGeometry args={[1, 1, 1]} />
                <meshPhysicalMaterial
                    color={CUP_COLOR}
                    roughness={0.25}
                    metalness={0.1}
                    transmission={0.6}
                    thickness={1.8}
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
                <color attach="background" args={["#f8fafc"]} />
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={100} castShadow />
                <pointLight position={[-10, -10, -10]} intensity={50} color="indigo" />

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

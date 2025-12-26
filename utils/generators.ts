import * as THREE from "three";

export function generateParticles(count: number) {
    const chaos = new Float32Array(count * 3);
    const cup = new Float32Array(count * 3);

    const dummy = new THREE.Vector3();

    for (let i = 0; i < count; i++) {
        const r = 10 * Math.cbrt(Math.random());
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos(2 * Math.random() - 1);

        dummy.setFromSphericalCoords(r, phi, theta);
        chaos[i * 3] = dummy.x;
        chaos[i * 3 + 1] = dummy.y;
        chaos[i * 3 + 2] = dummy.z;
    }

    const validVoxels: THREE.Vector3[] = [];

    const radius = 1.2;
    const totalHeight = 1.8;
    const wallThickness = 0.25;

    const yTop = totalHeight / 2;
    const yBottom = -totalHeight / 2;

    const curveStart = yBottom + 0.8;

    const voxelSize = 0.1;

    const limit = radius + 1.5;

    for (let y = yBottom; y <= yTop; y += voxelSize) {
        for (let x = -limit; x <= limit; x += voxelSize) {
            for (let z = -limit; z <= limit; z += voxelSize) {

                let isVoxel = false;

                const distAxisSq = x * x + z * z;
                const distAxis = Math.sqrt(distAxisSq);

                let isInside = false;
                let isSolid = false;

                if (y >= curveStart) {
                    if (distAxis <= radius) isInside = true;
                } else {
                    if (distAxis <= radius) {
                        const dy = y - curveStart;
                        const sphereDist = Math.sqrt(distAxisSq + dy * dy);
                        if (sphereDist <= radius) isInside = true;
                    }
                }

                if (isInside) {
                    let d = 0;
                    if (y >= curveStart) {
                        d = distAxis;
                    } else {
                        const dy = y - curveStart;
                        d = Math.sqrt(distAxisSq + dy * dy);
                    }

                    if (y < yBottom + 0.25) {
                        isSolid = true;
                    } else if (d >= radius - wallThickness) {
                        isSolid = true;
                    }

                    if (isSolid) isVoxel = true;
                }


                if (!isVoxel) {
                    if (x > radius - 0.2 && z > -0.2 && z < 0.2) {
                        const hCx = radius + 0.6;
                        const hCy = yTop - 0.6;
                        const hRadOuter = 0.7;
                        const hRadInner = 0.45;

                        const dy = y - hCy;
                        const dx = x - hCx;
                        const dH = Math.sqrt(dx * dx + dy * dy);

                        if (dH <= hRadOuter && dH >= hRadInner) {
                            isVoxel = true;
                        }
                    }
                }

                if (isVoxel) {
                    validVoxels.push(new THREE.Vector3(x, y, z));
                }
            }
        }
    }

    for (let i = validVoxels.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [validVoxels[i], validVoxels[j]] = [validVoxels[j], validVoxels[i]];
    }

    for (let i = 0; i < count; i++) {
        const v = validVoxels[i % validVoxels.length] || new THREE.Vector3(0, 0, 0);
        cup[i * 3] = v.x;
        cup[i * 3 + 1] = v.y;
        cup[i * 3 + 2] = v.z;
    }

    return { chaosPositions: chaos, cupPositions: cup };
}

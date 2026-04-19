import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Environment, ContactShadows, Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { HOTSPOTS, useAppStore } from '../store';
import { Info } from 'lucide-react';

const Hotspot = ({ data }: { data: typeof HOTSPOTS[0] }) => {
  const { activeHotspot, setActiveHotspot } = useAppStore();
  const isActive = activeHotspot === data.id;

  return (
    <group position={data.position}>
      <Html center zIndexRange={[100, 0]}>
        <div
          className={`cursor-pointer transition-transform duration-300 ${isActive ? 'scale-125' : 'scale-100 hover:scale-110'}`}
          onClick={(e) => {
            e.stopPropagation();
            setActiveHotspot(isActive ? null : data.id);
          }}
        >
          <div
            className="flex items-center justify-center w-8 h-8 rounded-full shadow-lg border-2 border-white text-white backdrop-blur-sm"
            style={{ backgroundColor: data.color }}
          >
            <Info size={20} />
          </div>
          {isActive && (
            <div className="absolute top-10 left-1/2 -translate-x-1/2 w-32 text-center pointer-events-none">
              <span className="bg-black/80 text-white text-xs px-2 py-1 rounded-full shadow-md whitespace-nowrap inline-block">
                {data.title}
              </span>
            </div>
          )}
        </div>
      </Html>
    </group>
  );
};

const Particles = ({ count, type }: { count: number, type: 'up' | 'down' }) => {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const offset = type === 'up' ? 2 : 0;
  const speed = type === 'up' ? 0.01 : -0.02;

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speedRandom = 0.01 + Math.random() / 200;
      const xFactor = -5 + Math.random() * 10;
      const yFactor = -2 + Math.random() * 10;
      const zFactor = -5 + Math.random() * 10;
      temp.push({ t, factor, speed: speedRandom, xFactor, yFactor, zFactor, mx: 0, my: 0 });
    }
    return temp;
  }, [count]);

  useFrame(() => {
    if (!mesh.current) return;
    particles.forEach((particle, i) => {
      let { t, factor, xFactor, yFactor, zFactor } = particle;
      t = particle.t += speed;
      const a = Math.cos(t) + Math.sin(t * 1) / 10;
      const b = Math.sin(t) + Math.cos(t * 2) / 10;
      let y = type === 'up' ? (t * 5) % 8 : 8 - ((Math.abs(t) * 5) % 8);
      dummy.position.set(
        xFactor,
        y - 1,
        zFactor
      );
      dummy.scale.setScalar(0.05 + Math.random() * 0.02);
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]} position={[0, offset, 0]}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial color={type === 'up' ? "#60a5fa" : "#3b82f6"} transparent opacity={0.6} />
    </instancedMesh>
  );
}

const Diorama = () => {
  const earthRadius = 5;
  const pacmanStart = Math.PI / 2;
  const pacmanLength = Math.PI * 1.5;

  const waterStart = 0.005;
  const waterLength = Math.PI / 2 - 0.01;
  const waterRadius = 4.98;

  return (
    <group>
      {/* Main Ground (Dirt) */}
      <mesh position={[0, -1.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[earthRadius, earthRadius, 3, 64, 1, false, pacmanStart, pacmanLength]} />
        <meshStandardMaterial color="#8B5A2B" />
      </mesh>

      {/* Grass Top */}
      <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[earthRadius, earthRadius, 0.1, 64, 1, false, pacmanStart, pacmanLength]} />
        <meshStandardMaterial color="#4ade80" />
      </mesh>

      {/* Sand base in the water slice */}
      <mesh position={[0, -1.9, 0]} receiveShadow>
        <cylinderGeometry args={[waterRadius, waterRadius, 2.2, 32, 1, false, waterStart, waterLength]} />
        <meshStandardMaterial color="#c2b280" />
      </mesh>
      
      {/* Water Body (Solid below surface) */}
      <mesh position={[0, -0.4, 0]} receiveShadow>
        <cylinderGeometry args={[waterRadius, waterRadius, 0.8, 32, 1, false, waterStart, waterLength]} />
        <meshStandardMaterial color="#0ea5e9" transparent opacity={0.6} />
      </mesh>

      {/* Animated Water Surface */}
      <mesh position={[0, 0.0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <ringGeometry args={[0, waterRadius, 32, 8, Math.PI * 1.5, waterLength]} />
        <MeshDistortMaterial color="#38bdf8" transparent opacity={0.8} distort={0.1} speed={2} />
      </mesh>

      {/* Aquarium Glass Curved Wall */}
      <mesh position={[0, -1.45, 0]}>
         <cylinderGeometry args={[5, 5, 3.1, 32, 1, true, 0, Math.PI / 2]} />
         <meshStandardMaterial color="#0284c7" transparent opacity={0.3} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>

      {/* Mountains */}
      <group position={[-2, 0.1, -2]}>
        <mesh castShadow receiveShadow position={[0, 1.5, 0]}>
          <coneGeometry args={[2, 3, 4]} /> // low poly mountain
          <meshStandardMaterial color="#166534" flatShading />
        </mesh>
        {/* Snow cap */}
        <mesh castShadow receiveShadow position={[0, 2.4, 0]}>
           <coneGeometry args={[0.85, 1.2, 4]} />
           <meshStandardMaterial color="#ffffff" flatShading />
        </mesh>
      </group>

      <group position={[-0.5, 0.1, -3]}>
        <mesh castShadow receiveShadow position={[0, 1, 0]}>
          <coneGeometry args={[1.5, 2, 4]} />
          <meshStandardMaterial color="#15803d" flatShading />
        </mesh>
        {/* Snow cap */}
        <mesh castShadow receiveShadow position={[0, 1.6, 0]}>
          <coneGeometry args={[0.65, 0.8, 4]} />
          <meshStandardMaterial color="#ffffff" flatShading />
        </mesh>
      </group>

      {/* Clouds */}
      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.5} position={[0, 6, 0]}>
        <mesh castShadow position={[-2, 0, -1]}>
          <boxGeometry args={[1.5, 1, 1.5]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
        <mesh castShadow position={[-1, -0.2, -1.5]}>
          <boxGeometry args={[1.2, 1, 1.2]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
        <mesh castShadow position={[2, 0.5, 1]}>
          <boxGeometry args={[2, 1.2, 2]} />
          <meshStandardMaterial color="#f0f9ff" />
        </mesh>
      </Float>

      {/* Factory (Wastewater / Pollution Source) */}
      <group position={[-2.5, 0.1, 2.5]}>
        <mesh castShadow receiveShadow position={[0, 0.5, 0]}>
          <boxGeometry args={[1, 1, 1.5]} />
          <meshStandardMaterial color="#6b7280" />
        </mesh>
        <mesh castShadow receiveShadow position={[-0.2, 1.2, -0.4]}>
          <cylinderGeometry args={[0.1, 0.1, 0.6]} />
          <meshStandardMaterial color="#9ca3af" />
        </mesh>
        <mesh castShadow receiveShadow position={[-0.2, 1.2, 0.4]}>
          <cylinderGeometry args={[0.1, 0.1, 0.6]} />
          <meshStandardMaterial color="#9ca3af" />
        </mesh>
        {/* Pollution pipe */}
        <mesh castShadow receiveShadow position={[0.7, 0.2, 0]} rotation={[0, 0, -Math.PI / 8]}>
          <cylinderGeometry args={[0.08, 0.08, 0.5]} />
          <meshStandardMaterial color="#4b5563" />
        </mesh>
        {/* Sludge / Pool */}
        <mesh position={[1.2, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
           <planeGeometry args={[0.8, 0.8]} />
           <meshStandardMaterial color="#84cc16" />
        </mesh>
      </group>
      
      {/* Trees */}
      {[
        [-4.2, -1.5], [-3.1, -3.8], [-1.2, -3.2], [-4.5, 1.2], 
        [-2.5, -0.6], [-0.5, 1.8], [1.5, -3.5], [3.2, -1.2]
      ].map(([x, z], i) => (
        <group key={i} position={[x, 0.1, z]}>
          <mesh castShadow position={[0, 0.2, 0]}>
             <cylinderGeometry args={[0.05, 0.05, 0.4]} />
             <meshStandardMaterial color="#78350f" />
          </mesh>
          <mesh castShadow position={[0, 0.6, 0]}>
             <coneGeometry args={[0.3, 0.8, 5]} />
             <meshStandardMaterial color="#22c55e" flatShading />
          </mesh>
        </group>
      ))}
    </group>
  );
};

export const WaterCycleScene = () => {
  const { setActiveHotspot } = useAppStore();

  return (
    <>
      <OrbitControls
        makeDefault
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2.1}
        enablePan={false}
        enableZoom={true}
        enableDamping
        autoRotate
        autoRotateSpeed={0.5}
      />
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow shadow-mapSize={[1024, 1024]} />
      
      <Environment preset="city" />

      <group onPointerMissed={() => setActiveHotspot(null)}>
        <Diorama />
        <Particles count={50} type="up" /> // Evaporation
        <Particles count={50} type="down" /> // Precipitation
        
        {HOTSPOTS.map((hotspot) => (
          <Hotspot key={hotspot.id} data={hotspot} />
        ))}
      </group>

      <ContactShadows position={[0, -3.1, 0]} opacity={0.6} scale={20} blur={2} far={4} />
    </>
  );
};

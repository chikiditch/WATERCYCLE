/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { WaterCycleScene } from './components/WaterCycleScene';
import { Overlay } from './components/Overlay';

export default function App() {
  return (
    <div className="w-screen h-screen bg-gradient-to-br from-sky-400 to-indigo-900 overflow-hidden relative">
      <Canvas shadows camera={{ position: [-8, 6, 8], fov: 45 }}>
        <Suspense fallback={null}>
          <WaterCycleScene />
        </Suspense>
      </Canvas>
      <Overlay />
    </div>
  );
}


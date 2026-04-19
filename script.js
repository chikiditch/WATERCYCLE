const HOTSPOTS = [
  // Natural Water Cycle
  { id: 'evaporation', title: 'Evaporation', category: 'Natural Water Cycle', description: "The sun heats surface water (oceans, lakes, rivers), turning liquid water into water vapor. Note: This acts as nature’s first purifier, as most impurities and dirt are left behind when water turns to gas.", position: [2.5, 2.5, 2.5], color: '#3b82f6' },
  { id: 'transpiration', title: 'Transpiration & Sublimation', category: 'Natural Water Cycle', description: "Plants release water vapor through their leaves (transpiration), and solid ice or snow turns directly into water vapor in cold climates (sublimation).", position: [-2.5, 2, -2.5], color: '#22c55e' },
  { id: 'condensation', title: 'Condensation', category: 'Natural Water Cycle', description: "As water vapor rises into the atmosphere, it cools and transforms back into liquid droplets, forming clouds and fog.", position: [-1, 6, -1], color: '#a8a29e' },
  { id: 'precipitation', title: 'Precipitation', category: 'Natural Water Cycle', description: "When clouds become too heavy, the water falls back to Earth as rain, snow, sleet, or hail.", position: [2, 4, -2], color: '#60a5fa' },
  { id: 'infiltration', title: 'Infiltration (Percolation)', category: 'Natural Water Cycle', description: "Water soaks deep into the soil and rocks, eventually becoming groundwater. The layers of soil, sand, and rock act as nature's second filter, naturally trapping many pollutants.", position: [-2, -1.5, -1], color: '#d97706' },
  { id: 'runoff', title: 'Runoff & Collection', category: 'Natural Water Cycle', description: "Water that does not soak into the ground flows over the surface into streams, rivers, lakes, and oceans, starting the cycle anew.", position: [0.5, 0.5, 0.5], color: '#06b6d4' },

  // Dirty Water
  { id: 'biological', title: 'Biological Contaminants', category: 'Dirty Water (Wastewater & Pollution)', description: "Pathogens like bacteria, viruses, parasites, and protozoa, primarily introduced by human sewage, agricultural animal waste, and decomposing organic matter.", position: [-2, 1, 1.5], color: '#ef4444' },
  { id: 'chemical', title: 'Chemical Pollutants', category: 'Dirty Water (Wastewater & Pollution)', description: [ "Dissolved toxins introduced by human activity. They include:", "• Heavy metals (lead, mercury, arsenic) from plumbing and mining.", "• Agricultural chemicals (fertilizers, pesticides, herbicides).", "• Industrial synthetic chemicals such as PFAS ('forever chemicals'), pharmaceuticals, and volatile organic compounds (VOCs)." ], position: [-3.5, 0.5, 3.5], color: '#f97316' },
  { id: 'physical', title: 'Physical Contaminants', category: 'Dirty Water (Wastewater & Pollution)', description: "Visible or suspended materials that affect the water's appearance and oxygen levels, including suspended soil/sediment (turbidity), oil and grease spills, plastic litter, and microplastics.", position: [3.5, 0, 3.5], color: '#84cc16' },

  // Interaction
  { id: 'runoff_pollution', title: 'Runoff Spreads Pollution', category: 'The Interaction: Handling Dirty Water', description: "Stormwater runoff acts as a powerful solvent, washing oil off city streets, agricultural fertilizers off farms, and raw sewage into lakes and rivers before it can be naturally filtered.", position: [-1, 0.5, 2], color: '#8b5cf6' },
  { id: 'evaporation_limits', title: 'Evaporation Can\'t Fix Everything', category: 'The Interaction: Handling Dirty Water', description: "While evaporation leaves behind dirt and heavy metals, some modern pollutants (like certain volatile chemicals) can evaporate into the atmosphere and come back down as polluted precipitation (acid rain or PFAS-laced rain).", position: [2.5, 4.5, 2.5], color: '#d946ef' },
  { id: 'artificial_treatment', title: 'The "Human" Water Cycle', category: 'The Interaction: Handling Dirty Water', description: "Because nature can no longer clean dirty water fast enough, humans have created an artificial step. We collect wastewater and send it to treatment plants for mechanical, biological, and chemical treatment before safely releasing it.", position: [-2.5, 2, 2.5], color: '#ec4899' }
];

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let activeHotspotId = null;

const hotspotsContainer = document.getElementById('hotspots-container');
const detailPanel = document.getElementById('detail-panel');
const closeBtn = document.getElementById('close-btn');

// --- SCENE SETUP ---
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x38bdf8, 0.02);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(-8, 6, 8);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.getElementById('canvas-container').appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.5;
controls.minPolarAngle = 0;
controls.maxPolarAngle = Math.PI / 2.1;

// --- LIGHTING ---
scene.add(new THREE.AmbientLight(0xffffff, 0.5));
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.5);
hemiLight.position.set(0, 10, 0);
scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
dirLight.position.set(10, 10, 5);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;
dirLight.shadow.camera.near = 0.5;
dirLight.shadow.camera.far = 25;
dirLight.shadow.camera.left = -10;
dirLight.shadow.camera.right = 10;
dirLight.shadow.camera.top = 10;
dirLight.shadow.camera.bottom = -10;
dirLight.shadow.bias = -0.0005;
scene.add(dirLight);

// --- DIORAMA ---
const dioramaGroup = new THREE.Group();
scene.add(dioramaGroup);

const earthRadius = 5;
const pacmanStart = Math.PI / 2;
const pacmanLength = Math.PI * 1.5;
const waterStart = 0.005;
const waterLength = Math.PI / 2 - 0.01;
const waterRadius = 4.98;

// Dirt Base
const dirt = new THREE.Mesh(
  new THREE.CylinderGeometry(earthRadius, earthRadius, 3, 64, 1, false, pacmanStart, pacmanLength),
  new THREE.MeshStandardMaterial({ color: 0x8B5A2B })
);
dirt.position.y = -1.5;
dirt.receiveShadow = true;
dirt.castShadow = true;
dioramaGroup.add(dirt);

// Grass Top
const grass = new THREE.Mesh(
  new THREE.CylinderGeometry(earthRadius, earthRadius, 0.1, 64, 1, false, pacmanStart, pacmanLength),
  new THREE.MeshStandardMaterial({ color: 0x4ade80 })
);
grass.position.y = 0.05;
grass.receiveShadow = true;
grass.castShadow = true;
dioramaGroup.add(grass);

// Sand base
const sand = new THREE.Mesh(
  new THREE.CylinderGeometry(waterRadius, waterRadius, 2.2, 32, 1, false, waterStart, waterLength),
  new THREE.MeshStandardMaterial({ color: 0xc2b280 })
);
sand.position.y = -1.9;
sand.receiveShadow = true;
dioramaGroup.add(sand);

// Water solid
const waterSolid = new THREE.Mesh(
  new THREE.CylinderGeometry(waterRadius, waterRadius, 0.8, 32, 1, false, waterStart, waterLength),
  new THREE.MeshStandardMaterial({ color: 0x0ea5e9, transparent: true, opacity: 0.6 })
);
waterSolid.position.y = -0.4;
waterSolid.receiveShadow = true;
dioramaGroup.add(waterSolid);

// Animated Water Surface
const waterSurface = new THREE.Mesh(
  new THREE.RingGeometry(0, waterRadius, 48, 8, Math.PI * 1.5, waterLength),
  new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.8, side: THREE.DoubleSide })
);
waterSurface.rotation.x = -Math.PI / 2;
waterSurface.receiveShadow = true;
dioramaGroup.add(waterSurface);

// Save initial geometry vertices for water animation
const waterPosAttr = waterSurface.geometry.attributes.position;
const waterBaseZ = [];
for(let i=0; i<waterPosAttr.count; i++) {
   waterBaseZ.push(waterPosAttr.getZ(i));
}

// Aquarium Glass
const glass = new THREE.Mesh(
  new THREE.CylinderGeometry(5, 5, 3.1, 32, 1, true, 0, Math.PI / 2),
  new THREE.MeshStandardMaterial({ color: 0x0284c7, transparent: true, opacity: 0.3, side: THREE.DoubleSide, depthWrite: false })
);
glass.position.y = -1.45;
dioramaGroup.add(glass);

// Mountains
const createMountainGroup = (x, z, h1, h2) => {
    const group = new THREE.Group();
    group.position.set(x, 0.1, z);
    
    // mountain
    const mtn = new THREE.Mesh(
       new THREE.ConeGeometry(h1.r, h1.h, h1.s || 4),
       new THREE.MeshStandardMaterial({ color: 0x166534, flatShading: true })
    );
    mtn.position.y = h1.h / 2;
    mtn.castShadow = true;
    mtn.receiveShadow = true;
    group.add(mtn);

    // snow
    const snow = new THREE.Mesh(
        new THREE.ConeGeometry(h2.r, h2.h, h2.s || 4),
        new THREE.MeshStandardMaterial({ color: 0xffffff, flatShading: true })
    );
    snow.position.y = h1.h - (h2.h / 2);
    snow.castShadow = true;
    snow.receiveShadow = true;
    group.add(snow);

    return group;
}
dioramaGroup.add(createMountainGroup(-2, -2, {r:2, h:3}, {r:0.85, h:1.2}));
dioramaGroup.add(createMountainGroup(-0.5, -3, {r:1.5, h:2}, {r:0.65, h:0.8}));

// Clouds
const cloudsGroup = new THREE.Group();
cloudsGroup.position.set(0, 6, 0);
dioramaGroup.add(cloudsGroup);

const cloudMats = new THREE.MeshStandardMaterial({ color: 0xf8fafc, flatShading: true });
const c1 = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1, 1.5), cloudMats);
c1.position.set(-2, 0, -1);
c1.castShadow = true;
cloudsGroup.add(c1);

const c2 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1, 1.2), cloudMats);
c2.position.set(-1, -0.2, -1.5);
c2.castShadow = true;
cloudsGroup.add(c2);

const c3 = new THREE.Mesh(new THREE.BoxGeometry(2, 1.2, 2), cloudMats);
c3.position.set(2, 0.5, 1);
c3.castShadow = true;
cloudsGroup.add(c3);

// Factory
const factoryGroup = new THREE.Group();
factoryGroup.position.set(-2.5, 0.1, 2.5);
dioramaGroup.add(factoryGroup);

const fMain = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1.5), new THREE.MeshStandardMaterial({color: 0x6b7280}));
fMain.position.y = 0.5;
fMain.castShadow = true; fMain.receiveShadow = true;
factoryGroup.add(fMain);

const fChimneyMat = new THREE.MeshStandardMaterial({color: 0x9ca3af});
const pipe1 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.6), fChimneyMat);
pipe1.position.set(-0.2, 1.2, -0.4);
pipe1.castShadow = true; pipe1.receiveShadow = true;
factoryGroup.add(pipe1);

const pipe2 = pipe1.clone();
pipe2.position.set(-0.2, 1.2, 0.4);
factoryGroup.add(pipe2);

const pollutionPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.5), new THREE.MeshStandardMaterial({color: 0x4b5563}));
pollutionPipe.position.set(0.7, 0.2, 0);
pollutionPipe.rotation.z = -Math.PI / 8;
pollutionPipe.castShadow = true; pollutionPipe.receiveShadow = true;
factoryGroup.add(pollutionPipe);

const sludge = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.8), new THREE.MeshStandardMaterial({color: 0x84cc16}));
sludge.position.set(1.2, -0.05, 0); // slightly above grass 0.05 height, wait grass is inside group relative.
sludge.rotation.x = -Math.PI / 2;
factoryGroup.add(sludge);

// Trees
const treesCoords = [
  [-4.2, -1.5], [-3.1, -3.8], [-1.2, -3.2], [-4.5, 1.2], 
  [-2.5, -0.6], [-0.5, 1.8], [1.5, -3.5], [3.2, -1.2]
];
treesCoords.forEach(([x, z]) => {
  const tGroup = new THREE.Group();
  tGroup.position.set(x, 0.1, z);
  
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.4), new THREE.MeshStandardMaterial({color: 0x78350f}));
  trunk.position.y = 0.2;
  trunk.castShadow = true;
  tGroup.add(trunk);

  const leaves = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.8, 5), new THREE.MeshStandardMaterial({color: 0x22c55e, flatShading: true}));
  leaves.position.y = 0.6;
  leaves.castShadow = true;
  tGroup.add(leaves);

  dioramaGroup.add(tGroup);
});

// Particles
function createInstancedParticles(count, color, type) {
  const geo = new THREE.SphereGeometry(0.08, 8, 8);
  const mat = new THREE.MeshStandardMaterial({ color: color, transparent: true, opacity: 0.6 });
  const mesh = new THREE.InstancedMesh(geo, mat, count);
  mesh.frustumCulled = false;
  
  const particles = [];
  for(let i=0; i < count; i++) {
      particles.push({
          t: Math.random() * 100,
          speed: (type === 'up' ? 0.01 : -0.02) + (Math.random() - 0.5) * 0.005,
          xFactor: -5 + Math.random() * 10,
          zFactor: -5 + Math.random() * 10,
      });
  }
  return { mesh, particles, type, dummy: new THREE.Object3D() };
}
const evap = createInstancedParticles(50, 0x60a5fa, 'up');
const precip = createInstancedParticles(50, 0x3b82f6, 'down');
evap.mesh.position.y = 2;
dioramaGroup.add(evap.mesh);
dioramaGroup.add(precip.mesh);

// --- HOTSPOTS DOM ---
const markers = [];
HOTSPOTS.forEach(hotspot => {
    const el = document.createElement('div');
    el.className = 'hotspot-marker';
    el.style.backgroundColor = hotspot.color;
    el.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
    
    const label = document.createElement('div');
    label.className = 'hotspot-label';
    label.textContent = hotspot.title;
    el.appendChild(label);

    el.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        if (activeHotspotId === hotspot.id) {
            closePanel();
        } else {
            openPanel(hotspot);
        }
    });

    hotspotsContainer.appendChild(el);
    
    markers.push({
        data: hotspot,
        element: el,
        vec3: new THREE.Vector3(...hotspot.position)
    });
});

closeBtn.addEventListener('click', closePanel);
controls.addEventListener('start', closePanel);

function openPanel(hotspot) {
    activeHotspotId = hotspot.id;
    markers.forEach(m => {
        if (m.data.id === activeHotspotId) m.element.classList.add('active');
        else m.element.classList.remove('active');
    });

    document.getElementById('panel-color-bar').style.backgroundColor = hotspot.color;
    document.getElementById('panel-category').textContent = hotspot.category;
    document.getElementById('panel-title').textContent = hotspot.title;
    
    const descContainer = document.getElementById('panel-description');
    descContainer.innerHTML = '';
    const blocks = Array.isArray(hotspot.description) ? hotspot.description : [hotspot.description];
    blocks.forEach(text => {
        const p = document.createElement('p');
        p.textContent = text;
        p.style.margin = "0";
        descContainer.appendChild(p);
    });

    detailPanel.classList.remove('hidden');
}

function closePanel() {
    activeHotspotId = null;
    markers.forEach(m => m.element.classList.remove('active'));
    detailPanel.classList.add('hidden');
}

// --- ANIMATION LOOP ---
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const time = clock.getElapsedTime();
    
    controls.update();
    
    // Distort Water
    for(let i=0; i<waterPosAttr.count; i++) {
       const u = waterPosAttr.getX(i);
       const v = waterPosAttr.getY(i);
       const noise = Math.sin(u * 2 + time * 2) * Math.cos(v * 2 + time * 2) * 0.1;
       waterPosAttr.setZ(i, waterBaseZ[i] + noise);
    }
    waterPosAttr.needsUpdate = true;

    // Floating Clouds
    cloudsGroup.position.y = 6 + Math.sin(time) * 0.2;
    cloudsGroup.rotation.x = Math.sin(time * 0.5) * 0.05;
    cloudsGroup.rotation.z = Math.cos(time * 0.3) * 0.05;

    // Particles
    [evap, precip].forEach(sys => {
        sys.particles.forEach((p, i) => {
            p.t += sys.speed;
            let y = sys.type === 'up' ? (Math.abs(p.t) * 5) % 8 : 8 - ((Math.abs(p.t) * 5) % 8);
            sys.dummy.position.set(
              p.xFactor + Math.sin(p.t + i) * 0.2, 
              y - 1, 
              p.zFactor + Math.cos(p.t + i) * 0.2
            );
            sys.dummy.scale.setScalar(0.05 + ((i%10)/100));
            sys.dummy.updateMatrix();
            sys.mesh.setMatrixAt(i, sys.dummy.matrix);
        });
        sys.mesh.instanceMatrix.needsUpdate = true;
    });

    // Update markers screen pos
    const widthHalf = window.innerWidth / 2;
    const heightHalf = window.innerHeight / 2;

    markers.forEach(marker => {
        const pos = marker.vec3.clone();
        pos.project(camera);

        if (pos.z > 1) {
            marker.element.style.display = 'none';
        } else {
            marker.element.style.display = 'flex';
            const x = (pos.x * widthHalf) + widthHalf;
            const y = -(pos.y * heightHalf) + heightHalf;
            marker.element.style.left = `${x}px`;
            marker.element.style.top = `${y}px`;
        }
    });

    renderer.render(scene, camera);
}

// Handle resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();

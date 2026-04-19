import { create } from 'zustand';

type HotspotData = {
  id: string;
  title: string;
  category: string;
  description: string | string[];
  position: [number, number, number];
  color: string;
};

export const HOTSPOTS: HotspotData[] = [
  // Natural Water Cycle
  {
    id: 'evaporation',
    title: 'Evaporation',
    category: 'Natural Water Cycle',
    description: "The sun heats surface water (oceans, lakes, rivers), turning liquid water into water vapor. Note: This acts as nature’s first purifier, as most impurities and dirt are left behind when water turns to gas.",
    position: [2.5, 2.5, 2.5],
    color: '#3b82f6' // blue
  },
  {
    id: 'transpiration',
    title: 'Transpiration & Sublimation',
    category: 'Natural Water Cycle',
    description: "Plants release water vapor through their leaves (transpiration), and solid ice or snow turns directly into water vapor in cold climates (sublimation).",
    position: [-2.5, 2, -2.5],
    color: '#22c55e' // green
  },
  {
    id: 'condensation',
    title: 'Condensation',
    category: 'Natural Water Cycle',
    description: "As water vapor rises into the atmosphere, it cools and transforms back into liquid droplets, forming clouds and fog.",
    position: [-1, 6, -1],
    color: '#a8a29e' // gray
  },
  {
    id: 'precipitation',
    title: 'Precipitation',
    category: 'Natural Water Cycle',
    description: "When clouds become too heavy, the water falls back to Earth as rain, snow, sleet, or hail.",
    position: [2, 4, -2],
    color: '#60a5fa' // blue light
  },
  {
    id: 'infiltration',
    title: 'Infiltration (Percolation)',
    category: 'Natural Water Cycle',
    description: "Water soaks deep into the soil and rocks, eventually becoming groundwater. The layers of soil, sand, and rock act as nature's second filter, naturally trapping many pollutants.",
    position: [-2, -1.5, -1],
    color: '#d97706' // amber
  },
  {
    id: 'runoff',
    title: 'Runoff & Collection',
    category: 'Natural Water Cycle',
    description: "Water that does not soak into the ground flows over the surface into streams, rivers, lakes, and oceans, starting the cycle anew.",
    position: [0.5, 0.5, 0.5],
    color: '#06b6d4' // cyan
  },

  // Dirty Water
  {
    id: 'biological',
    title: 'Biological Contaminants',
    category: 'Dirty Water (Wastewater & Pollution)',
    description: "Pathogens like bacteria, viruses, parasites, and protozoa, primarily introduced by human sewage, agricultural animal waste, and decomposing organic matter.",
    position: [-2, 1, 1.5],
    color: '#ef4444' // red
  },
  {
    id: 'chemical',
    title: 'Chemical Pollutants',
    category: 'Dirty Water (Wastewater & Pollution)',
    description: [
      "Dissolved toxins introduced by human activity. They include:",
      "• Heavy metals (lead, mercury, arsenic) from plumbing and mining.",
      "• Agricultural chemicals (fertilizers, pesticides, herbicides).",
      "• Industrial synthetic chemicals such as PFAS ('forever chemicals'), pharmaceuticals, and volatile organic compounds (VOCs)."
    ],
    position: [-3.5, 0.5, 3.5],
    color: '#f97316' // orange
  },
  {
    id: 'physical',
    title: 'Physical Contaminants',
    category: 'Dirty Water (Wastewater & Pollution)',
    description: "Visible or suspended materials that affect the water's appearance and oxygen levels, including suspended soil/sediment (turbidity), oil and grease spills, plastic litter, and microplastics.",
    position: [3.5, 0, 3.5],
    color: '#84cc16' // lime
  },

  // Interaction
  {
    id: 'runoff_pollution',
    title: 'Runoff Spreads Pollution',
    category: 'The Interaction: Handling Dirty Water',
    description: "Stormwater runoff acts as a powerful solvent, washing oil off city streets, agricultural fertilizers off farms, and raw sewage into lakes and rivers before it can be naturally filtered.",
    position: [-1, 0.5, 2],
    color: '#8b5cf6' // violet
  },
  {
    id: 'evaporation_limits',
    title: 'Evaporation Can\'t Fix Everything',
    category: 'The Interaction: Handling Dirty Water',
    description: "While evaporation leaves behind dirt and heavy metals, some modern pollutants (like certain volatile chemicals) can evaporate into the atmosphere and come back down as polluted precipitation (acid rain or PFAS-laced rain).",
    position: [2.5, 4.5, 2.5],
    color: '#d946ef' // fuchsia
  },
  {
    id: 'artificial_treatment',
    title: 'The "Human" Water Cycle',
    category: 'The Interaction: Handling Dirty Water',
    description: "Because nature can no longer clean dirty water fast enough, humans have created an artificial step. We collect wastewater and send it to treatment plants for mechanical, biological, and chemical treatment before safely releasing it.",
    position: [-2.5, 2, 2.5],
    color: '#ec4899' // pink
  }
];

interface AppState {
  activeHotspot: string | null;
  setActiveHotspot: (id: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeHotspot: null,
  setActiveHotspot: (id) => set({ activeHotspot: id }),
}));

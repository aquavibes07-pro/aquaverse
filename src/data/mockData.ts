export type SpeciesCategory = 'fish' | 'plant' | 'invertebrate';
export type Difficulty = 'beginner' | 'intermediate' | 'expert';
export type Temperament = 'peaceful' | 'semi-aggressive' | 'aggressive';
export type WaterType = 'freshwater' | 'saltwater' | 'brackish';

export interface Species {
  id: string;
  commonName: string;
  scientificName: string;
  category: SpeciesCategory;
  difficulty: Difficulty;
  minTankSize: number; // in gallons
  temperament?: Temperament; // optional for plants
  origin: string;
  colors: string[];
  waterType: WaterType;
  phMin: number;
  phMax: number;
  tempMin: number; // in Celsius
  tempMax: number; // in Celsius
  description: string;
  care: string;
  compatibility: string[]; // array of species IDs
  imageUrl: string;
  featured: boolean;
}

export const mockSpecies: Species[] = [
  // --- FISH ---
  {
    id: "f1",
    commonName: "Betta Fish",
    scientificName: "Betta splendens",
    category: "fish",
    difficulty: "beginner",
    minTankSize: 5,
    temperament: "aggressive",
    origin: "Southeast Asia",
    colors: ["Red", "Blue", "Purple", "White"],
    waterType: "freshwater",
    phMin: 6.5,
    phMax: 7.5,
    tempMin: 24,
    tempMax: 28,
    description: "The Siamese fighting fish, commonly known as the betta, is a popular fish in the aquarium trade. Bettas are well known for being highly territorial.",
    care: "Requires a heater and gentle filtration. Males cannot be kept together. Can be kept with peaceful bottom dwellers like Corydoras in larger tanks.",
    compatibility: ["i3"],
    imageUrl: "https://images.unsplash.com/photo-1534433621453-9118744f47ed?auto=format&fit=crop&w=800&q=80",
    featured: true
  },
  {
    id: "f2",
    commonName: "Neon Tetra",
    scientificName: "Paracheirodon innesi",
    category: "fish",
    difficulty: "beginner",
    minTankSize: 10,
    temperament: "peaceful",
    origin: "South America",
    colors: ["Blue", "Red", "Silver"],
    waterType: "freshwater",
    phMin: 6.0,
    phMax: 7.0,
    tempMin: 21,
    tempMax: 27,
    description: "The neon tetra is a freshwater fish of the characin family. It is widely known for its bright, iridescent colors, which make it highly visible in dark water.",
    care: "Best kept in schools of 6 or more. Prefer densely planted tanks with subdued lighting.",
    compatibility: ["f4", "i1", "i3"],
    imageUrl: "https://images.unsplash.com/photo-1543888362-e6b75ff6c3e9?auto=format&fit=crop&w=800&q=80",
    featured: true
  },
  {
    id: "f3",
    commonName: "Discus",
    scientificName: "Symphysodon discus",
    category: "fish",
    difficulty: "expert",
    minTankSize: 55,
    temperament: "peaceful",
    origin: "Amazon River Basin",
    colors: ["Red", "Blue", "Yellow", "Orange", "Turquoise"],
    waterType: "freshwater",
    phMin: 6.0,
    phMax: 6.5,
    tempMin: 28,
    tempMax: 30,
    description: "Discus are highly prized freshwater aquarium fish due to their distinctive shape and bright colors. They require pristine water conditions.",
    care: "Needs very clean, warm, soft, and slightly acidic water. Frequent water changes are mandatory.",
    compatibility: ["f2", "f4"],
    imageUrl: "https://images.unsplash.com/photo-1524704796725-9fc3044a58b2?auto=format&fit=crop&w=800&q=80",
    featured: false
  },
  {
    id: "f4",
    commonName: "Corydoras Catfish",
    scientificName: "Corydoras spp.",
    category: "fish",
    difficulty: "beginner",
    minTankSize: 20,
    temperament: "peaceful",
    origin: "South America",
    colors: ["Bronze", "Albino", "Peppered"],
    waterType: "freshwater",
    phMin: 6.0,
    phMax: 7.5,
    tempMin: 22,
    tempMax: 26,
    description: "Corydoras are peaceful, bottom-dwelling catfish that are active and entertaining. They help keep the substrate clean by scavenging for uneaten food.",
    care: "Must be kept in groups of 5+. Sand substrate is highly recommended to protect their delicate barbels.",
    compatibility: ["f1", "f2", "f3", "f5"],
    imageUrl: "https://images.unsplash.com/photo-1582845512747-e42001c95638?auto=format&fit=crop&w=800&q=80", // Using a general fish image placeholder
    featured: false
  },
  {
    id: "f5",
    commonName: "Angelfish",
    scientificName: "Pterophyllum scalare",
    category: "fish",
    difficulty: "intermediate",
    minTankSize: 55,
    temperament: "semi-aggressive",
    origin: "South America",
    colors: ["Silver", "Black", "Marble", "Gold"],
    waterType: "freshwater",
    phMin: 6.5,
    phMax: 7.5,
    tempMin: 24,
    tempMax: 28,
    description: "Angelfish are graceful, laterally compressed cichlids. They are generally peaceful but can become territorial during breeding or towards very small fish.",
    care: "Require tall tanks due to their vertical growth. May eat very small fish like neon tetras when fully grown.",
    compatibility: ["f4"],
    imageUrl: "https://images.unsplash.com/photo-1544607736-23940c3453b5?auto=format&fit=crop&w=800&q=80", // Alternative fish image
    featured: true
  },

  // --- PLANTS ---
  {
    id: "p1",
    commonName: "Java Fern",
    scientificName: "Microsorum pteropus",
    category: "plant",
    difficulty: "beginner",
    minTankSize: 5,
    origin: "Southeast Asia",
    colors: ["Green"],
    waterType: "freshwater",
    phMin: 6.0,
    phMax: 7.5,
    tempMin: 20,
    tempMax: 28,
    description: "Java Fern is one of the most popular and hardy aquarium plants. It has thick, leathery leaves and is very adaptable to different water conditions.",
    care: "Rhizome must not be buried in substrate; best attached to wood or rocks. Low to medium light.",
    compatibility: [],
    imageUrl: "https://images.unsplash.com/photo-1623869687002-c923d3ba928a?auto=format&fit=crop&w=800&q=80",
    featured: true
  },
  {
    id: "p2",
    commonName: "Amazon Sword",
    scientificName: "Echinodorus grisebachii",
    category: "plant",
    difficulty: "beginner",
    minTankSize: 20,
    origin: "South America",
    colors: ["Green"],
    waterType: "freshwater",
    phMin: 6.5,
    phMax: 7.5,
    tempMin: 22,
    tempMax: 28,
    description: "A classic background plant with large, broad leaves. It grows quite large and provides excellent coverage and hiding spots for fish.",
    care: "Heavy root feeder; requires nutrient-rich substrate or root tabs. Medium lighting.",
    compatibility: [],
    imageUrl: "https://images.unsplash.com/photo-1594968132049-36104f7c10b0?auto=format&fit=crop&w=800&q=80", // nature aquarium look
    featured: false
  },
  {
    id: "p3",
    commonName: "Java Moss",
    scientificName: "Taxiphyllum barbieri",
    category: "plant",
    difficulty: "beginner",
    minTankSize: 1,
    origin: "Southeast Asia",
    colors: ["Green"],
    waterType: "freshwater",
    phMin: 5.0,
    phMax: 8.0,
    tempMin: 15,
    tempMax: 28,
    description: "A very versatile moss that provides great shelter for fry and shrimp. Can be attached to almost any surface in the aquarium.",
    care: "Extremely low maintenance. Grows in low light. Can be trimmed to maintain shape.",
    compatibility: [],
    imageUrl: "https://images.unsplash.com/photo-1542408993-2708304910eb?auto=format&fit=crop&w=800&q=80",
    featured: true
  },

  // --- INVERTEBRATES ---
  {
    id: "i1",
    commonName: "Cherry Shrimp",
    scientificName: "Neocaridina davidi",
    category: "invertebrate",
    difficulty: "beginner",
    minTankSize: 5,
    temperament: "peaceful",
    origin: "Taiwan",
    colors: ["Red", "Blue", "Yellow", "Orange", "Green", "Black"],
    waterType: "freshwater",
    phMin: 6.5,
    phMax: 8.0,
    tempMin: 18,
    tempMax: 28,
    description: "Dwarf freshwater shrimp that are excellent scavengers. They are highly active and breed readily in the home aquarium.",
    care: "Keep in mature tanks with biofilm. Vulnerable to predation; keep with peaceful nano fish or in a species-only tank. Sensitive to copper.",
    compatibility: ["f2", "f4", "i3"],
    imageUrl: "https://images.unsplash.com/photo-1628156172605-ff0d8299dd6c?auto=format&fit=crop&w=800&q=80", // macro aquatic
    featured: true
  },
  {
    id: "i2",
    commonName: "Amano Shrimp",
    scientificName: "Caridina multidentata",
    category: "invertebrate",
    difficulty: "beginner",
    minTankSize: 10,
    temperament: "peaceful",
    origin: "Japan",
    colors: ["Translucent", "Brown speckles"],
    waterType: "freshwater",
    phMin: 6.5,
    phMax: 7.5,
    tempMin: 20,
    tempMax: 27,
    description: "One of the best algae-eating invertebrates available. Named after Takashi Amano, who popularized their use in planted aquariums.",
    care: "Excellent at eating hair algae. Will easily jump out of open tanks; tight-fitting lid recommended. Do not breed in freshwater.",
    compatibility: ["f1", "f2", "f4", "i3"],
    imageUrl: "https://images.unsplash.com/photo-1583095392070-df83eb2fb351?auto=format&fit=crop&w=800&q=80",
    featured: false
  },
  {
    id: "i3",
    commonName: "Nerite Snail",
    scientificName: "Neritina natalensis",
    category: "invertebrate",
    difficulty: "beginner",
    minTankSize: 5,
    temperament: "peaceful",
    origin: "Africa",
    colors: ["Zebra stripes", "Olive", "Horned"],
    waterType: "freshwater",
    phMin: 7.0,
    phMax: 8.5,
    tempMin: 22,
    tempMax: 28,
    description: "Fantastic algae eaters that will not consume healthy plants. They are extremely peaceful and have beautiful shell patterns.",
    care: "Needs calcium for shell health (higher pH). Leaves small white sesame-seed-like eggs around the tank that will not hatch in freshwater.",
    compatibility: ["f1", "f2", "f4", "i1", "i2"],
    imageUrl: "https://images.unsplash.com/photo-1549429107-16d7a46cb1e8?auto=format&fit=crop&w=800&q=80", // underwater macro
    featured: true
  }
];

export const getFeaturedSpecies = () => mockSpecies.filter(s => s.featured);
export const getSpeciesByCategory = (category: SpeciesCategory) => mockSpecies.filter(s => s.category === category);
export const getSpeciesById = (id: string) => mockSpecies.find(s => s.id === id);

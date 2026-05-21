-- Create Species table
CREATE TABLE public.species (
  id TEXT PRIMARY KEY,
  common_name TEXT NOT NULL,
  scientific_name TEXT NOT NULL,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  min_tank_size INTEGER NOT NULL,
  temperament TEXT,
  origin TEXT NOT NULL,
  colors TEXT[] NOT NULL,
  water_type TEXT NOT NULL,
  ph_min NUMERIC NOT NULL,
  ph_max NUMERIC NOT NULL,
  temp_min NUMERIC NOT NULL,
  temp_max NUMERIC NOT NULL,
  description TEXT NOT NULL,
  care TEXT NOT NULL,
  compatibility TEXT[] NOT NULL,
  image_url TEXT NOT NULL,
  featured BOOLEAN NOT NULL DEFAULT false
);

-- Create Wishlist table
CREATE TABLE public.wishlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  species_id TEXT NOT NULL REFERENCES public.species(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, species_id)
);

-- Enable RLS
ALTER TABLE public.species ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

-- Policies for Species (everyone can read, only service role can write)
CREATE POLICY "Species are viewable by everyone" 
ON public.species FOR SELECT 
USING (true);

-- Policies for Wishlists (users can only CRUD their own wishlists)
CREATE POLICY "Users can view their own wishlists"
ON public.wishlists FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own wishlists"
ON public.wishlists FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own wishlists"
ON public.wishlists FOR DELETE
USING (auth.uid() = user_id);

-- Insert Mock Data
INSERT INTO public.species (id, common_name, scientific_name, category, difficulty, min_tank_size, temperament, origin, colors, water_type, ph_min, ph_max, temp_min, temp_max, description, care, compatibility, image_url, featured) VALUES
('f1', 'Betta Fish', 'Betta splendens', 'fish', 'beginner', 5, 'aggressive', 'Southeast Asia', ARRAY['Red', 'Blue', 'Purple', 'White'], 'freshwater', 6.5, 7.5, 24, 28, 'The Siamese fighting fish, commonly known as the betta, is a popular fish in the aquarium trade. Bettas are well known for being highly territorial.', 'Requires a heater and gentle filtration. Males cannot be kept together. Can be kept with peaceful bottom dwellers like Corydoras in larger tanks.', ARRAY['i3'], 'https://images.unsplash.com/photo-1534433621453-9118744f47ed?auto=format&fit=crop&w=800&q=80', true),
('f2', 'Neon Tetra', 'Paracheirodon innesi', 'fish', 'beginner', 10, 'peaceful', 'South America', ARRAY['Blue', 'Red', 'Silver'], 'freshwater', 6.0, 7.0, 21, 27, 'The neon tetra is a freshwater fish of the characin family. It is widely known for its bright, iridescent colors, which make it highly visible in dark water.', 'Best kept in schools of 6 or more. Prefer densely planted tanks with subdued lighting.', ARRAY['f4', 'i1', 'i3'], 'https://images.unsplash.com/photo-1543888362-e6b75ff6c3e9?auto=format&fit=crop&w=800&q=80', true),
('f3', 'Discus', 'Symphysodon discus', 'fish', 'expert', 55, 'peaceful', 'Amazon River Basin', ARRAY['Red', 'Blue', 'Yellow', 'Orange', 'Turquoise'], 'freshwater', 6.0, 6.5, 28, 30, 'Discus are highly prized freshwater aquarium fish due to their distinctive shape and bright colors. They require pristine water conditions.', 'Needs very clean, warm, soft, and slightly acidic water. Frequent water changes are mandatory.', ARRAY['f2', 'f4'], 'https://images.unsplash.com/photo-1524704796725-9fc3044a58b2?auto=format&fit=crop&w=800&q=80', false),
('f4', 'Corydoras Catfish', 'Corydoras spp.', 'fish', 'beginner', 20, 'peaceful', 'South America', ARRAY['Bronze', 'Albino', 'Peppered'], 'freshwater', 6.0, 7.5, 22, 26, 'Corydoras are peaceful, bottom-dwelling catfish that are active and entertaining. They help keep the substrate clean by scavenging for uneaten food.', 'Must be kept in groups of 5+. Sand substrate is highly recommended to protect their delicate barbels.', ARRAY['f1', 'f2', 'f3', 'f5'], 'https://images.unsplash.com/photo-1582845512747-e42001c95638?auto=format&fit=crop&w=800&q=80', false),
('f5', 'Angelfish', 'Pterophyllum scalare', 'fish', 'intermediate', 55, 'semi-aggressive', 'South America', ARRAY['Silver', 'Black', 'Marble', 'Gold'], 'freshwater', 6.5, 7.5, 24, 28, 'Angelfish are graceful, laterally compressed cichlids. They are generally peaceful but can become territorial during breeding or towards very small fish.', 'Require tall tanks due to their vertical growth. May eat very small fish like neon tetras when fully grown.', ARRAY['f4'], 'https://images.unsplash.com/photo-1544607736-23940c3453b5?auto=format&fit=crop&w=800&q=80', true),
('p1', 'Java Fern', 'Microsorum pteropus', 'plant', 'beginner', 5, null, 'Southeast Asia', ARRAY['Green'], 'freshwater', 6.0, 7.5, 20, 28, 'Java Fern is one of the most popular and hardy aquarium plants. It has thick, leathery leaves and is very adaptable to different water conditions.', 'Rhizome must not be buried in substrate; best attached to wood or rocks. Low to medium light.', ARRAY[]::TEXT[], 'https://images.unsplash.com/photo-1623869687002-c923d3ba928a?auto=format&fit=crop&w=800&q=80', true),
('p2', 'Amazon Sword', 'Echinodorus grisebachii', 'plant', 'beginner', 20, null, 'South America', ARRAY['Green'], 'freshwater', 6.5, 7.5, 22, 28, 'A classic background plant with large, broad leaves. It grows quite large and provides excellent coverage and hiding spots for fish.', 'Heavy root feeder; requires nutrient-rich substrate or root tabs. Medium lighting.', ARRAY[]::TEXT[], 'https://images.unsplash.com/photo-1594968132049-36104f7c10b0?auto=format&fit=crop&w=800&q=80', false),
('p3', 'Java Moss', 'Taxiphyllum barbieri', 'plant', 'beginner', 1, null, 'Southeast Asia', ARRAY['Green'], 'freshwater', 5.0, 8.0, 15, 28, 'A very versatile moss that provides great shelter for fry and shrimp. Can be attached to almost any surface in the aquarium.', 'Extremely low maintenance. Grows in low light. Can be trimmed to maintain shape.', ARRAY[]::TEXT[], 'https://images.unsplash.com/photo-1542408993-2708304910eb?auto=format&fit=crop&w=800&q=80', true),
('i1', 'Cherry Shrimp', 'Neocaridina davidi', 'invertebrate', 'beginner', 5, 'peaceful', 'Taiwan', ARRAY['Red', 'Blue', 'Yellow', 'Orange', 'Green', 'Black'], 'freshwater', 6.5, 8.0, 18, 28, 'Dwarf freshwater shrimp that are excellent scavengers. They are highly active and breed readily in the home aquarium.', 'Keep in mature tanks with biofilm. Vulnerable to predation; keep with peaceful nano fish or in a species-only tank. Sensitive to copper.', ARRAY['f2', 'f4', 'i3'], 'https://images.unsplash.com/photo-1628156172605-ff0d8299dd6c?auto=format&fit=crop&w=800&q=80', true),
('i2', 'Amano Shrimp', 'Caridina multidentata', 'invertebrate', 'beginner', 10, 'peaceful', 'Japan', ARRAY['Translucent', 'Brown speckles'], 'freshwater', 6.5, 7.5, 20, 27, 'One of the best algae-eating invertebrates available. Named after Takashi Amano, who popularized their use in planted aquariums.', 'Excellent at eating hair algae. Will easily jump out of open tanks; tight-fitting lid recommended. Do not breed in freshwater.', ARRAY['f1', 'f2', 'f4', 'i3'], 'https://images.unsplash.com/photo-1583095392070-df83eb2fb351?auto=format&fit=crop&w=800&q=80', false),
('i3', 'Nerite Snail', 'Neritina natalensis', 'invertebrate', 'beginner', 5, 'peaceful', 'Africa', ARRAY['Zebra stripes', 'Olive', 'Horned'], 'freshwater', 7.0, 8.5, 22, 28, 'Fantastic algae eaters that will not consume healthy plants. They are extremely peaceful and have beautiful shell patterns.', 'Needs calcium for shell health (higher pH). Leaves small white sesame-seed-like eggs around the tank that will not hatch in freshwater.', ARRAY['f1', 'f2', 'f4', 'i1', 'i2'], 'https://images.unsplash.com/photo-1549429107-16d7a46cb1e8?auto=format&fit=crop&w=800&q=80', true);

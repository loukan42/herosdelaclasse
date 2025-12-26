// Avatar images
import fille1 from '@/assets/avatars/fille_1.png';
import fille2 from '@/assets/avatars/fille_2.png';
import fille3 from '@/assets/avatars/fille_3.png';
import fille4 from '@/assets/avatars/fille_4.png';
import fille5 from '@/assets/avatars/fille_5.png';
import fille6 from '@/assets/avatars/fille_6.png';
import fille7 from '@/assets/avatars/fille_7.png';
import garcon1 from '@/assets/avatars/garcon_1.png';
import garcon2 from '@/assets/avatars/garcon_2.png';
import garcon3 from '@/assets/avatars/garcon_3.png';
import garcon4 from '@/assets/avatars/garcon_4.png';
import garcon5 from '@/assets/avatars/garcon_5.png';
import garcon6 from '@/assets/avatars/garcon_6.png';
import garcon7 from '@/assets/avatars/garcon_7.png';
import garcon8 from '@/assets/avatars/garcon_8.png';
import prince1 from '@/assets/avatars/prince_1.png';
import princesse1 from '@/assets/avatars/princesse_1.png';
import chevalier1 from '@/assets/avatars/chevalier_1.png';
import chevalier2 from '@/assets/avatars/chevalier_2.png';
import pirate1 from '@/assets/avatars/pirate_1.png';
import pirate2 from '@/assets/avatars/pirate_2.png';
import ninja1 from '@/assets/avatars/ninja_1.png';
import ninja2 from '@/assets/avatars/ninja_2.png';
import superhero1 from '@/assets/avatars/superhero_1.png';
import superhero2 from '@/assets/avatars/superhero_2.png';
import cowboy1 from '@/assets/avatars/cowboy_1.png';
import cowboy2 from '@/assets/avatars/cowboy_2.png';
import indien1 from '@/assets/avatars/indien_1.png';
import indien2 from '@/assets/avatars/indien_2.png';

export interface Avatar {
  id: string;
  name: string;
  image: string;
}

export const AVATARS: Avatar[] = [
  { id: 'fille_1', name: 'Emma', image: fille1 },
  { id: 'fille_2', name: 'Léa', image: fille2 },
  { id: 'fille_3', name: 'Chloé', image: fille3 },
  { id: 'fille_4', name: 'Inaya', image: fille4 },
  { id: 'fille_5', name: 'Aïcha', image: fille5 },
  { id: 'fille_6', name: 'Sakura', image: fille6 },
  { id: 'fille_7', name: 'Priya', image: fille7 },
  { id: 'garcon_1', name: 'Lucas', image: garcon1 },
  { id: 'garcon_2', name: 'Hugo', image: garcon2 },
  { id: 'garcon_3', name: 'Tom', image: garcon3 },
  { id: 'garcon_4', name: 'Nathan', image: garcon4 },
  { id: 'garcon_5', name: 'Adam', image: garcon5 },
  { id: 'garcon_6', name: 'Malik', image: garcon6 },
  { id: 'garcon_7', name: 'Kenji', image: garcon7 },
  { id: 'garcon_8', name: 'Rayan', image: garcon8 },
  { id: 'prince_1', name: 'Prince Arthur', image: prince1 },
  { id: 'princesse_1', name: 'Princesse Rose', image: princesse1 },
  { id: 'chevalier_1', name: 'Sir Lancelot', image: chevalier1 },
  { id: 'chevalier_2', name: 'Sir Gauvain', image: chevalier2 },
  { id: 'pirate_1', name: 'Capitaine Jack', image: pirate1 },
  { id: 'pirate_2', name: 'Barbe Noire', image: pirate2 },
  { id: 'ninja_1', name: 'Takeshi', image: ninja1 },
  { id: 'ninja_2', name: 'Yuki', image: ninja2 },
  { id: 'superhero_1', name: 'Super Max', image: superhero1 },
  { id: 'superhero_2', name: 'Super Lily', image: superhero2 },
  { id: 'cowboy_1', name: 'Billy', image: cowboy1 },
  { id: 'cowboy_2', name: 'Jessie', image: cowboy2 },
  { id: 'indien_1', name: 'Petit Ours', image: indien1 },
  { id: 'indien_2', name: 'Plume Légère', image: indien2 },
];

export const getAvatarById = (id: string): Avatar | undefined => {
  return AVATARS.find(avatar => avatar.id === id);
};

export const getAvatarImage = (id: string): string => {
  const avatar = getAvatarById(id);
  return avatar?.image || fille1;
};

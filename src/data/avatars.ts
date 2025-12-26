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
];

export const getAvatarById = (id: string): Avatar | undefined => {
  return AVATARS.find(avatar => avatar.id === id);
};

export const getAvatarImage = (id: string): string => {
  const avatar = getAvatarById(id);
  return avatar?.image || fille1;
};

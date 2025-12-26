import React from 'react';
import { AVATARS } from '@/data/avatars';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

interface AvatarCarouselProps {
  selectedAvatar: string;
  onSelect: (avatarId: string) => void;
}

export function AvatarCarousel({ selectedAvatar, onSelect }: AvatarCarouselProps) {
  return (
    <div className="w-full px-10">
      <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2">
          {AVATARS.map((avatar) => (
            <CarouselItem key={avatar.id} className="pl-2 basis-1/4 sm:basis-1/5">
              <button
                type="button"
                onClick={() => onSelect(avatar.id)}
                className={`
                  w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden
                  transition-all duration-200 border-3
                  ${selectedAvatar === avatar.id 
                    ? 'border-golden ring-2 ring-golden/50 scale-110 shadow-lg shadow-golden/30' 
                    : 'border-white/30 hover:border-golden/50 hover:scale-105'}
                `}
                title={avatar.name}
              >
                <img 
                  src={avatar.image} 
                  alt={avatar.name}
                  className="w-full h-full object-cover"
                />
              </button>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious 
          className="left-0 bg-white/20 border-white/30 text-white hover:bg-white/30 hover:text-white"
        />
        <CarouselNext 
          className="right-0 bg-white/20 border-white/30 text-white hover:bg-white/30 hover:text-white"
        />
      </Carousel>
    </div>
  );
}

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
    <div className="w-full px-12 sm:px-10">
      <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-1 sm:-ml-2">
          {AVATARS.map((avatar) => (
            <CarouselItem key={avatar.id} className="pl-1 sm:pl-2 basis-1/3 sm:basis-1/4 md:basis-1/5">
              <button
                type="button"
                onClick={() => onSelect(avatar.id)}
                className={`
                  w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-lg sm:rounded-xl overflow-hidden mx-auto
                  transition-all duration-200 border-2 sm:border-3
                  ${selectedAvatar === avatar.id 
                    ? 'border-golden ring-2 ring-golden/50 scale-110 shadow-lg shadow-golden/30' 
                    : 'border-white/30 hover:border-golden/50 hover:scale-105'}
                `}
                title={avatar.name}
              >
                <img 
                  src={avatar.image} 
                  alt={avatar.name}
                  className="w-full h-full object-contain"
                />
              </button>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious 
          className="-left-10 sm:-left-4 w-8 h-8 sm:w-8 sm:h-8 bg-white/20 border-white/30 text-white hover:bg-white/30 hover:text-white"
        />
        <CarouselNext 
          className="-right-10 sm:-right-4 w-8 h-8 sm:w-8 sm:h-8 bg-white/20 border-white/30 text-white hover:bg-white/30 hover:text-white"
        />
      </Carousel>
    </div>
  );
}

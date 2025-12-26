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
    <div className="w-full">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <div className="flex items-center gap-3">
          <CarouselPrevious
            className="static translate-y-0 h-9 w-9 rounded-full shrink-0 bg-white/20 border-white/30 text-white hover:bg-white/30 hover:text-white"
          />

          <CarouselContent className="-ml-3 flex-1">
            {AVATARS.map((avatar) => (
              <CarouselItem key={avatar.id} className="pl-3 basis-1/2">
                <button
                  type="button"
                  onClick={() => onSelect(avatar.id)}
                  className={
                    `w-full aspect-square max-w-24 sm:max-w-28 rounded-lg sm:rounded-xl overflow-hidden mx-auto ` +
                    `transition-all duration-200 border-2 ` +
                    (selectedAvatar === avatar.id
                      ? "border-golden ring-2 ring-golden/50 scale-110 shadow-lg shadow-golden/30"
                      : "border-white/30 hover:border-golden/50 hover:scale-105")
                  }
                  title={avatar.name}
                >
                  <img src={avatar.image} alt={avatar.name} className="w-full h-full object-contain" />
                </button>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselNext
            className="static translate-y-0 h-9 w-9 rounded-full shrink-0 bg-white/20 border-white/30 text-white hover:bg-white/30 hover:text-white"
          />
        </div>
      </Carousel>
    </div>
  );
}

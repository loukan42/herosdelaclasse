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
        <div className="flex items-center justify-center gap-2 sm:gap-3">
          <CarouselPrevious
            className="static translate-y-0 h-8 w-8 sm:h-9 sm:w-9 rounded-full shrink-0 bg-white/20 border-white/30 text-white hover:bg-white/30 hover:text-white"
          />

          <CarouselContent className="-ml-2 flex-1">
            {AVATARS.map((avatar) => (
              <CarouselItem key={avatar.id} className="pl-2 basis-1/2 flex justify-center">
                <button
                  type="button"
                  onClick={() => onSelect(avatar.id)}
                  className={
                    `relative p-1 rounded-full overflow-visible ` +
                    `transition-all duration-200 ` +
                    (selectedAvatar === avatar.id
                      ? "ring-2 ring-golden/70 shadow-lg shadow-golden/20"
                      : "hover:ring-2 hover:ring-golden/40")
                  }
                  title={avatar.name}
                >
                  <span className="block h-14 w-14 sm:h-16 sm:w-16 md:h-14 md:w-14 rounded-full overflow-hidden bg-white/10">
                    <img
                      src={avatar.image}
                      alt={avatar.name}
                      className="h-full w-full object-contain"
                      loading="lazy"
                      decoding="async"
                    />
                  </span>
                </button>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselNext
            className="static translate-y-0 h-8 w-8 sm:h-9 sm:w-9 rounded-full shrink-0 bg-white/20 border-white/30 text-white hover:bg-white/30 hover:text-white"
          />
        </div>
      </Carousel>
    </div>
  );
}

"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";
import hero1 from "../../assets/sliderHome-1.jpg";
import hero2 from "../../assets/sliderHome-2.jpg";

const slides = [
  {
    image: hero1,
    title: "Ще з Скайрока",
  },
  {
    image: hero2,
    title: "Нова колекція",
  },
];

export function Hero() {
  const t = useTranslations('Home');
  const [i, setI] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setI((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setI((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setI((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative overflow-hidden text-white">
      {/* Slides */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{
          transform: `translateX(-${i * 100}%)`,
        }}
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            className="relative min-w-full"
          >
            <Image
              src={slide.image}
              alt={slide.title}
              className="h-[280px] w-full object-cover opacity-90 sm:h-[380px] lg:h-[520px]"
              priority={index === 0}
            />
            {/* Text */}
            <div className="absolute w-full bottom-0 bg-gradient-to-b from-black/50 to-transparent p-4 text-center sm:p-6">
              <p className="mx-auto max-w-3xl text-xs leading-relaxed text-white/80 sm:text-sm">
                {t('heroText')}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Arrows */}
      <button
        aria-label="Попередній"
        onClick={prevSlide}
        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 hover:bg-white/20"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <button
        aria-label="Наступний"
        onClick={nextSlide}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 hover:bg-white/20"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Bullets */}
      <div className="absolute bottom-24 left-1/2 flex -translate-x-1/2 gap-2 tablet:hidden">
        {slides.map((_, index) => (
          <button
            key={index}
            aria-label={`Слайд ${index + 1}`}
            onClick={() => setI(index)}
            className={`h-3.5 w-3.5 rounded-full transition ${i === index ? "bg-[#FF0000]" : "bg-white"
              }`}
          />
        ))}
      </div>
    </section>
  );
}
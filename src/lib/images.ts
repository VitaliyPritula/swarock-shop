import type { StaticImageData } from "next/image";
import tshirt from "@/src/assets/product-tshirt.jpg";
import jacket from "@/src/assets/product-jacket.jpg";
import boots from "@/src/assets/product-boots.jpg";
import cap from "@/src/assets/product-cap.jpg";
import mask from "@/src/assets/product-mask.jpg";
import poster from "@/src/assets/product-poster.jpg";
import vinyl from "@/src/assets/product-vinyl.jpg";
import concert from "@/src/assets/blog-1.jpg";
import sliderHome1 from "@/src/assets/sliderHome-1.jpg";
import sliderHome2 from "@/src/assets/sliderHome-2.jpg";

const map: Record<string, StaticImageData> = {
  tshirt, jacket, boots, cap, mask, poster, vinyl, concert,
  hero1: sliderHome1,
  hero2: sliderHome2,
};

export function img(key: string | null | undefined, fallback = tshirt): StaticImageData {
  if (!key) return fallback;
  return map[key] ?? fallback;
}

export { sliderHome1 as hero1, concert };
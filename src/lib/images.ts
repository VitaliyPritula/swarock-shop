import type { StaticImageData } from "next/image";
import tshirt from "@/src/assets/product-tshirt.jpg";
import tshirt1 from "@/src/assets/Mask-Group-1.png";
import tshirtMars from "@/src/assets/Mask Group.png";
import tshirtAborted from "@/src/assets/Mask Group-2.png";
import tshirtMoon from "@/src/assets/Mask Group-3.png";
import tshirtChthonic from "@/src/assets/Mask Group-4.png";
import tshirt5 from "@/src/assets/Mask Group-5.png";
import tshirt6 from "@/src/assets/Mask Group-6.png";
import tshirt7 from "@/src/assets/Mask Group-7.png";
import tshirt8 from "@/src/assets/Mask Group-8.png";
import tshirt9 from "@/src/assets/Mask Group-9.png";
import tshirt10 from "@/src/assets/Mask Group-10.png";
import tshirt11 from "@/src/assets/Mask Group-11.png";
import tshirt12 from "@/src/assets/Mask Group-12.png";
import tshirt13 from "@/src/assets/Mask Group-13.png";
import tshirt14 from "@/src/assets/Mask Group-14.png";
import tshirt15 from "@/src/assets/Mask Group-15.png";
import tshirt16 from "@/src/assets/Mask Group-16.png";
import tshirt17 from "@/src/assets/Mask Group-17.png";
import tshirt18 from "@/src/assets/Mask Group-18.png";
import tshirt19 from "@/src/assets/Mask Group-19.png";
import tshirt20 from "@/src/assets/Mask Group-20.png";
import tshirt21 from "@/src/assets/Mask Group-21.png";
import tshirt22 from "@/src/assets/Mask Group-22.png";
import tshirt23 from "@/src/assets/Mask Group-23.png";
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
  tshirt, jacket, boots, cap, mask, poster, vinyl, concert, tshirt1,
  tshirtMars, tshirtAborted, tshirtMoon, tshirtChthonic,
  tshirt5, tshirt6, tshirt7, tshirt8, tshirt9, tshirt10,
  tshirt11, tshirt12, tshirt13, tshirt14, tshirt15, tshirt16,
  tshirt17, tshirt18, tshirt19, tshirt20, tshirt21, tshirt22, tshirt23,
  hero1: sliderHome1,
  hero2: sliderHome2,
};

export function img(key: string | null | undefined, fallback: StaticImageData | string = tshirt): StaticImageData | string {
  if (!key) return fallback;
  if (key.startsWith("/")) return key;
  return map[key] ?? fallback;
}

export { sliderHome1 as hero1, concert };
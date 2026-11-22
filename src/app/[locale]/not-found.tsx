'use client';
import Link from "next/link";
import Image from 'next/image';

export default function NotFound() {
  return (
    <main className="mx-auto max-w-[1200px] md:flex-nowrap flex flex-wrap min-h-[60vh] max-w-2xl  justify-center px-4 py-16 text-center">
      <Image
        src="/Mask Group.png"
        alt="404"
        width={200}
        height={206}
        className="mx-auto h-full w-full object-contain"
      />
      <div className="mt-8 min-w-[500px]">
        <h2 className="mt-4 font-bold tracking-tight text-gray-900 sm:text-[9rem]">
          404
        </h2>
        <p className="mt-4 text-base leading-7 text-gray-600 mb-4">
          Сторінку, яку ви шукаєте, не знайдено.
        </p>
          <Link
            href="/"
            className="block w-full hover:bg-black px-6 py-3 text-center text-sm font-semibold uppercase hover:text-white hover:bg-neutral-800"
          >
            На головну
          </Link>
      </div>
    </main>
  );
}
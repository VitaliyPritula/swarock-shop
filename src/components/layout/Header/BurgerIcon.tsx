'use client';

type BurgerIconProps = {
  isOpen: boolean;
  onClick: () => void;
};

export default function BurgerIcon({ isOpen, onClick }: BurgerIconProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className=" z-80 flex h-4 cursor-pointer flex-col justify-between md:hidden"
      aria-label={isOpen ? 'Закрити меню' : 'Відкрити меню'}
      aria-expanded={isOpen}
    >
      <span
        className={`block h-[2px] w-5 bg-white transition-all duration-300 ${isOpen ? 'translate-y-[7px] rotate-45' : ''
          }`}
      />
      <span
        className={`block h-[2px] w-3 bg-white transition-all duration-300 ${isOpen ? 'opacity-0' : ''
          }`}
      />
      <span
        className={`block h-[2px] w-2 bg-white transition-all duration-300 ${isOpen ? '-translate-y-[11px] -rotate-45 w-5' : ''
          }`}
      />
    </button>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-8 flex text-center w-full items-center gap-4">
      <div className="h-px w-full bg-primary" />
      <h2 className="font-display text-[18px] uppercase tracking-[0.25em] w-[50%] md:text-xl whitespace-nowrap">
        {children}
      </h2>
      <div className="h-px w-full bg-primary" />
    </div>
  );
}

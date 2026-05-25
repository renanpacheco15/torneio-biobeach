import Image from "next/image";
import { cn } from "@/lib/utils";

type BrandProps = {
  compact?: boolean;
  dark?: boolean;
};

export function Brand({ compact = false, dark = false }: BrandProps) {
  if (dark) {
    return (
      <div className={cn("flex flex-col justify-center", compact ? "h-14" : "h-16")}>
        <div className={cn("font-black uppercase leading-none tracking-normal text-white", compact ? "text-3xl" : "text-4xl sm:text-5xl")}>
          BIO<span className="text-lime-300">BEACH</span>
        </div>
        <div className="mt-1 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.34em] text-lime-200/80">
          <span className="h-px w-8 bg-lime-300/70" />
          Futevôlei
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative flex items-center justify-center rounded-md border border-slate-200 bg-white p-2 shadow-sm",
        compact ? "h-14 w-44" : "h-16 w-56",
      )}
    >
      <Image src="/sponsors/biobeach.jpeg" alt="BIOBEACH Futevôlei" fill sizes={compact ? "176px" : "224px"} className="object-contain p-2" />
    </div>
  );
}

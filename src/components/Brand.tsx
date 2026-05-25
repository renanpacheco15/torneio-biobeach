import Image from "next/image";
import { cn } from "@/lib/utils";

type BrandProps = {
  compact?: boolean;
  dark?: boolean;
};

export function Brand({ compact = false, dark = false }: BrandProps) {
  if (dark) {
    return (
      <div className={cn("flex flex-col justify-center", compact ? "h-11" : "h-12 sm:h-14")}>
        <div className={cn("font-black uppercase leading-none tracking-normal text-white", compact ? "text-3xl" : "text-3xl min-[390px]:text-4xl sm:text-5xl")}>
          BIO<span className="text-lime-300">BEACH</span>
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
      <Image src="/brand/biobeach-logo-pura.png" alt="BIOBEACH Futevôlei" fill sizes={compact ? "176px" : "224px"} className="object-contain p-2" />
    </div>
  );
}

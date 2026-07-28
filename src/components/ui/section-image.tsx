import Image from "next/image";

import { classNames } from "@/lib/class-names";

type SectionImageProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes: string;
  className?: string;
  imageClassName?: string;
  preload?: boolean;
};

export function SectionImage({
  src,
  alt,
  width,
  height,
  sizes,
  className,
  imageClassName,
  preload = false,
}: SectionImageProps) {
  return (
    <div
      className={classNames(
        "overflow-hidden rounded-[24px] bg-[#e8edf2] shadow-[0_20px_50px_rgba(2,31,88,0.12)]",
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        preload={preload}
        className={classNames("size-full object-cover", imageClassName)}
      />
    </div>
  );
}

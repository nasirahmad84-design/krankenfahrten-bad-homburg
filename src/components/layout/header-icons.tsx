import Image from "next/image";

export function PhoneIcon({ className = "size-5" }: { className?: string }) {
  return (
    <Image
      src="/brand/phone.svg"
      alt=""
      width={20}
      height={20}
      className={className}
      aria-hidden="true"
    />
  );
}

export function ChevronIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className="size-5 shrink-0 text-[#5c6678]"
      fill="none"
    >
      <path
        d="m8 5 5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

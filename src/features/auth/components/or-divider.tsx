import Image from "next/image";

/** "OR" with a rule trailing off to the right, between the form and OAuth. */
export function OrDivider() {
  return (
    <div className="relative mt-[clamp(10px,2.6dvh,26px)] mb-[clamp(6px,1.3dvh,13px)] h-[29px]">
      <p className="text-divider-text absolute left-[163px] text-xl leading-[normal] font-medium">
        OR
      </p>
      <Image
        src="/images/or-line.svg"
        alt=""
        width={157}
        height={3}
        className="absolute top-[12.5px] left-[202px] max-w-[calc(100%-202px)] lg:max-w-none"
      />
    </div>
  );
}

import Image from "next/image";

export default function BoAvatarFlip() {
  return (
    <div className="relative group perspective-distant">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/30 to-red-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="relative transform-3d transition-transform duration-700 ease-out group-hover:rotate-y-180">
        <Image
          src="/bo-avatar.png"
          alt="Bo"
          width={500}
          height={500}
          priority
          className="rounded-full backface-hidden"
        />
        <Image
          src="/bo-cartoon.png"
          alt="Bo, illustrated"
          width={500}
          height={500}
          className="absolute inset-0 w-full h-full rounded-full backface-hidden rotate-y-180"
        />
      </div>
    </div>
  );
}

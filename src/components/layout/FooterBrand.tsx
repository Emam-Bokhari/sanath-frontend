import Image from "next/image";
import Link from "next/link";

export default function FooterBrand() {
    return (
        <div className="flex flex-col gap-5">
            <Image src="/bannerLogo.png" alt="MyHome" width={150} height={120} className="h-auto" />
            <p className="text-gray-300 text-[15px] leading-relaxed max-w-[300px]">
                The UK&apos;s modern property marketplace. Search, save, and connect with agents across
                England, Scotland, Wales and Northern Ireland.
            </p>
        </div>
    );
}
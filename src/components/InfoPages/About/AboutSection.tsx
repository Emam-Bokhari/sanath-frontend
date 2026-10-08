import Image from "next/image";

export default function AboutSection({ about }: { about?: any }) {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center text-black">
          {/* Text */}
          <div dangerouslySetInnerHTML={{ __html: about }} />

          {/* Image */}
          <div className="relative w-full h-64 sm:h-80 lg:h-96 rounded-2xl overflow-hidden shadow-lg">
            <Image
              src="/about-img1.jpg"
              alt="Modern apartment building"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
      
    </section>
  );
}

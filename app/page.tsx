import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <main>
        <Image
          src="/logo.svg"
          alt="Principle"
          width={256}
          height={128}
          priority
        />
      </main>
    </div>
  );
}

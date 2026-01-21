import AnimatedLogo from "./components/AnimatedLogo";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0a0a0a] text-[#171717] dark:text-[#ededed]">
      {/* Main content area - centered both ways */}
      <main className="relative z-10 flex flex-col items-center">
        {/* Particle logo */}
        <div className="relative h-[100px] w-full">
          <AnimatedLogo />
        </div>

        {/* Text content */}
        <div className="text-base px-4 w-[50%]">
          <p className="text-center">
            <span className="font-bold">Foundational advisory for early-stage companies.</span> We help establish first principles - the decisions about experience, product, and organization that shape everything that follows. Berlin-based, working discreetly with founders wherever they are.
          </p>
        </div>
      </main>
    </div>
  );
}

import FormationCanvas from "@/components/FormationCanvas";
import TextSection from "@/components/TextSection";

export default function Home() {
  return (
    <main className="relative h-dvh w-full overflow-hidden bg-zinc-950">
      <div className="absolute inset-0 z-0">
        <FormationCanvas />
      </div>

      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="w-full h-full flex items-center justify-center">
          <TextSection />
        </div>
      </div>
    </main>
  );
}

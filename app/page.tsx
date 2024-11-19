import { Vortex } from "@/components/ui/vortex";
import Image from "next/image";

export default function Home() {
  return (
    <div className="w-[calc(100%-4rem)] mx-auto rounded-md  h-[35rem] overflow-hidden bg-black">
      <Vortex
        backgroundColor="black"
        className="flex items-center flex-col justify-center px-2 md:px-10 py-4 w-full h-full"
      >
        <h2 className="text-white text-3xl md:text-6xl font-bold text-center">
          Soleth
        </h2>
        <p className="text-white text-lg md:text-2xl max-w-xl mt-6 text-center">
          A clean modern crypto wallet!
        </p>
      </Vortex>
    </div>
  );
}

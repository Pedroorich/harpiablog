import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";
import { ShiningText } from "./shining-text";

/* ---------------- WordsPullUp ---------------- */
interface WordsPullUpProps {
  text: string;
  className?: string;
  showAsterisk?: boolean;
  style?: React.CSSProperties;
}

export const WordsPullUp = ({ text, className = "", showAsterisk = false, style }: WordsPullUpProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const words = text.split(" ");

  return (
    <div ref={ref} className={`inline-flex flex-wrap ${className}`} style={style}>
      {words.map((word, i) => {
        const isLast = i === words.length - 1;
        return (
          <motion.span
            key={i}
            initial={{ y: 20, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block relative"
            style={{ marginRight: isLast ? 0 : "0.25em" }}
          >
            {word}
            {showAsterisk && isLast && (
              <span className="absolute top-[0.65em] -right-[0.3em] text-[0.31em] text-blue-600 font-bold">*</span>
            )}
          </motion.span>
        );
      })}
    </div>
  );
};

/* ---------------- Hero ---------------- */
const navItems = [
  { name: "Meu propósito", href: "#meu-proposito" },
  { name: "Blog", href: "/blog" },
  { name: "Ferramentas", href: "/ferramentas" },
  { name: "Redes Sociais", href: "#redes-sociais" }
];

const PrismaHero = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <section className="h-screen w-full relative z-10 px-4 py-4 md:py-6 lg:px-8">
      <div className="relative h-full w-full overflow-hidden rounded-3xl md:rounded-[2.5rem] bg-black border border-white/5 shadow-xl">
        
        {/* Background video with Parallax */}
        <motion.div style={{ y }} className="absolute inset-x-0 w-full h-[150%] -top-[25%] md:h-[130%] md:-top-[15%]">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover object-top md:object-[center_20%] opacity-90 mix-blend-screen"
            src="https://cdn.leonardo.ai/users/32a08d5d-2d5b-4439-92c8-24280f68b879/generations/1f147f1f-e724-6c70-a42c-fde9a969f455/kling-3.0_A_hyper-realistic_cinematic_shot_of_a_humanoid_eagle_harpy_wearing_a_black_suit_-0.mp4"
          />
        </motion.div>

        {/* Gradient overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/90" />

        {/* Navbar */}
        <nav className="absolute left-1/2 top-4 z-20 -translate-x-1/2">
          <div className="flex items-center gap-3 rounded-full bg-black/30 shadow-[0_4px_20px_rgb(0,0,0,0.2)] backdrop-blur-md px-6 py-3 sm:gap-6 md:gap-10 border border-white/10">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-[11px] sm:text-xs md:text-sm font-medium text-white/70 hover:text-white transition-colors"
              >
                {item.name}
              </a>
            ))}
          </div>
        </nav>

        {/* Hero content */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-6 sm:px-10 md:px-12 lg:pb-12 border-b-8 border-transparent">
          <div className="grid grid-cols-12 items-end gap-6 bg-black/60 backdrop-blur-2xl p-6 md:p-8 rounded-[2rem] border border-white/20 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
            
            <div className="col-span-12 lg:col-span-7">
              <h1
                className="font-serif font-semibold leading-[0.9] tracking-tight text-[22vw] sm:text-[20vw] md:text-[18vw] lg:text-[15vw] xl:text-[14vw] text-white drop-shadow-lg relative inline-block"
              >
                <ShiningText text="Clareza" />
                <span className="absolute top-[0.1em] right-[-0.2em] text-[0.4em] text-blue-600 font-sans font-bold">*</span>
              </h1>
            </div>

            <div className="col-span-12 flex flex-col gap-6 pb-2 lg:col-span-5 lg:pb-6">
              
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="text-sm font-medium text-white drop-shadow-md sm:text-base md:text-lg lg:text-xl"
                style={{ lineHeight: 1.5 }}
              >
                A tecnologia não precisa ser um mistério. Nós traduzimos ideias complexas em resultados reais, de um jeito humano, simples e fácil de entender.
              </motion.p>

              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="group inline-flex items-center gap-3 self-start rounded-full bg-blue-600 py-1.5 pl-6 pr-1.5 text-sm font-medium text-white transition-all hover:bg-blue-700 hover:scale-105 hover:gap-4 sm:text-base shadow-lg shadow-blue-200"
              >
                Veja como funciona
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white transition-transform group-hover:rotate-12 sm:h-12 sm:w-12 shadow-sm">
                  <ArrowRight className="h-5 w-5 text-blue-600" />
                </span>
              </motion.button>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export {PrismaHero}


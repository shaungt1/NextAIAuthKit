"use client";

import { motion } from "framer-motion";
import { Button } from "@/registry/new-york/ui/button";
import ThemeSwitch from "@/app/theme/ThemeSwitch";
import { Stepper } from "@/components/stepper/stepper";
import { setupSteps } from "@/data/setupSteps";

const HomePage: React.FC = () => {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
      {/* Animated Logo */}
      <motion.h1
        className="mt-16 text-6xl font-extrabold tracking-tight sm:text-7xl md:text-8xl text-primary"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        NextAIAuthKit
      </motion.h1>

      {/* Subheading */}
      <motion.p
        className="text-lg max-w-3xl text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        A fully integrated AI-first Next.js development kit that includes authentication, Prisma, LangChain, 
        OpenAI, and PyTorch** support. Set up your project effortlessly and start building AI applications today.
      </motion.p>

           {/* Stepper */}
      <motion.div
        className="w-full max-w-3xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <Stepper steps={setupSteps} />
      </motion.div>

    
    </main>
  );
};

export default HomePage;

"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { Greeting } from "@/components/home/Greeting";
import { InsightCard } from "@/components/cards/InsightCard";
import { ActionCard } from "@/components/cards/ActionCard";
import { SignalCard } from "@/components/cards/SignalCard";
import { Brain, Flame, Battery, Moon } from "lucide-react";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function Home() {
  return (
    <AppLayout>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-8"
      >
        <motion.div variants={item}>
          <Greeting />
        </motion.div>

        {/* Top Section: Insight & Action */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div variants={item} className="h-full">
            <InsightCard
              title="Your energy peaks around 11:00 AM"
              description="Based on your last 7 days, you perform best in late mornings. Plan deep work sessions then."
              className="h-full bg-linear-to-br from-card to-card/50"
              variant="highlight"
            />
          </motion.div>

          <motion.div variants={item} className="h-full">
            <ActionCard
              title="Start Deep Focus Session"
              onAction={() => console.log("Start Focus")}
              className="h-full"
            />
          </motion.div>
        </div>

        {/* Signals Grid */}
        <div className="space-y-4">
          <motion.h2 variants={item} className="text-lg font-semibold tracking-tight">Current Signals</motion.h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div variants={item}>
              <SignalCard
                label="Cognitive Load"
                value="Low"
                icon={Brain}
                trend="down"
                trendLabel="Improving"
              />
            </motion.div>
            <motion.div variants={item}>
              <SignalCard
                label="Focus Score"
                value="8.5"
                icon={Flame}
                trend="up"
                trendLabel="vs Yesterday"
              />
            </motion.div>
            <motion.div variants={item}>
              <SignalCard
                label="Energy"
                value="92%"
                icon={Battery}
                trend="neutral"
                trendLabel="Stable"
              />
            </motion.div>
            <motion.div variants={item}>
              <SignalCard
                label="Sleep Quality"
                value="7h 20m"
                icon={Moon}
                trend="up"
                trendLabel="Solid"
              />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </AppLayout>
  );
}

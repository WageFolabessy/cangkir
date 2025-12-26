"use client";

import { motion, Variants } from "framer-motion";

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.3,
            delayChildren: 0.2,
        },
    },
};

const topItemVariants: Variants = {
    hidden: { y: -20, opacity: 0 },
    show: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 1.2,
            ease: "easeOut"
        }
    },
};

const bottomItemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    show: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 1.2,
            ease: "easeOut",
            delay: 8.5
        }
    },
};

const contactVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            duration: 1.0,
            ease: "easeOut",
            delay: 9.5
        }
    },
};

export default function TextSection() {
    return (
        <motion.div
            className="flex flex-col justify-between items-center h-full w-full pt-68 pb-66 px-6 md:pt-32 md:pb-10 md:px-10 relative pointer-events-none"
            variants={containerVariants}
            initial="hidden"
            animate="show"
        >
            <div className="flex flex-col items-center gap-3 pointer-events-auto">
                <motion.p
                    variants={topItemVariants}
                    className="opacity-0 font-bold tracking-[0.3em] uppercase text-xs text-slate-200"
                >
                    Digital <span className="text-yellow-400">Crafting</span>
                </motion.p>
            </div>

            <div className="grow" />

            <motion.div variants={bottomItemVariants} className="flex flex-col items-center pointer-events-auto opacity-0">
                <h1 className="text-3xl md:text-7xl font-display font-bold text-white leading-tight text-center whitespace-nowrap mb-6">
                    Shape to <span className="text-yellow-400">Your Idea.</span>
                </h1>

                <motion.a
                    variants={contactVariants}
                    href="https://wa.me/6289692070270"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[10px] md:text-xs tracking-[0.3em] text-white hover:text-yellow-400 transition-colors duration-300 uppercase cursor-pointer"
                >
                    &gt; START_PROJECT // +62 896 9207 0270
                </motion.a>
            </motion.div>
        </motion.div>
    );
}

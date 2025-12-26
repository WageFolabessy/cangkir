"use client";

import { motion, Variants } from "framer-motion";

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.3,
            delayChildren: 0.5,
        },
    },
};

const topItemVariants: Variants = {
    hidden: { y: -20, opacity: 0 },
    show: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 20
        }
    },
};

const bottomItemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    show: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 20,
            delay: 2.8
        }
    },
};

export default function TextSection() {
    return (
        <motion.div
            className="flex flex-col justify-between items-center h-full w-full pt-64 pb-64 px-6 md:py-16 md:px-10 relative"
            variants={containerVariants}
            initial="hidden"
            animate="show"
        >
            <div className="flex flex-col items-center gap-3">
                <motion.p
                    variants={topItemVariants}
                    className="font-bold tracking-[0.3em] uppercase text-xs text-slate-900"
                >
                    Digital Crafting
                </motion.p>
            </div>

            <div className="grow" />

            <motion.div variants={bottomItemVariants} className="flex flex-col items-center">
                <h1 className="text-3xl md:text-7xl font-display font-bold text-slate-900 leading-tight text-center whitespace-nowrap">
                    Shape to <span className="text-indigo-600">Your Idea.</span>
                </h1>
            </motion.div>
        </motion.div>
    );
}

// src/app/studio/page.tsx

'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';

const StudioPage = () => {
  const imageRef = useRef(null);

  // GSAP animation for the image
  useEffect(() => {
    if (imageRef.current) {
      gsap.fromTo(
        imageRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 1.5, ease: 'power3.out' }
      );
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Buttons with Framer Motion animation */}
        <div className="flex flex-col items-center md:items-start space-y-6">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white text-center md:text-left">
            Welcome to the NFT Studio
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 text-center md:text-left max-w-md">
            Create, mint, and manage your NFTs with ease. Explore the possibilities of digital ownership.
          </p>
          <Link href="/studio/mint">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full md:w-auto"
            >
              <Button className="px-8 py-4 text-xl font-semibold text-white bg-gradient-to-r from-pink-500 to-violet-700 rounded-full shadow-lg hover:shadow-2xl hover:from-pink-600 hover:to-violet-800 transition-all duration-300">
                Mint NFT
              </Button>
            </motion.div>
          </Link>
          <Link href="/studio/mynft">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full md:w-auto"
            >
              <Button className="px-8 py-4 text-xl font-semibold text-white bg-gradient-to-r from-violet-500 to-blue-600 rounded-full shadow-lg hover:shadow-2xl hover:from-violet-600 hover:to-blue-700 transition-all duration-300">
                My NFTs
              </Button>
            </motion.div>
          </Link>
        </div>

        {/* Image with GSAP animation */}
        <div className="flex justify-center md:justify-end">
          <motion.div
            ref={imageRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="rounded-lg overflow-hidden shadow-xl"
          >
            <Image 
              src="/assets/ld.gif" 
              alt="Studio" 
              width={500} 
              height={500} 
              className="object-cover rounded-lg"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default StudioPage;

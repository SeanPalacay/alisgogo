"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import axios from "axios";
import { Sun, Moon } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamically load WalletMultiButton to ensure it is only rendered on the client side
const DynamicWalletMultiButton = dynamic(
  () =>
    import("@solana/wallet-adapter-react-ui").then(
      (mod) => mod.WalletMultiButton
    ),
  { ssr: false }
);

const NavBar = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    // Check for stored theme in localStorage
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setTheme(storedTheme as "light" | "dark");
      document.documentElement.classList.add(storedTheme);
    }

    // Fetch user info if token exists
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:4000/api/userinfo", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setUsername(response.data.username);
        })
        .catch(() => {
          setUsername(null);
        });
    }
  }, []);

  const handleToggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.remove(theme);
    document.documentElement.classList.add(newTheme);
    localStorage.setItem("theme", newTheme); // Save the theme in localStorage
  };

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-black"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-[1250px] mx-auto px-4 h-20 flex items-center justify-between">
        <motion.div
          className="font-heading-4 font-bold text-xl tracking-wide"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Link href="/">
            <span className="text-[#a70bce]">Alis.</span>
            <span className="text-[#24282b] dark:text-white">Go</span>
          </Link>
        </motion.div>
        <nav className="flex items-center space-x-8">
          <NavItem text="Collection" href="/studio" />
          <NavItem text="Itinerary" href="/discover/closet" />
          <NavItem text="Market" href="/marketplace" />
        </nav>
        <motion.div
          className="flex items-center space-x-4"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <DynamicWalletMultiButton />
        </motion.div>
      </div>
    </motion.header>
  );
};

interface NavItemProps {
  text: string;
  href: string;
}

const NavItem: React.FC<NavItemProps> = ({ text, href }) => (
  <motion.div
    className="opacity-75 font-heading-7 text-gray-700 dark:text-gray-300 font-bold cursor-pointer"
    whileHover={{ scale: 1.1, opacity: 1 }}
    whileTap={{ scale: 0.95 }}
  >
    <Link href={href}>{text}</Link>
  </motion.div>
);

export default NavBar;

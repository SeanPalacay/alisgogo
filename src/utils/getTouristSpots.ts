import { AnchorProvider, Wallet } from "@coral-xyz/anchor";
import { Connection } from "@solana/web3.js";

// Simulated tourist spots data using local images.
const touristSpots = [
  {
    spotName: "Eiffel Tower",
    location: "Paris, France",
    image: "/images/eiffel-tower.jpg", // Local image from public/images
    description: "A famous wrought-iron lattice tower on the Champ de Mars.",
    fact: "It was the tallest man-made structure in the world until 1930.",
    mint: "eiffel-tower-unique-id",
    link: "https://en.wikipedia.org/wiki/Eiffel_Tower",
  },
  {
    spotName: "Great Wall of China",
    location: "China",
    image: "/images/great-wall.jpg", // Local image from public/images
    description: "Ancient series of walls and fortifications.",
    fact: "It's over 13,000 miles long!",
    mint: "great-wall-unique-id",
  },
  {
    spotName: "Statue of Liberty",
    location: "New York, USA",
    image: "/images/statue-of-liberty.jpg", // Local image from public/images
    description: "A colossal neoclassical sculpture on Liberty Island.",
    fact: "A gift from France to the United States.",
    mint: "statue-liberty-unique-id",
    link: "https://en.wikipedia.org/wiki/Statue_of_Liberty",
  },
];

// Function to simulate fetching tourist spots
export const getTouristSpots = async (provider: AnchorProvider, connection: Connection) => {
  return touristSpots; // Return the simulated data
};

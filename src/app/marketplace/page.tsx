"use client";

import React, { useEffect, useState } from "react";
import {
  getAssetsByOwner,
  fetchNFTDetails,
  extractGroupAddress,
} from "@/utils/getAssets";
import Image from "next/image";
import Link from "next/link";
import { FaExternalLinkAlt } from "react-icons/fa";
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import Card from "@/components/Card";
import Skeleton from "@/components/Skeleton";
import { getNFTDetail, getNFTList } from "@/utils/nftMarket";
import { AnchorProvider, Wallet } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import axios from "axios"; // Import axios for metadata fetching

export interface NFTDetail {
  name: string;
  description: string;
  symbol: string;
  image?: string; // Image URL from metadata
  group?: string; // Group address (or undefined)
  mint: string;
  seller: string;
  price: string;
  listing: string;
  jsonURI?: string; // The URI to fetch metadata from
}

const trimAddress = (address: string) =>
  `${address.slice(0, 4)}...${address.slice(-4)}`;

const Closet: React.FC = () => {
  const { publicKey } = useWallet();
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [assets, setAssets] = useState<NFTDetail[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const wallet = useAnchorWallet();
  const { connection } = useConnection();

  useEffect(() => {
    const storedWalletAddress = sessionStorage.getItem("walletAddress");
    const storedAssets = sessionStorage.getItem("assets");

    if (storedWalletAddress) {
      setWalletAddress(storedWalletAddress);
    }

    if (storedAssets) {
      setAssets(JSON.parse(storedAssets));
    }
    fetchNFTs();
  }, []);

  useEffect(() => {
    fetchNFTs();
  }, [wallet]);

  useEffect(() => {
    sessionStorage.setItem("walletAddress", walletAddress);
  }, [walletAddress]);

  useEffect(() => {
    sessionStorage.setItem("assets", JSON.stringify(assets));
  }, [assets]);

  const fetchNFTs = async () => {
    setIsLoading(true);
    const provider = new AnchorProvider(connection, wallet as Wallet, {});

    try {
      const listings = await getNFTList(provider, connection);
      
      // Map through listings and get NFT details and metadata
      const promises = listings.map(async (list) => {
        const mint = new PublicKey(list.mint);
        const nftDetail = await getNFTDetail(mint, connection, list.seller, list.price, list.pubkey);
        
        // Fetch metadata from jsonURI if available
        if (nftDetail.jsonURI) {
          try {
            const metadataResponse = await axios.get(nftDetail.jsonURI);
            const metadata = metadataResponse.data.record || metadataResponse.data; // Adjust based on your metadata structure
            
            return {
              ...nftDetail,
              name: metadata.name || nftDetail.name,
              description: metadata.description || nftDetail.description,
              image: metadata.image || "", // Extract image from metadata
            };
          } catch (error) {
            console.error("Error fetching metadata:", error);
          }
        }

        // Return only if group address is empty or undefined
        if (!nftDetail.group || nftDetail.group === "") {
          return nftDetail;
        }
        return null; // Skip NFTs with group addresses
      });
      
      // Filter out null values and update state
      const detailedListings = (await Promise.all(promises)).filter(Boolean);
      setAssets(detailedListings as NFTDetail[]);
    } catch (errr) {
      console.log(errr);
      setError("Failed to fetch assets");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 pt-20 bg-white dark:bg-black min-h-screen">
      <h1 className="text-3xl font-bold mb-4 text-center text-black dark:text-white">
      NFTs For Sale
 
      </h1>

      {error && <div className="text-red-500 text-center mb-4">{error}</div>}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <Card key={index}>
              <Skeleton className="h-64 w-full mb-4" />
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </Card>
          ))}
        </div>
      ) : assets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {assets.map((asset: NFTDetail) => (
            <div
              key={asset.mint}
              className="relative p-4 border rounded shadow hover:shadow-lg transition-transform transform hover:scale-105 cursor-pointer bg-white dark:bg-black group"
            >
              <Link href={`/marketplace/${asset.mint}`}>
                <div className="relative h-64 w-full mb-4">
                  {asset.image ? (
                    <Image
                      src={asset.image}
                      alt={`${asset.name || "Unknown NFT"} Image`} 
                      layout="fill"
                      objectFit="contain"
                      className="rounded"
                    />
                  ) : (
                    <p>No Image Available</p>
                  )}
                </div>
              </Link>

              <div className="text-black dark:text-white text-sm mb-2">
                <p className="font-semibold">
                  {asset.name || "Unknown"} ({asset.symbol})
                </p>
                <p>{asset.description || "No description available"}</p>
              </div>

              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-opacity flex flex-col justify-end items-center opacity-0 group-hover:opacity-100 text-white text-xs p-2">
                <p className="font-semibold">{asset.name || "Unknown"}</p>
                <Link
                  href={`https://solana.fm/address/${asset.mint}`}
                  target="_blank"
                  className="hover:text-gray-300 flex items-center"
                >
                  {trimAddress(asset.mint)}{" "}
                  <FaExternalLinkAlt className="ml-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <h2 className="text-2xl font-bold mb-4 text-center text-red-500 dark:text-yellow">
          NFTs For Sale
        </h2>
      )}
    </div>
  );
};

export default Closet;

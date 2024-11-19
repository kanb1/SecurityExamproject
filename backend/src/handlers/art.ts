import { Request, Response } from "express";
import prisma from "../db"

export interface Artwork {
    id: string; // Matches `String` in Prisma
    artist: string;
    title: string;
    image: string;
    technique: string;
    production_date: string;
}

// Fetch art from database
export const artworksAreFetchedFromDB = async (req: Request, res: Response) => {
    try {
        const artworks: Artwork[] = await prisma.artwork.findMany({
            take: 20, // Limit to 20 artworks
        });
        res.json(artworks);
    } catch (error) {
        console.error("Error fetching artworks:", error);
        res.status(500).json({ error: "Failed to fetch artworks" });
    }
};
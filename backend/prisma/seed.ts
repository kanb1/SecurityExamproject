import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const smkApi = process.env.SMK_API;

// interface ArtworkItem {
//     object_number: string;
//     artist: string;
//     titles: { title: string }[];
//     image_thumbnail: string;
//     techniques: string;
//     production_date: { start: string, end: string, period: string }[];
// }

export const fetchArt = async () => {
    try {
        if (!smkApi) {
            throw new Error('SMK_API environment variable is not set.');
        }

        // Fetch data from the SMK API
        const response = await axios.get(smkApi);
        
        // Check if the response contains items
        if (!response.data || !response.data.items) {
            throw new Error('Invalid response format from the API');
        }

        // Map response data to fit your database model
        const artworks = response.data.items.map((item: any) => ({
            id: item.object_number,
            artist: item.artist?.[0] || 'Unknown Artist', // Safely access artist
            title: item.titles?.[0]?.title || 'Untitled',  // Safely access title
            image: item.image_thumbnail,
            technique: item.techniques?.[0] || 'Unknown Technique', // Safely access technique
            production_date: item.production_date?.[0]?.period || 'Unknown Date', // Safely access production date
        }));

        // Insert artworks into the database in bulk
        const upsertPromises = artworks.map((artwork) =>
            prisma.artwork.upsert({
                where: { id: artwork.id },
                update: {
                    artist: artwork.artist,
                    title: artwork.title,
                    image: artwork.image,
                    technique: artwork.technique,
                    production_date: artwork.production_date,
                },
                create: {
                    id: artwork.id,
                    artist: artwork.artist,
                    title: artwork.title,
                    image: artwork.image,
                    technique: artwork.technique,
                    production_date: artwork.production_date,
                },
            })
        );

        // Wait for all upserts to complete
        await Promise.all(upsertPromises);
        console.log(`${artworks.length} artworks have been processed.`);
    } catch (error) {
        console.error("Error fetching or inserting artworks: ", error);
    } finally {
        await prisma.$disconnect();
    }
};

fetchArt();
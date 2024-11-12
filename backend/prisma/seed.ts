import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// interface ArtworkItem {
//     object_number: string;
//     artist: string;
//     titles: { title: string }[];
//     image_thumbnail: string;
//     techniques: string;
//     production_date: { start: string, end: string, period: string }[];
// }

const smkApi = process.env.SMK_API;

const fetchArt = async () => {
    try {
        // Fetch data from the SMK API
        //const response = await axios.get<{ items: ArtworkItem[] }>(smkApi);
        const response = await axios.get(smkApi);
        
        // Map response data to fit your database model
        const artworks = response.data.items.map(item => ({
            id: item.object_number,
            artist: item.artist[0] || 'Unknown Artist', // Safely access artist
            title: item.titles[0].title || 'Untitled',        // Safely access title
            image: item.image_thumbnail,
            technique: item.techniques[0] || 'Unknown Technique', // Safely access technique
            production_date: item.production_date[0].period || 'Unknown Date', // Safely access production date
        }));

        // Insert artworks into the database
        for (const artwork of artworks) {

            await prisma.artwork.upsert({
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
            });
        }
    } catch (error) {
        console.error("Error fetching or inserting artworks: ", error);
    } finally {
        await prisma.$disconnect();
    }
};

export default fetchArt;
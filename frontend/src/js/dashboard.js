"use strict";

async function fetchArtworks() {
   
    try {
        const response = await fetch('http://localhost:3002/artworks', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch artworks');
        }

        const artworks = await response.json();

        // Display artworks
        const artworksContainer = document.getElementById('artworks-container');
        artworksContainer.innerHTML = '';

        artworks.forEach(artwork => {
            const artworkElement = document.createElement('div');
            artworkElement.classList.add('artwork');
            artworkElement.innerHTML = `
                <img style="width: 300px; height: auto;" src="${artwork.image}" alt="${artwork.title}">
                <h3>Title: ${artwork.title}</h3>
                <p>Technique: ${artwork.technique}</p>
                <p>Production: ${artwork.production_date}</p>
            `;
            artworksContainer.appendChild(artworkElement);
        });

    } catch (error) {
        console.error(error);
    }
}




window.addEventListener("DOMContentLoaded", () => {
   // fetchArtworks();
})

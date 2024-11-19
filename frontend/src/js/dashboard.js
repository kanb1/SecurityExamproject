"use strict";

document.addEventListener('DOMContentLoaded', () => {
    // Retrieve the user from sessionStorage
    const user = JSON.parse(sessionStorage.getItem('user'));

    if (!user) {
        // Redirect to login if no user is stored
        window.location.href = 'login.html';
        return;
    }

    // Show admin-specific functionality
    if (user.role === 'ADMIN') {
        const adminParagraph = document.querySelector('.adminReference');
        adminParagraph.textContent = `Welcome, admin god, ${user.username}!`;
    } else {
        const userParagraph = document.querySelector('.userReference');
        userParagraph.textContent = `Welcome, user peasant, ${user.username}!`;
    }
});

// if user is user, fetch artworks

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

// if user is admin, fetch users

async function fetchUsers() {
    try {
        const response = await fetch('http://localhost:3002/users', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }
        const users = await response.json();
        // Display users
        const usersContainer = document.getElementById('usersContainer');
        usersContainer.innerHTML = '';
        users.forEach(user => {
            const userElement = document.createElement('div');
            userElement.classList.add('user');
            userElement.innerHTML = `
                <h3>Username: ${user.username}</h3>
                <p>Email: ${user.email}</p>
            `;
            usersContainer.appendChild(userElement);
        });
    }
    catch (error) {
        console.error(error);
    }
}





window.addEventListener("DOMContentLoaded", () => {
   // fetchArtworks();
})

"use strict";

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Fetch user data securely from the server
        const response = await fetch('http://localhost:3002/dashboard', { credentials: 'include' });

        if (!response.ok) {
            window.location.href = 'login.html';
            return;
        }

        const user = await response.json();

        // Show role-specific functionality
        const userParagraph = document.querySelector('.userReference');
        userParagraph.textContent = `Welcome, ${user.role === 'ADMIN' ? 'admin god' : 'user peasant'}, ${user.username}!`;

        if (user.role === 'ADMIN') {
            fetchUsers(); // Fetch users only if admin
        }
    } catch (error) {
        console.error('Error fetching user:', error);
        window.location.href = 'login.html';
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
        const response = await fetch('http://localhost:3002/admin/users', { credentials: 'include' },
            {
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
        const usersContainer = document.querySelector('.userList');
        users.forEach(user => {
            const userElement = document.createElement('li');
            userElement.classList.add('user');
            userElement.textContent = `
                Username: ${user.username} - Email:  ${user.email} - Role: ${user.role}
            `;
            usersContainer.appendChild(userElement);
        });
    }
    catch (error) {
        console.error(error);
    }
}



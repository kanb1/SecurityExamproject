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
        userParagraph.textContent = `Welcome home, ${user.role === 'ADMIN' ? 'my god' : 'user peasant'}, ${user.username}!`;

        if (user.role === 'ADMIN') {
            fetchUsers(); // Fetch users only if admin
            fetchArtworks();
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
        const artworksList = document.querySelector('.artworkList');
        artworksList.classList.add('artworkList');

        artworks.forEach(artwork => {
            const artworkElement = document.createElement('li');
            artworkElement.classList.add('artworkLi');
            const artworkImage = document.createElement('img');
            artworkImage.src = artwork.image;
            const artworkTitle = document.createElement('h3');
            artworkTitle.textContent = `${artwork.title}`;
            const artworkTechnique = document.createElement('p');
            artworkTechnique.textContent = `Technique: ${artwork.technique}`;
            const artworkYear = document.createElement('p');
            artworkYear.textContent = `Production: ${artwork.production_date}`;

            artworkElement.appendChild(artworkImage)
            artworkElement.appendChild(artworkTitle);
            artworkElement.appendChild(artworkTechnique);
            artworkElement.appendChild(artworkYear);
            
            artworksList.appendChild(artworkElement);
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
            userElement.classList.add('userLi');
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



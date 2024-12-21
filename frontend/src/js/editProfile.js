"use strict";

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Fetch user data securely from the server
        const response = await fetch('http://localhost:3002/api/userprofile', { credentials: 'include' });

        if (!response.ok) {
            window.location.href = 'login.html';
            return;
        }

        const user = await response.json();
        console.log(user);

        // form to change data
        const form = document.getElementById('edit-profile-form');
        // username
        const usernameInput = document.getElementById('username');
        usernameInput.placeholder = user.username;
        // email
        const emailInput = document.getElementById('email');
        emailInput.placeholder = user.email;
        // password
        const passwordInput = document.getElementById('password');
        passwordInput.placeholder = "Enter new password";
        // confirm password
        const confirmPasswordInput = document.getElementById('confirm-password');
        confirmPasswordInput.placeholder = "Confirm new password";

        // submit button
        const submitButton = document.getElementById('submit-button');


        // Dynamically update the navigation links
        updateNavLinks();

    } catch (error) {
        console.error('Error fetching user:', error);
        window.location.href = 'login.html';
    }
});

// Function to log out the user
async function logout() {
    try {
        // Call the backend to clear the token securely
        const response = await fetch('http://localhost:3002/api/logout', { method: 'POST', credentials: 'include' });

        if (response.ok) {
            alert("Logged out successfully!");
            window.location.href = "login.html";
        } else {
            alert("Logout failed. Please try again.");
        }
    } catch (error) {
        console.error('Error logging out:', error);
    }
}

// Dynamically update the navigation links
function updateNavLinks() {
    const navLinks = document.getElementById('nav-links');

    // Create a new <li> for Logout
    const logoutLi = document.createElement('li');
    const logoutLink = document.createElement('a');
    logoutLink.href = "#";
    logoutLink.textContent = "Logout";
    logoutLi.classList.add('logout');
    logoutLink.addEventListener('click', function (event) {
        event.preventDefault();
        logout();
    });

    logoutLi.appendChild(logoutLink);

    // Append the Logout link to the nav list if not already present
    if (!document.querySelector('#nav-links a[href="#logout"]')) {
        logoutLink.id = 'logout';
        navLinks.appendChild(logoutLi);
    }
}




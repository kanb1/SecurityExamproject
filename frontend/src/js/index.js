"use strict";

async function signUp(event) {
    event.preventDefault(); // Prevent form submission

    // Clear previous error messages
    document.querySelectorAll('.error-message').forEach(el => {
        el.classList.remove('show-error');
        el.textContent = '';
    });

    const formData = new FormData(signUpForm);

    try {
        const username = sanitizeInput(formData.get('username').trim());
        const email = sanitizeInput(formData.get('email').trim());
        const password = sanitizeInput(formData.get('password').trim());
        const repeat_password = sanitizeInput(formData.get('repeat_password').trim());

        // Simple empty check
        if (!username || !email || !password || !repeat_password) {
            document.getElementById('username-error').textContent = 'Please fill in all fields';
            document.getElementById('username-error').classList.add('show-error');
            return; // Exit if fields are empty
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            document.getElementById('email-error').textContent = 'Invalid email address';
            document.getElementById('email-error').classList.add('show-error');
            return;
        }

        console.log("Sending email:", email);
        const response = await fetch('http://localhost:3002/check-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });

        const result = await response.json();
        if (response.status !== 200) {
            document.getElementById('email-already-exists-error').textContent = result.message;
            document.getElementById('email-already-exists-error').classList.add('show-error');
            return;
        }

        if (password !== repeat_password) {
            document.getElementById('repeat-password-error').textContent = 'Passwords do not match';
            document.getElementById('repeat-password-error').classList.add('show-error');
            return;
        }

        const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=_]).{8,}$/;
        if (!passwordPattern.test(password)) {
            document.getElementById('password-error').textContent = 'Password must be at least 8 characters long, include uppercase, lowercase, digit, and special character';
            document.getElementById('password-error').classList.add('show-error');
            return;
        }

        // If all checks pass, form is valid
        console.log("Form is valid!");

    } catch (error) {
        console.error(error);
    }
}

const signUpForm = document.getElementById('signUpForm');
signUpForm.addEventListener('submit', signUp);

function sanitizeInput(input) {
    return input.replace(/[&<>"']/g, function(match) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[match];
    });
}
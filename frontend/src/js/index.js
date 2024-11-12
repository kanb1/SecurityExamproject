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
        const username = formData.get('username');
        const email = formData.get('email');
        const password = formData.get('password');
        const repeat_password = formData.get('repeat_password');

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

        if (password !== repeat_password) {
            document.getElementById('repeat-password-error').textContent = 'Passwords do not match';
            document.getElementById('repeat-password-error').classList.add('show-error');
            return;
        }

        const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=_]).{8,}$/;
        if (!passwordPattern.test(password)) {
            document.getElementById('password-error').textContent = 
                'Password must be at least 8 characters long, include uppercase, lowercase, digit, and special character';
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
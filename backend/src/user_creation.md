How does a user sign up?

A user fills in the form
We do frontend validation
    -sanitize the inputs
    -no empty cells
    -passwords match
    -email is valid

We check if the email is already in the database

If all of this is ok:
-hash the password
-insert the user into the database
-send a confirmation email
-send a success message
-redirect to login page


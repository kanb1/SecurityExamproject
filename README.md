**What is this about?**
Webshop der sælger bøger (ting)

tools and technologies:

**Frontend**
Vanilla js
vanilla css

Why? To not automate security issues, and handle them manually like a real person

**Backend**
Express  js
explore helmet and CORS

Why?
We can create routes with express and create our own middleware and authorization functions to show we know what we are talking about 
we can protect the headers and CORS

**Database**
Postgres (med Prisma ??)

Why?
Because we are selling books, the users can search between authors, types of books, titles. So we have relations

----

Features / things our app should have/handle

Users (users har forskellige slags permissions / admin - normal bruger - non-logged visitor)
Books (table in postgres)
sale order

----

I forhold til sikkerhed:

-go through his slides and start making a list of MUSTS  we have to show 
- TOP 10 OWASP most common attacks (how are we protecting against them)
- architectural sikkerhed and how we thought about problems during the design phase (prior to development)
- testing (testing methods and so on..)
- github dependebot what we talked about today between github and apps
- where to deploy (good things about it / problems?)

- Secure Application Configuration (WAS Kapitel 22):
-   Content Security Policy: One of the browser's primary security mechanisms for protecting against the most common forms of cyberattacks involving a browser client.
-   Cross Origin Resource Sharing (CORS)
-   Headers:
-     **Strict Transport Security**: The HTTP Strict Transport Security header informs the browser that a web page should only be loaded over HTTPS and that future HTTP requests should be "upgraded" to HTTPS.
-     HSTS is the preferred mechanism for forcing requests to make use of SSL/TLS because 201 redirects require an initial HTTP request, which can be vulnerable to man-in-the-middle attacks.
-     **Cross Origin Opener Policy(COOP)**: Setting the COOP header to "same-origin" prevents new tabs, windows, or other browsing contexts from being able to navigate back to the opening context.
-     This is a large security  boon because it prevents unintended information leakage.
-     **Cross origin Resource Policy (CORP)**: Set it to "same-origin" to restrict read to same-origin (protocol/scheme, domain, port)

-   Cookies:
-     HttpOnly: prevent javascript code from being able to read the cookie
-     SameSite: set to "strict", to allows a cookie to only be sent from the site that generated it
-     Secure: it prevents the cookie from being sent over unencrypted network calls.

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

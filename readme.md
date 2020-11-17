# AmazonTheraputicsBlog
Blog about Amazon's Natural Medicines

## Requirements
1. NodeJS
1. ExpressJS
1. EJS
1. Bootstrap
1. Mongoose
1. Mongo Database

## Initial Set Up - CRUD
npm init
npm express mongoose ejs
Create blog post model
seed the database with data to work with
Create index page, show page plus routes
Create new blogpost form and edit blogpost form plus routes
npm install in order to use PUT & DELETE html verbs
Create delete blogpost route

## Basic styles
Ejs-mate layout
Bootstrap
Navbar partial
Footer partial
Add image to model and use a url for image for now (will add ability to upload image later)
Add grid to current pages

## Errors & Validating data - check if all forms are filled in before the data goes to the database
Add in HTML and Bootstrap form validations
Set up generic error handler
Define the ExpressError and catchAsync clasess within their own files and then export
Use ExpressError on necessary routes
Create an error template to display user-friendly error message
Install JOI for server-side validations: npm i joi
Create Joi schemas and pass through data
Create Joi validation middleware

## Restructuring
Create new folder for routes
Add blogposts routes to new file and import into app.js

## Serve static assests
Create public directory
Tell app.js to serve public directory
Move bootstrap validateForms script into its own file in public directory

## Configure session
Install and require Express Session
Configure session
Give cookie expiration and max age

## Adding Flash
Install Flash: npm i connect-flash
Require Flash and use
Create flash message template in partials folder
Insert flash message into boilerplate

## Add Authentication
Install Passport, Passport-Local, & Passport-Local-Mongoose
Create user file in models and create user schema
Configure passports in app.js
Create user.js file in routes folder
Create register routes and register form page
Create login routes and login form page
Create middelware to check if a user is logged in to access the create new an edit blogposts

## Authorization
Add author to blogpost model
Update show page
Populate author
Update show page to show author
Update edit & delete buttons to show if blogpost belongs to current user
Create middelware to check if post belongs to the current user
Move blogpost middlware to middleware file and export

## Refactor routes
Add controller folder and refactor routes








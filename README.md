# Overview

This scheduling application is a project I put together to grow my understanding and knowledge of Node.js and Cloud Databases such as MongoDB. This idea came to me because I am currently volunteering as a secretary for a local non-profit organization. I hope to use this application in my work to simplify the scheduling process.

This app will track multiple schedules for individuals inside of your organization. It is set up to add future appointments, view past appointments, and delete meetings that need to be rescheduled. Multiple profiles can be configured to allow for multi-tier organizations to use this application. To get started with modifying this project, create a fork, clone the code onto your local computer, and run "npm install" inside your terminal. After the installation is succesful, create a .env file with your MongoDB connection string inside. After installing all the packages and configuring your .env file, run "npm start" and open [localhost:5050](http://localhost:5050/) in the browser of your choice.

[Application Walkthrough](https://youtu.be/FfZ8x2JkUuU)

# Web Pages

The authentication pages are straightforward. The Register and Login pages both contain a form for the respective action that will take place and feature a dynamic header that will change whether you are logged in or not.

The schedule pages include anything with '/schedule/ in the url. These pages contains forms and load data stored in a database. The Profile data and schedule information is all stored in a MongoDB database and is generated with the html template or sent as a JSON object from the server.

# Development Environment

The most prevelant libraies or frameworks I used are Node.js, express, mongoose, and csurf. Node.js was used to organize everything with the package manager and build the server. I used express to handle all the routes and a few other components. Mongoose was implemented to easily manage the connection with MongoDB and build the database. Finally the csurf library was used to help with security and authentication.

# Useful Websites

- [Node.js Docs](https://nodejs.org/en/docs/)
- [MDN Web Docs](https://developer.mozilla.org/en-US/)
- [Environment Variables Walkthrough](https://www.mariokandut.com/how-to-set-up-and-test-a-dot-env-file-in-node-js/)

# Future Work

- Implement edit feature for Profiles, appointments, and Organizations
- Change appointment creation to use an API endpoint
- Implement automation to delete/archive appointments after a month has passed
- Turn Profiles into a full user system within each Organization

// import useful libraries and frameworks
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

// import necessary files
const authRoutes = require('./routes/auth-routes');

// set up the server
const app = express();

// set up the views folder and engine
app.set('view engine', 'ejs');
app.set('views', 'views');

// set up the body parser for handling form data
// submitted by the user
app.use(bodyParser.urlencoded({ extended: false }));

// set up public static file
app.use(express.static(path.join(__dirname, 'public')));

app.use(authRoutes);

app.get('/', (req, res, next) => {
  res.render('home', {
    pageTitle: 'Home',
    msg: 'Welcome to the Scheduling App!',
  });
});

app.listen(5050);
console.log('Listening on 5050');

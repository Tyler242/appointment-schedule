// import necessary libraries
const bcrypt = require('bcryptjs');

// import necessay files
const OrgAccount = require('../models/org');

// /login => GET
exports.getLogin = (req, res, next) => {
  res.render('login', {
    pageTitle: 'Login',
    isAuthenticated: false,
  });
};

// /login => POST
exports.postLogin = (req, res, next) => {
  const orgId = req.body.orgId;
  const pass = req.body.password;

  //   find the org account
  OrgAccount.findOne({ orgId: orgId })
    .then((org) => {
      //   if no organization with that id was found, redirect to /login
      if (!org) {
        console.log('No organization with that id found');
        return res.redirect('/login');
      }
      // compare the password if the stored password
      bcrypt
        .compare(pass, org.password)
        .then((isMatch) => {
          // if the passwords match, set up the session
          if (isMatch) {
            req.session.isLoggedIn = true;
            req.session.org = org;
            return req.session.save((err) => {
              console.log(err);
              // if the user is successfully authenticated,
              // redirect them to the schedule app
              res.redirect('/schedule');
            });
          }
          //   if the passwords do not match, redirect to /login
          console.log('Invalid credentials.');
          return res.redirect('/login');
        })
        .catch((err) => {
          console.log(err);
          res.redirect('/login');
        });
    })
    .catch((err) => {
      console.log(err);
      res.redirect('/login');
    });
};

// /register => GET
exports.getRegister = (req, res, next) => {
  res.render('register', {
    pageTitle: 'Register',
    isAuthenticated: false,
  });
};

// /register => POST
exports.postRegister = (req, res, next) => {
  //   get form data
  const orgName = req.body.name;
  const orgId = req.body.orgId;
  const pass = req.body.password;
  const confirmPass = req.body.confirmPassword;

  // create a new organization account only if the passwords match
  if (pass !== confirmPass) {
    console.log('Unable to create account.');
    return res.redirect('/register');
  }

  //   encrypt the password and create the account
  bcrypt
    .hash(pass, 12)
    .then((result) => {
      // create new account with the hashed password
      const org = new OrgAccount({
        name: orgName,
        orgId: orgId,
        password: result,
      });
      return org.save();
    })
    .then((result) => {
      return res.redirect('/login');
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

// /logout => POST
exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect('/');
  });
};

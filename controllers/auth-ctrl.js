// /login => GET
exports.getLogin = (req, res, next) => {
  res.render('login', {
    pageTitle: 'Login',
  });
};

// /login => POST
exports.postLogin = (req, res, next) => {
  const orgId = req.body.orgId;
  const pass = req.body.password;

  console.log(`orgId: ${orgId}, password: ${pass}`);

  res.redirect('/');
};

// /register => GET
exports.getRegister = (req, res, next) => {
  res.render('register', {
    pageTitle: 'Register',
  });
};

// /register => POST
exports.postRegister = (req, res, next) => {
  //   get form data
  const orgId = req.body.orgId;
  const pass = req.body.password;
  const confirmPass = req.body.confirmPassword;

  console.log(`orgId: ${orgId}, password: ${pass}`);

  if (pass === confirmPass) {
    console.log('Account created successfully!');
  } else {
    console.log('Passwords do not match!');
  }

  res.redirect('/');
};

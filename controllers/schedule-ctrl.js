/** Handling routes to /schedule */
// import necessary libraries

// import necessary files
const OrgAccount = require('../models/org');
const Profile = require('../models/profile');

// /schedule => GET
exports.getSchedule = (req, res, next) => {
  res.redirect('/schedule/profile');
};

// //schedule/profile => GET
exports.getProfile = (req, res, next) => {
  // if we are editing an existing profile, we will
  // need to search the db for the info.
  let editing = false;

  // autofill form data if we are in edit mode
  if (editing) {
    res.render('schedule/profile', {
      oldInput: {
        fname: 'Bill',
        lname: 'Burr',
        phone: 1234567890,
        position: 'Bishop',
      },
    });
    // leave form empty if we are not in edit mode
  } else {
    res.render('schedule/profile', {
      oldInput: {
        fname: '',
        lname: '',
        phone: '',
        position: '',
      },
    });
  }
};

// /schedule/profile => POST
// adding or editing a profile
exports.postProfile = (req, res, next) => {
  // get form data
  const fname = req.body.fname;
  const lname = req.body.lname;
  const phone = req.body.phone;
  const position = req.body.position;
  const available = {
    sun: req.body.Sunday,
    mon: req.body.Monday,
    tue: req.body.Tuesday,
    wed: req.body.Wednesday,
    thu: req.body.Thursday,
    fri: req.body.Friday,
    sat: req.body.Saturday,
  };

  for (var key of Object.keys(available)) {
    if (available[key] === undefined) {
      available[key] = false;
    }
  }

  // add the new profile to the database
  const newProfile = new Profile({
    fname: fname,
    lname: lname,
    phone: phone,
    availability: {
      days: {
        sun: available.sun,
        mon: available.mon,
        tue: available.tue,
        wed: available.wed,
        thu: available.thu,
        fri: available.fri,
        sat: available.sat,
      },
    },
    position: position,
  });

  newProfile.save();

  console.log(newProfile);

  res.redirect('/schedule/profile');
};

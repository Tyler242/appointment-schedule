/** Handling routes to /schedule */
// import necessary libraries

// import necessary files
const OrgAccount = require('../models/org');
const Profile = require('../models/profile');
const Schedule = require('../models/schedule');

// /schedule => GET
exports.getSchedule = (req, res, next) => {
  // get all profiles for this organization
  Profile.find({ orgId: req.org._id })
    .then((profiles) => {
      // send all of the profiles to the template
      res.render('schedule/schedule', {
        pageTitle: 'Schedule',
        orgName: req.org.name,
        isAuthenticated: req.session.isLoggedIn,
        profiles: profiles,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

// //schedule/profile => GET
exports.getProfile = (req, res, next) => {
  // if we are editing an existing profile, we will
  // need to search the db for the info.
  let editing = false;

  // autofill form data if we are in edit mode
  if (editing) {
    res.render('schedule/profile', {
      editing: false,
      profile: null,
      isAuthenticated: req.session.isLoggedIn,
    });
    // leave form empty if we are not in edit mode
  } else {
    res.render('schedule/profile', {
      editing: false,
      profile: null,
      isAuthenticated: req.session.isLoggedIn,
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
  const orgId = req.org._id;

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
    orgId: orgId,
  });

  newProfile.save();

  // create a new schedule to go with the profile
  const newSchedule = new Schedule({
    schedule: { appointments: [] },
    profileId: newProfile._id,
  });

  newSchedule.save();

  res.redirect('/schedule');
};

// /schedule/add-appointment => POST
exports.postAppointment = (req, res, next) => {
  // get the appointment data from the body

  // format a date object
  const day = req.body.day;
  const time = req.body.start;
  const dateTime = new Date();

  dateTime.setFullYear(day.split('-')[0]);
  dateTime.setMonth(day.split('-')[1] - 1);
  dateTime.setDate(day.split('-')[2]);

  dateTime.setHours(time.split(':')[0]);
  dateTime.setMinutes(time.split(':')[1]);

  // get the remaining form data
  const appointment = {
    dayTime: dateTime,
    duration: req.body.duration,
    name: req.body.name,
    reason: req.body.reason,
    phone: req.body.phone,
  };

  // get the schedule model and save the appointment to the list of appointments
  Schedule.findOne({ profileId: req.body.profile })
    .then((schedule) => {
      if (!schedule) {
        console.log('No matching schedule found');
        return;
      }
      return schedule.addAppointment(appointment);
    })
    .catch((err) => {
      console.log(err);
    });

  res.redirect('/schedule');
};

// Respond with JSON object containing schedule for the day.
exports.getScheduleData = (req, res, next) => {
  const profileId = req.params.profileId;
  const newDate = new Date(req.params.date);
  const dateString = newDate.toLocaleDateString();

  Schedule.findOne({ profileId: profileId })
    .then((sch) => {
      // if no schedule was found
      if (!sch) {
        console.log('No schedule found');
        return;
      }

      // use the filter method to sort through the appointments
      const filteredApnt = sch.schedule.appointments.filter(
        (apt) => apt.dayTime.toLocaleDateString() === dateString
      );

      res
        .status(200)
        .json({ appointments: filteredApnt, profileId: sch.profileId });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getEditProfile = (req, res, next) => {
  // same as add profile but fill the input
  // elements with the existing values
  const editing = req.query.edit;

  // if we are not in edit mode, redirect to /schedule
  if (!editing) {
    console.log('editing = false');
    return res.redirect('/schedule');
  }

  const profileId = req.params.profileId;

  // find the profile in the db
  Profile.findById(profileId)
    .then((profile) => {
      // if the profile was not found
      if (!profile) {
        console.log('No profile found');
        return res.redirect('/schedule');
      }

      // if the profile was found render the view with the old
      // profile data
      res.render('schedule/profile', {
        editing: editing,
        profile: profile,
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};

exports.postEditProfile = (req, res, next) => {};

exports.deleteAppointment = (req, res, next) => {
  // get parameters
  const profileId = req.params.profileId;
  const schId = req.params.schId;

  Schedule.findOne({ profileId: profileId })
    .then((schedule) => {
      // if no schedule was found...
      if (!schedule) {
        console.log('no schedule found.');
        return res.redirect('/schedule');
      }
      return schedule.removeAppointment(schId);
    })
    .then((result) => {
      res.redirect('/schedule');
    })
    .catch((err) => {
      console.log(err);

      res.redirect('/schedule');
    });
};

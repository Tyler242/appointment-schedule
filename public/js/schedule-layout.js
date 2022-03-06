/**
 * Contain the code to get the appointment schedule for each
 * profile and generate the html for them in an order manner
 */

// for each html element where class=schedule, we need to get that
// elements id and then call the api route to get the schedule data.

// replace this base url with url from .env
const baseUrl = 'http://localhost:5050/schedule/load/';

function getElements() {
  /**
   * Get the ids of all the elements with the class name "schedule"
   */
  const scheduleElements = [...document.getElementsByClassName('schedule')];
  scheduleElements.forEach((elem) => {
    let url = baseUrl + elem.id + '/' + getDate();
    // console.log(url);
    getData(url);
  });
}

function getDate() {
  let date = document.getElementById('date-select').value;

  if (date === '' || date === undefined || date === null) {
    //   if no date has been selected, use today's date.
    const dateObj = new Date();

    // format the month correctly
    let monthString = (dateObj.getMonth() + 1).toString();
    if (monthString.length === 1) {
      monthString = '0' + monthString;
    }
    const dateString =
      dateObj.getFullYear() + '-' + monthString + '-' + dateObj.getDate();
    return dateString;
  }

  // configure the date
  const year = date.split('-')[0];
  const month = date.split('-')[1];
  let day = date.split('-')[2];

  // if the day of the month has a leading zero, remove it
  if (day.charAt(0) === '0') {
    day = day.charAt(1);
  }

  const dateString = year + '-' + month + '-' + day;
  return dateString;
}

async function apiFetch(url) {
  const respone = await fetch(url);
  const data = await respone.json();
  return data;
}

const getData = async (url) => {
  const data = await apiFetch(url);
  console.log(data);
  loadData(data);
};

function sortData(data) {
  data.appointments.forEach((item) => (item.dayTime = new Date(item.dayTime)));
  data.appointments.sort((d1, d2) => d1.dayTime - d2.dayTime);
  // console.log(data);
  return data.appointments;
}

function formatTimeString(date) {
  // format the hours and get am or pm
  let hours = date.getHours();
  let amOrPm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour 0 should be 12.

  // format the minutes
  let minutes = date.getMinutes();
  minutes = minutes < 10 ? '0' + minutes : minutes;

  // return the time string
  return hours + ':' + minutes + ' ' + amOrPm;
}

function generateHtml(appointment, profileId) {
  /**
   * .name = name, String, MOBILE
   * .dayTme = starting day and time, Date object, MOBILE
   * .duration = time it will take, int
   * .phone = phone number, String, MOBILE
   * .reason = reason for meeting, String
   */
  const sectionElem = document.createElement('div');
  sectionElem.className = 'appointment';

  // column one
  const divOne = document.createElement('div');
  divOne.className = 'apt-box-1';

  const nameElem = document.createElement('p');
  nameElem.className = 'apt-name';
  nameElem.innerHTML = appointment.name;

  const phoneElem1 = document.createElement('a');
  phoneElem1.className = 'apt-phone1';
  phoneElem1.href = 'tel:' + appointment.phone;
  phoneElem1.innerHTML = appointment.phone;

  divOne.appendChild(nameElem);
  divOne.appendChild(phoneElem1);

  // column two
  const divTwo = document.createElement('div');
  divTwo.className = 'apt-box-2';

  const timeElem = document.createElement('p');
  timeElem.className = 'apt-time';
  timeElem.innerHTML =
    '<b>Start time: </b>' + formatTimeString(appointment.dayTime);

  const durationElem = document.createElement('p');
  durationElem.className = 'apt-duration';
  durationElem.innerHTML = '<b>Duration: </b>' + appointment.duration;

  const detailsBtn = document.createElement('button');
  detailsBtn.className = 'apt-details-btn';
  detailsBtn.id = appointment._id;
  detailsBtn.innerHTML = 'Details';

  divTwo.appendChild(timeElem);
  divTwo.appendChild(durationElem);
  divTwo.appendChild(detailsBtn);

  // column three
  const divThree = document.createElement('div');
  divThree.className = 'apt-box-3';

  // delete form
  const delForm = document.createElement('form');
  delForm.action = '/schedule/delete/' + profileId + '/' + appointment._id;
  delForm.method = 'post';

  // delete button
  const delBtn = document.createElement('button');
  delBtn.className = 'apt-delete';
  delBtn.type = 'submit';
  // delBtn.href = '/schedule/delete/' + appointment._id;
  delBtn.innerHTML = 'Delete';

  // delete csrf token
  const delInput = document.createElement('input');
  delInput.type = 'hidden';
  delInput.name = '_csrf';
  delInput.value = document.getElementById('_csrf').value;

  delForm.appendChild(delBtn);
  delForm.appendChild(delInput);

  const phoneElem2 = document.createElement('a');
  phoneElem2.className = 'apt-phone2';
  phoneElem2.href = 'tel:' + appointment.phone;
  phoneElem2.innerHTML = appointment.phone;

  divThree.appendChild(delForm);
  divThree.appendChild(phoneElem2);

  // reason element
  const reasonElem = document.createElement('p');
  reasonElem.className = 'reason';
  reasonElem.innerHTML = '<b>Reason: </b>' + appointment.reason;

  // add each column to the section
  sectionElem.appendChild(divOne);
  sectionElem.appendChild(divTwo);
  sectionElem.appendChild(divThree);
  sectionElem.appendChild(reasonElem);

  // details button event listener
  detailsBtn.addEventListener('click', () => {
    if (detailsBtn.className !== 'apt-details-btn active') {
      detailsBtn.className = 'apt-details-btn active';
      phoneElem1.style.display = 'block';
      durationElem.style.display = 'block';
      delBtn.style.display = 'block';
      reasonElem.style.display = 'block';
      phoneElem2.style.display = 'none';
      detailsBtn.innerHTML = 'Hide';
    } else {
      detailsBtn.className = 'apt-details-btn';
      phoneElem1.style.display = 'none';
      durationElem.style.display = 'none';
      delBtn.style.display = 'none';
      reasonElem.style.display = 'none';
      phoneElem2.style.display = 'block';
      detailsBtn.innerHTML = 'Details';
    }
  });

  return sectionElem;
}

function loadData(data) {
  // sort the data by time
  if (data.appointments.length > 0) {
    const sortedData = sortData(data);
    profileId = data.profileId;

    // get the div for the content
    const sectionElem = document.getElementById(profileId);

    sortedData.forEach((item) => {
      sectionElem.appendChild(generateHtml(item, profileId));
    });
  } else {
    console.log('No data');
    return;
  }
}

getElements();

// event listeners and functions

function dateButtonControl() {
  // clear previous day data
  const scheduleElem = [...document.getElementsByClassName('schedule')];
  scheduleElem.forEach((elem) => {
    elem.innerHTML = '';
  });
  getElements();
}

document
  .getElementById('date-btn')
  .addEventListener('click', dateButtonControl);

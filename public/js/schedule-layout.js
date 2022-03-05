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
  loadData(data);
};

function sortData(data) {
  data.appointments.forEach((item) => (item.dayTime = new Date(item.dayTime)));
  data.appointments.sort((d1, d2) => d1.dayTime - d2.dayTime);
  // console.log(data);
  return data.appointments;
}

function generateHtml(appointment, parentElem) {
  /**
   * .name = name, String, MOBILE
   * .dayTme = starting day and time, Date object, MOBILE
   * .duration = time it will take, int
   * .phone = phone number, String, MOBILE
   * .reason = reason for meeting, String
   */
  const sectionElem = document.createElement('div');
  sectionElem.className = 'appointment';

  const nameElem = document.createElement('p');
  nameElem.className = 'apt-name';
  nameElem.innerHTML = appointment.name;

  const timeElem = document.createElement('p');
  timeElem.className = 'apt-time';
  timeElem.innerHTML =
    appointment.dayTime.getHours() + ':' + appointment.dayTime.getMinutes();

  const phoneElem = document.createElement('p');
  phoneElem.className = 'apt-phone';
  phoneElem.innerHTML = appointment.phone;

  // add all the info to the section
  sectionElem.appendChild(nameElem);
  sectionElem.appendChild(timeElem);
  sectionElem.appendChild(phoneElem);
  return sectionElem;
}

function loadData(data) {
  // sort the data by time
  if (data.appointments.length > 0) {
    const sortedData = sortData(data);

    // get the div for the content
    const sectionElem = document.getElementById(data.profileId);

    sortedData.forEach((item) => {
      sectionElem.appendChild(generateHtml(item, sectionElem));
    });
  } else {
    console.log('No data');
    return;
  }
}

getElements();

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

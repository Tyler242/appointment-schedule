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
    console.log(url);
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

    return dateObj.getFullYear() + '-' + monthString + '-' + dateObj.getDate();
  }
  return date;
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

function loadData(data) {
  console.log(data);
}

getElements();

document.getElementById('date-btn').addEventListener('click', getElements);

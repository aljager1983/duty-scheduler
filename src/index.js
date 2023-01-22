



//Keeps track which month were on, if you want to view the previous month, nav will be set to -1. And 
// +1 for next month.
let nav = 0;

//which ever day weve clicked on
let clicked = null;

//events piece of state, to be pulled from localstorage
//we need to call JSON.parse store objects
//we need to confirm that this object actually resides in localstorage before calling json.parse
//if it does not exists, gives and empty array "[]""
let events = localStorage.getItem( 'events') ? JSON.parse(localStorage.getItem('events')) : [];

//below helps how many and where the padding days will be
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

//access the calendar in the DOM
const calendar = document.getElementById('calendar');

function load() {
  const dt = new Date();

  const day = dt.getDate();

  //throws 0 for january since date is in index value like in array
  const month = dt.getMonth();
  const year = dt.getFullYear();
  
  //identifies the first day of the month
  const firstDayOfMonth = new Date(year, month, 1);
  
  //below codes lists the last day of the month i.e. month + 1 = January
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  //local date formatting
  const dateString = firstDayOfMonth.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric', 
    month: 'numeric',
    day: 'numeric'
  });

  //getting the padding days, splitting the weekdays to the date e.g. Sunday "," 1/1/2023
  const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);

  //for loop for the paddingDays to be rendered, wraps if reached the last day
  for(let i = 1; i <= paddingDays + daysInMonth; i++) {
    //div element to be created in the html
    const daySquare = document.createElement('div');
    //create class named day
    daySquare.classList.add('day');

    //if logic for rendering either a padding day or actual day square for days
    if(i > paddingDays) {
      //gives the number for the current square its on
      daySquare.innerText = i - paddingDays;

      //eventlistener for whenerver the user clicks on it (can run a function when a user clicks on it)
      daySquare.addEventListener('click', () => console.log('clicked'));
    } else {
      daySquare.classList.add('padding');
    }
    //generate the square
    calendar.appendChild(daySquare);

  }
  console.log(paddingDays);
}

load();





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



//access the calendar in the DOM
const calendar = document.getElementById('calendar');

const newEventModal = document.getElementById('newEventModal');
const deleteEventModal = document.getElementById('deleteEventModal');
const backDrop = document.getElementById('modalBackDrop');
const eventTitleInput = document.getElementById('eventTitleInput');


//below helps how many and where the padding days will be
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

//Opens a model everytime a click event,, accepts date as an argument-- because
//we need to know which date the user clicked on before we show modal
//because when they create the event and we save the event, we need to know which date
//the event is for
function openModal(date) {
  clicked = date;

  //checking for existing events
  const eventForDay = events.find(e => e.date === clicked);

  if(eventForDay) {
    //1. set the event text (re: deleting entry in the calendar)
    document.getElementById('eventText').innerText = eventForDay.title;
    deleteEventModal.style.display = 'block';
  } else {
    newEventModal.style.display = 'block';
  }
  backDrop.style.display = 'block';
}

function load() {
  const dt = new Date();

  //checking for the value of nav to display the correct month
  if(nav !== 0) {
    dt.setMonth(dt.getMonth() + nav);
   
  };

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

  //displaying the current month in the frontend
  //backticks to capture the month and year using string interpolation
  document.getElementById('monthDisplay').innerText = `${dt.toLocaleDateString('en-US', {month: 'long'})} ${year}`;

  //clearing the divs, squares and other elements of the previous calendar div 
  calendar.innerHTML = '';

  //for loop for the paddingDays to be rendered, wraps if reached the last day.
  //additionally we are the adding the saved events in the days in this for-loop
  //inside the if statements
  for(let i = 1; i <= paddingDays + daysInMonth; i++) {
    //div element to be created in the html
    const daySquare = document.createElement('div');
    //create class named day
    daySquare.classList.add('day');

    //string for the days 
    const dayString = `${month + 1}/${i - paddingDays}/${year}`;
    //if logic for rendering either a padding day or actual day square for days
    if(i > paddingDays) {
      //gives the number for the current square its on
      daySquare.innerText = i - paddingDays;

      //const for the newly saved events
      const eventForDay = events.find(e => e.date === dayString);

      //current day checking and to be highlighted for the current month(nav === 0)
      if(i - paddingDays === day && nav === 0) {
        daySquare.id = 'currentDay';
      }

      if(eventForDay)  {
        const eventDiv = document.createElement('div');
        eventDiv.classList.add('event')
        eventDiv.innerText = eventForDay.title;
        daySquare.appendChild(eventDiv);
      }

      //eventlistener for whenerver the user clicks on it (can run a function when a user clicks on it)
      daySquare.addEventListener('click', () => openModal(dayString));
    } else {
      daySquare.classList.add('padding');
    }
    //generate the square
    calendar.appendChild(daySquare);

  }
}

//close modal functions
function closeModal() {
  eventTitleInput.classList.remove('error');
  newEventModal.style.display = 'none';
  deleteEventModal.style.display = 'none';
  backDrop.style.display = 'none';
  eventTitleInput.value = ' ';
  clicked = null;
  load();
}

//save event
function saveEvent() {
  if(eventTitleInput.value) {
    eventTitleInput.classList.remove('error');

    //pusing the value in array, saving them
    events.push({
      date: clicked,
      title: eventTitleInput.value,
    });
    localStorage.setItem('events', JSON.stringify(events));
    closeModal();
  }else{
    eventTitleInput.classList.add('error');
  }
}

//function for deleting event entered inthe calendar
//i.e. reset events equal to all of the events except for the one were deleting
function deleteEvent() {
  events = events.filter(e => e.date !== clicked);  //deleting it in the array
  //and deleting in the local storage
  localStorage.setItem('events', JSON.stringify(events));
  closeModal();
}

//function for the other buttons e.g. delete, save, etc.
function initButtons() {
  document.getElementById('nextButton').addEventListener('click', () => {
    
    //increments on the clicks and loads() at the same time
    nav++;
    load();
  });

  document.getElementById('backButton').addEventListener('click', () => {
    
    //derements on the clicks i.e. back button)
    nav--;
    load();
  });

  //below 2 eventlisteners are for the Event schedulers in calendar like for organizers
  document.getElementById('saveButton').addEventListener('click', saveEvent);

  document.getElementById('cancelButton').addEventListener('click', closeModal);

  //below 2 eventlisteners are for the Event schedulers in calendar like for deleting entry
  document.getElementById('deleteButton').addEventListener('click', deleteEvent);

  document.getElementById('closeButton').addEventListener('click', closeModal);
  
};

initButtons();
load();





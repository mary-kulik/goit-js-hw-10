'use strict';

// Описаний в документації
import flatpickr from "flatpickr";
// Додатковий імпорт стилів
import "flatpickr/dist/flatpickr.min.css";

// Описаний у документації
import iziToast from "izitoast";
// Додатковий імпорт стилів
import "izitoast/dist/css/iziToast.min.css";

const input = document.querySelector("#datetime-picker");
const startButton = document.querySelector("[data-start]");
const daysEl = document.querySelector("[data-days]");
const hoursEl = document.querySelector("[data-hours]");
const minutesEl = document.querySelector("[data-minutes]");
const secondsEl = document.querySelector("[data-seconds]");

startButton.disabled = true;

let selectedDate = null;
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    console.log(selectedDates[0]);
    userSelectedDate(selectedDates);
  },
};

flatpickr("#datetime-picker", options)

const date = new Date();

console.log(date);

let userSelectedDate = (selectedDates) => {
  if (selectedDates[0] < date) {
    startButton.disabled = true;
    return iziToast.show({
      color: '#ef4040',
      position: 'topRight',
      messageColor: '#fff',
    message: 'Please choose a date in the future'
});
  }
  else { startButton.disabled = false }
  let ms = selectedDates[0] - date;
  // console.log('convertMs :>> ', convertMs(ms));
  selectedDate = selectedDates[0];
};

// Форматування значення з додаванням нуля
function addZero(value) {
  return String(value).padStart(2, "0");
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

// console.log(convertMs(2000)); // {days: 0, hours: 0, minutes: 0, seconds: 2}
// console.log(convertMs(140000)); // {days: 0, hours: 0, minutes: 2, seconds: 20}
// console.log(convertMs(24140000)); // {days: 0, hours: 6 minutes: 42, seconds: 20}


// Оновлення таймера
function updateTimer({ days, hours, minutes, seconds }) {
  daysEl.textContent = addZero(days);
  hoursEl.textContent = addZero(hours);
  minutesEl.textContent = addZero(minutes);
  secondsEl.textContent = addZero(seconds);
}



let timerInterval = null;

startButton.addEventListener("click", () => {
  
  startButton.disabled = true;
  input.disabled = true;

  timerInterval = setInterval(() => {
    const currentTime = new Date();
    const remainingTime = selectedDate - currentTime;

    if (remainingTime <= 0) {
      clearInterval(timerInterval);
      updateTimer({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      input.disabled = false;
      return;
    }

    const timeComponents = convertMs(remainingTime);
    updateTimer(timeComponents);
  }, 1000);
});
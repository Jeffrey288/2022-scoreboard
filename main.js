import './style.css'
import 'virtual:windi.css'
import Timer from './timer'
import { seeker_score_template, hitter_score_template } from './templates'
import { msToString } from './utils';

const timer = new Timer();
const main_timer = document.querySelector('#timer')

const HALFMIN = 1000 * 30;
const ONEMIN = 1000 * 60;
const ONEHALFMIN = 1000 * 90;
 
timer.start();
let timerId = setInterval(updateTimer, 8);

function updateTimer() {
  const time = timer.getTime(); // returns how much time have passed since the start
  main_timer.innerHTML = Timer.ms2msStr(ONEHALFMIN - time);
}


document.getElementById("round-1-left").innerHTML = seeker_score_template();
document.getElementById("round-1-right").innerHTML = hitter_score_template();


var round1btn = document.querySelector("#round1btn");

// collapsibles

// initialize collapsibles
var round_1_collapsible = document.getElementById("round-1-button");
round_1_collapsible.classList.remove('active');
updateCollapsible(round_1_collapsible);

var collapsible_list = document.getElementsByClassName("collapsible");
var i;

function updateCollapsible(collapsible) {
  var content = collapsible.nextElementSibling;
  if (!collapsible.classList.contains('active')) {
    content.style.maxHeight = "0px"; // inactive
  } else {
    content.style.maxHeight = content.scrollHeight + "px"; // active
  }
}

for (i = 0; i < collapsible_list.length; i++) {
  collapsible_list[i].addEventListener("click", function() {
    this.classList.toggle('active');
    updateCollapsible(this);
  });
}

// round1btn.addEventListener("click", function() {
//   var content = document.querySelector("#round1content");
//   if (content.style.maxHeight) {
//     content.style.maxHeight = null;
//   } else {
//     content.style.maxHeight = content.scrollHeight + "px";
//   }
// })


// function updateTimer() {
//   const time = timer.getTime();
//   if (time >= targetTime - 5200 && !countdownPlayed) {
//     // last five seconds
//     countdownPlayed = true;
//     countdownAudio.play();
//   }
//   if (time >= THREE_MIN) {
//     stopTimer();
//     btn_stop.click();
//     up_timer.innerText = msToString(THREE_MIN);
//     down_timer.innerText = msToString(0);
//     up_timer.classList.add("times-up");
//     down_timer.classList.add("times-up");

//     longBeepAudio.play();
//     return;
//   } else if (targetTime == ONE_MIN && time >= ONE_MIN) {
//     countdownPlayed = false;
//     beepAudio.play();
//     stopTimer();
//     timer.reset();
//     targetTime = THREE_MIN;
//     timer.start();
//     timerId = setInterval(updateTimer, 8);
//   }

//   up_timer.innerText = msToString(time);
//   down_timer.innerText = msToString(targetTime - time);
// }

// document.querySelector('#app').innerHTML = `
//   <h1>Hello Vi!</h1>
//   <a href="https://vitejs.dev/guide/features.html" target="_blank">Documentation</a>
// `



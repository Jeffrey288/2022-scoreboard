import './style.css'
import 'virtual:windi.css'
import Timer from './timer'
import { seeker_score_template, hitter_score_template } from './templates'
import { Counters, Record, saveToJSON, toIsoString } from './records';
import { type } from 'windicss/utils';

const timer = new Timer();
const timer_text = document.querySelector('#timer')

const HALFMIN = 1000 * 30;
const ONEMIN = 1000 * 60;
const ONEHALFMIN = 1000 * 90;
 
// templates
document.getElementById("round-1-left").innerHTML = seeker_score_template("blue");
document.getElementById("round-1-right").innerHTML =  hitter_score_template("red");
document.getElementById("round-2-left").innerHTML = hitter_score_template("blue");
document.getElementById("round-2-right").innerHTML =  seeker_score_template("red");

const scoreboards = {
  red: {
    name: document.getElementById("red-name"),
    role: document.getElementById("red-role"),
    scoreboard: document.getElementById("red-scoreboard"),
    eventboard: document.getElementById("red-eventboard-records"),
  },
  blue: {
    name: document.getElementById("blue-name"),
    role: document.getElementById("blue-role"),
    scoreboard: document.getElementById("blue-scoreboard"),
    eventboard: document.getElementById("blue-eventboard-records"),
  },
}

const game_stats = {
  red: {
    counters: new Counters(),
    records: [],
  },
  blue: {
    counters: new Counters(),
    records: [],
  },
};

function updateRecord() {
  ["red", "blue"].forEach((team) => 
    {
      var score = game_stats[team].counters.seekerScore();
      scoreboards[team].scoreboard.innerText = score;
    }
  )
}
function addRecord(team, action) {

  var timecode = "", time = "";
  if (game_state === STATES.start) return;
  else if (game_state === STATES.end)  {
    timecode = "2BU";
    time = "0:00"; // time left
  } else {
    var [round, state] = game_state.split("-");
    timecode = round.slice(-1) + state.slice(0, 2).toUpperCase();
    time = timer.get_ms_string().slice(1, 5); // time left
  }

  var score = game_stats[team].counters.seekerScore();
  const record = new Record(
    timecode,
    time,
    action,
    score
  );

  scoreboards[team].eventboard.innerHTML
    = record.toHTML() + scoreboards[team].eventboard.innerHTML;
  game_stats[team].records.push(record);

  updateRecord();

}

var counters = {
  red: {
    seeker: game_stats.red.counters.seeker_counters,
    hitter: game_stats.red.counters.hitter_counters,
  },
  blue: {
    seeker: game_stats.blue.counters.seeker_counters,
    hitter: game_stats.blue.counters.hitter_counters,
  }
};

function selectIDs(idList) { // selectes all containing those in idList
  return document.querySelectorAll( idList.map((id)=>`[id*=${id}]`).join(',') );
}
function selectIDsOrdered(idList) { // selectes all containing those in idList
  return idList.map((id) => document.getElementById(id));
}
function addIDPrefix(prefixList, idList) {
  return [].concat.apply([], prefixList.map((color)=>idList.map((id)=>color+"-"+id)));
}
function initObjFill(idList, initValue) {
  var counter_states = [];
  idList.forEach((key) => counter_states[key] = initValue);
  return counter_states;
}
function initObj(keyList, valList) {
  if (keyList.length != valList.length)
    console.log("error in initObj", keyList, valList);
  var obj = [];
  for (var i=0; i<keyList.length; i++) {
    obj[keyList[i]] = valList[i];
  }
  return obj;
}



// hitter stuff
const hitter_score_buttons_ids = addIDPrefix(["collected", "passed", "thrown"], ["plus", "minus"]); 
const hitter_score_counter_ids = addIDPrefix(["red", "blue"], addIDPrefix(["collected", "passed", "thrown"], ["counter"])); 
const hitter_score_buttons = selectIDs(hitter_score_buttons_ids);
const hitter_score_counter = initObj(hitter_score_counter_ids, selectIDsOrdered(hitter_score_counter_ids));
hitter_score_buttons.forEach((btn) => btn.addEventListener("click", function () {
  var [team, action, incrementText] = this.id.split("-");
  var increment; if (incrementText == "plus") increment = 1; else increment = -1;
  if ((increment == 1 && counters[team]["hitter"]["balls_"+action] < 6)
    || (increment == -1 && counters[team]["hitter"]["balls_"+action] > 0)
    && game_state != STATES.start) {
      counters[team]["hitter"]["balls_"+action] += increment;
      hitter_score_counter[`${team}-${action}-counter`].innerText = counters[team]["hitter"]["balls_"+action];
      addRecord(team, `Balls ${action} ${incrementText} one, total ${counters[team]["hitter"]["balls_"+action]}.`);
  }
  
}));


// lagori buttons
function lagori2index(lagori) { return lagori.charCodeAt(0) - 'A'.charCodeAt(0); }
const lagori_buttons_ids = addIDPrefix(['A', 'B', 'C', 'D', 'E'], ["break-btn", "pick-btn", "place-btn"]);
const lagori_buttons = selectIDs(lagori_buttons_ids);
lagori_buttons.forEach(btn => lagori_buttons_set_fail(btn));
function lagori_buttons_set_fail (btn) { btn.classList.remove("disabled"); btn.classList.remove("ok"); btn.classList.add("fail"); btn.innerHTML = "FAIL"; }
function lagori_buttons_set_ok (btn) { btn.classList.remove("disabled");  btn.classList.remove("fail"); btn.classList.add("ok"); btn.innerHTML = "OK"; }
function lagori_buttons_set_disabled (btn) { btn.classList.add("disabled"); btn.classList.remove("fail"); btn.classList.remove("ok"); btn.innerHTML = "-"; }
function lagori_buttons_update() {
  lagori_buttons.forEach(btn => {
    var [team, lagoriChar, action, _] = btn.id.split("-"); var lagori = lagori2index(lagoriChar);
    switch (action) {
      case "break":
        if (counters[team]["seeker"].lagori_broken[lagori] != 0) 
          lagori_buttons_set_ok(btn);
        else lagori_buttons_set_fail(btn);
        break;
      case "pick":
        if (counters[team]["seeker"].lagori_broken[lagori] == 0) {
          counters[team]["seeker"].lagori_picked[lagori] = false;
          lagori_buttons_set_disabled(btn);  
        } else {
          if (counters[team]["seeker"].lagori_picked[lagori])
            lagori_buttons_set_ok(btn);
          else
            lagori_buttons_set_fail(btn);
        }
        break;
      case "place":
        if (!counters[team]["seeker"].lagori_picked[lagori]) {
          counters[team]["seeker"].lagori_placed[lagori] = false;
          lagori_buttons_set_disabled(btn);  
        } else {
          if (counters[team]["seeker"].lagori_placed[lagori])
            lagori_buttons_set_ok(btn);
          else
            lagori_buttons_set_fail(btn);
        }
        break;
    }
  })
  updateRecord();
}
function lagori_select_callback(btn) {
  var [team, lagoriChar, action, _] = btn.id.split("-"); var lagori = lagori2index(lagoriChar);
    if (game_state != STATES.start) {
      switch (action) {
        case "break":
          if (counters[team]["seeker"].lagori_broken[lagori] == 0 && counters[team]["seeker"].balls_used > 0) {
            counters[team]["seeker"].lagori_broken[lagori] = counters[team]["seeker"].balls_used;
            addRecord(team, `Broke Lagori ${lagoriChar} with ball ${counters[team]["seeker"].balls_used}.`);
          } else {
            if (counters[team]["seeker"].lagori_broken[lagori] != 0) {
              counters[team]["seeker"].lagori_broken[lagori] = 0;
              addRecord(team, `<p style="color:gray;">Reset break state of Lagori ${lagoriChar}.</p>`);
            } else counters[team]["seeker"].lagori_broken[lagori] = 0;
          }
          if (counters[team]["seeker"].lagori_broken[lagori] != 0) 
            lagori_buttons_set_ok(btn);
          else lagori_buttons_set_fail(btn);
          break;
  
        case "pick":
          if (counters[team]["seeker"].lagori_broken[lagori] == 0) return;
          counters[team]["seeker"].lagori_picked[lagori] = !counters[team]["seeker"].lagori_picked[lagori];
          if (counters[team]["seeker"].lagori_picked[lagori]) {
            lagori_buttons_set_ok(btn);
            addRecord(team, `Picked up Lagori ${lagoriChar}.`);
          } else {
            lagori_buttons_set_fail(btn);
            addRecord(team, `<p style="color:gray;">Reset pick state of Lagori ${lagoriChar}.</p>`);
          } 
          break;
  
        case "place":
          if (!counters[team]["seeker"].lagori_picked[lagori]) return;
          counters[team]["seeker"].lagori_placed[lagori] = !counters[team]["seeker"].lagori_placed[lagori];
          if (counters[team]["seeker"].lagori_placed[lagori]) {
            lagori_buttons_set_ok(btn);
            addRecord(team, `Placed Lagori ${lagoriChar}.`);
          } else {
            lagori_buttons_set_fail(btn);
            addRecord(team, `<p style="color:gray;">Reset place state of Lagori ${lagoriChar}.</p>`);
          } 
          break;
      }
      lagori_buttons_update();
    }
}

// TODO: add mouse speed max (to prevent slipping)
lagori_buttons_update();
var lagori_drag_mode = false; // this means dragging a lagori
var lagori_drag_mode_btns = [];
lagori_buttons.forEach(btn => {
  btn.addEventListener("mousedown", function() {
    lagori_drag_mode = true;
    lagori_select_callback(this);
    lagori_drag_mode_btns.push(this.id);
    console.log(lagori_drag_mode);
  })
  btn.addEventListener("mouseover", function() {
    if (!lagori_drag_mode) return;
    if (!lagori_drag_mode_btns.includes(this.id) && // check if changed already
        this.id[0] == lagori_drag_mode_btns[0][0]) {// check if same team color
          lagori_select_callback(this);
          lagori_drag_mode_btns.push(this.id);
        }
    console.log(this.id, lagori_drag_mode_btns);
  })
})
document.addEventListener("mouseup", function() {
  lagori_drag_mode = false;
  lagori_drag_mode_btns = [];
})

// ball buttons
const ball_button_ids = ['ball-1-btn', 'ball-2-btn', 'ball-3-btn'];
const ball_buttons = selectIDs(ball_button_ids)
function ball_buttons_set_active (btn) { btn.classList.remove("ball-inactive");  btn.classList.remove("ball-unclicked"); btn.classList.add("ball-clicked"); }
function ball_buttons_set_inactive (btn) { btn.classList.remove("ball-inactive"); btn.classList.add("ball-unclicked"); btn.classList.remove("ball-clicked"); }
function ball_buttons_set_disabled (btn) { btn.classList.add("ball-inactive");  btn.classList.remove("ball-unclicked"); btn.classList.remove("ball-clicked");}
ball_buttons.forEach(btn => {
  var [team, _, ball, _] = btn.id.split("-"); ball = parseInt(ball);
  if (ball == 1) ball_buttons_set_inactive(btn);
  else ball_buttons_set_disabled(btn);
  btn.addEventListener("click", function () {
    if (game_state === STATES.start) return;
    var [team, _, ball, _] = this.id.split("-"); ball = parseInt(ball);
    console.log(team, ball, counters[team]["seeker"].balls_used);
    if (ball == counters[team]["seeker"].balls_used + 1 && this.classList.contains("ball-unclicked")) {
      counters[team]["seeker"].balls_used = ball;
      ball_buttons_set_active(this);
      selectIDs([`${team}-ball-${ball+1}-btn`]).forEach(btn => ball_buttons_set_inactive(btn)); // activate next one
      addRecord(team, `Threw ball ${ball}.`);
    } else if (ball == counters[team]["seeker"].balls_used && this.classList.contains("ball-clicked")) {
      counters[team]["seeker"].balls_used = ball - 1;
      ball_buttons_set_inactive(this);
      selectIDs([`${team}-ball-${ball+1}-btn`]).forEach(btn => ball_buttons_set_disabled(btn)); // activate next one
      addRecord(team, `<p style="color:gray;">Reset state of ball ${ball}.</p>`);
    }
  });
})


// collapsibles
// initialize collapsibles
var round_1_collapsible = document.getElementById("round-1-button");
round_1_collapsible.classList.add('active');
updateCollapsible(round_1_collapsible);

var collapsible_list = document.getElementsByClassName("collapsible");

function updateCollapsible(collapsible) {
  var content = collapsible.nextElementSibling;
  if (!collapsible.classList.contains('active')) {
    content.style.maxHeight = "0px"; // inactive
  } else {
    content.style.maxHeight = content.scrollHeight + "px"; // active
  }
}

for (var i = 0; i < collapsible_list.length; i++) {
  collapsible_list[i].addEventListener("click", function() {
    this.classList.toggle('active');
    updateCollapsible(this);
  });
}

// restarts and violations and endgames
const restart_ids = addIDPrefix(addIDPrefix(["red", "blue"], ["seeker", "hitter"]), ["restart"]);
const violation_ids = addIDPrefix(addIDPrefix(["red", "blue"], ["seeker", "hitter"]), ["violation"]);
const restart_btns = selectIDsOrdered(addIDPrefix(restart_ids, ["btn"]));
const restart_btns_obj = initObj(restart_ids, restart_btns);
const violation_btns = selectIDsOrdered(addIDPrefix(violation_ids, ["btn"]));
const restart_counters = initObj(restart_ids, selectIDsOrdered(addIDPrefix(restart_ids, ["count"])));
const violation_counters = initObj(violation_ids, selectIDsOrdered(addIDPrefix(violation_ids, ["count"])));
const restart_states = initObjFill(restart_ids, undefined);
violation_btns.forEach((btn) => 
  btn.addEventListener("mousedown", function(e) {
    if (game_state == STATES.start) return;
    var [team, role, ..._] = this.id.split("-");
    var violation_id = team + "-" + role + "-violation";
    if (e.which == 1) { // left click
      counters[team][role].violations += 1;
      addRecord(team, `Violation. (total ${counters[team][role].violations})`);
    } else if (e.which == 3) { // right click
      if (counters[team][role].violations > 0) {
        counters[team][role].violations -= 1;
        addRecord(team, `<p style="color:gray;">Removed violation. (total ${counters[team][role].violations})</p>`);
      }
    }
    violation_counters[violation_id].innerHTML = counters[team][role].violations;

  })
);
function endRestart(restart_id, appendRecord = true) {
  restart_btns_obj[restart_id].innerHTML = "RESTART";
  var time_used = restart_states[restart_id].timer.get_ms_s_string();
  clearInterval(restart_states[restart_id].id);
  console.log(time_used);
  restart_states[restart_id] = undefined;
  if (appendRecord) {
    var [team, role, ..._] = restart_id.split("-");
    addRecord(team, `Restart complete. Time taken: ${time_used}`);
    counters[team][role].restart_times.push(time_used);
  }
}
function updateRestart(restart_id) {
  console.log(restart_id);
  restart_btns_obj[restart_id].innerHTML = 
    restart_states[restart_id].timer.get_ms_s_string();
}

function endAllRestarts() {
  restart_states.forEach(
    (restart_id) => {
      if (!(restart_states === undefined)) {
        endRestart(restart_id);
      }
    }
  );
}

restart_btns.forEach((btn) =>
  btn.addEventListener("mousedown", function(e) {
    if (game_state == STATES.start) return;
    var [team, role, ..._] = this.id.split("-");
    var restart_id = team + "-" + role + "-restart";
    if (e.which == 3) {
      if (counters[team][role].restarts > 0) {
        counters[team][role].restarts -= 1;
        addRecord(team, `<p style="color:gray;">Removed restart. (total ${counters[team][role].violations})</p>`);
        restart_counters[restart_id].innerText = counters[team][role].restarts;
      } endRestart(restart_id); return;
    }
    if (restart_states[restart_id] == undefined) {
      var restart_timer = new Timer();
      restart_timer.start();
      var interval_id = setInterval(() => {updateRestart(restart_id)}, 8);
      restart_states[restart_id] = {
        timer: restart_timer, 
        id: interval_id
      };
      counters[team][role].restarts += 1;
      addRecord(team, `Restart. (total ${counters[team][role].restarts})`);
      restart_counters[restart_id].innerText = counters[team][role].restarts;
    } else {
      endRestart(restart_id);
    }
  })
);

// end buttons
const hit_buttons = selectIDs(["hitter-complete-btn"]);
const built_indicators = initObj(["red", "blue"], selectIDsOrdered(addIDPrefix(["red", "blue"], ["seeker-complete-btn"])));
hit_buttons.forEach(btn => btn.addEventListener("click", function () {
  var [team, ..._] = this.id.split("-");
  this.classList.replace("end-button", "end-button-lit");
  counters[team]["hitter"].hit = true;
}));

// timer stuff
const timer_start = document.getElementById("timer-start");
const timer_stop = document.querySelector("#timer-stop");
const timer_reset = document.querySelector("#timer-reset");
timer_start.addEventListener("click", function () {
  timer_start.classList.replace("timer-active", "timer-inactive");
  timer_stop.classList.replace("timer-inactive", "timer-active");
  timer_reset.classList.replace("timer-active", "timer-inactive");
  if (game_state === STATES.start) {
    timer_loop_id = setInterval(timer_loop, 8);
  } else if (game_paused) {
    game_paused = false;
    timer.start();
  }

});

const BREAK_PAUSE_GAME = true;
function pause_game() {
  timer_start.innerText = "RESUME";
  timer_start.classList.replace("timer-inactive", "timer-active");
  timer_stop.classList.replace("timer-active", "timer-inactive");
  timer_reset.classList.replace("timer-inactive", "timer-active");
  game_paused = true;
  timer.stop();
}
timer_stop.addEventListener("click", function() {
  pause_game();
})
timer_reset.addEventListener("click", function () {
  document.location.reload(true)
})

const STATES = {
  start: "start",
  r1_setting: "r1-setting",
  r1_break: "r1-break",
  r1_build: "r1-build",
  r2_setting: "r2-setting",
  r2_break: "r2-break",
  r2_build: "r2-build",
  end: "end"
}

// timeline board stuff
const board_id_list = addIDPrefix(["r1", "r2"], ["header", "setting", "break", "build"]);
const board_elm = initObj(board_id_list, selectIDsOrdered(board_id_list));
const board_btn_id_list = addIDPrefix(addIDPrefix(["r1", "r2"], ["setting", "break", "build"]), ["btn"]);
console.log(board_btn_id_list);
const board_btns = selectIDsOrdered(board_btn_id_list);
board_btns.forEach((btn) => btn.addEventListener("click", function() {
  var [round, state, _] = this.id.split("-"); var id = round+"-"+state;
  console.log(id, game_state);
  if (id == game_state && timer.get_time_left() > 5*1000) {
    timer.reinit(5 * 1000);
    timer.start();
  }
}));


const ROLES = {
  r1: {
    "hitter": "red",
    "red": "hitter",
    "seeker": "blue",
    "blue": "seeker"
  },
  r2: {
    "hitter": "blue",
    "blue": "hitter",
    "seeker": "red",
    "red": "seeker"
  }
}
const BOARDS = {
  left: "blue",
  right: "red"
};

var place_times = [0, 0];
var game_paused = true;
var game_state = STATES.start;
function set_state_board(id, state) {
  if (state) { board_elm[id].classList.replace("board-inactive", "board-active"); } 
  else { board_elm[id].classList.replace("board-active", "board-inactive"); }
}
// proper case string (JScript 5.5+)
function toProperCase(s)
{
  return s.toLowerCase().replace(/^(.)|\s(.)/g, 
          function($1) { return $1.toUpperCase(); });
}
function timer_loop() {
  // displaying the timer
  if (game_state === STATES.end) {
    timer_text.innerHTML = "GAME OVER";
    timer_text.classList.add("text-size-[70px]");
    timer_start.classList.replace("timer-active", "timer-inactive");
    timer_stop.classList.replace("timer-active", "timer-inactive");
    timer_reset.classList.replace("timer-inactive", "timer-active");
  } else {
    timer_text.innerHTML = timer.get_ms_string();
  }
    
  // game flow (fsm)
  if (game_state === STATES.start) {
    scoreboards.blue.role.innerHTML = toProperCase(ROLES.r1.blue);
    scoreboards.red.role.innerHTML = toProperCase(ROLES.r1.red);

    timer.reinit(ONEMIN);
    timer.start()
    game_state = STATES.r1_setting;
    set_state_board("r1-header", true); set_state_board("r1-setting", true); 
  } else if (game_state === STATES.r1_setting) {
    if (timer.time_up()) {
      timer.reinit(HALFMIN);
      timer.start();
      game_state = STATES.r1_break;
      set_state_board("r1-break", true); set_state_board("r1-setting", false);
    }
  } else if (game_state === STATES.r1_break) {
    if (
      timer.time_up() || // 1. time runs out
      counters[ROLES.r1.seeker].seeker.balls_used == 3 || // 2. all 3 balls are used
      counters[ROLES.r1.seeker].seeker.lagori_broken.filter((n)=>n>0).length == 5 // 3. all 3 lagoris broken
      ) {
      var time_left = timer.get_time_left(); // store this time_left somewhere
      counters[ROLES.r1.seeker].seeker.break_time = HALFMIN - time_left;
      place_times[0] = ONEMIN + time_left
      timer.reinit(ONEMIN + time_left);
      timer.start();
      if (BREAK_PAUSE_GAME) pause_game();
      game_state = STATES.r1_build;
      set_state_board("r1-break", false); set_state_board("r1-build", true);
    }
  } else if (game_state === STATES.r1_build) {
    if (timer.get_time_left() < 10*1000) {
      timer_text.classList.add("flash");
    }

    if (
      timer.time_up() || // 1. time runs out
      counters[ROLES.r1.seeker].seeker.lagori_placed.filter((n)=>n>0).length == 5 || // 2. lagori tower complete
      counters[ROLES.r1.hitter].hitter.hit // 3. if hit
    ) {
      scoreboards.blue.role.innerHTML = toProperCase(ROLES.r2.blue);
      scoreboards.red.role.innerHTML = toProperCase(ROLES.r2.red);
  
      if (counters[ROLES.r1.seeker].seeker.lagori_placed.filter((n)=>n>0).length == 5) { // built
        built_indicators[ROLES.r1.seeker].classList.replace("end-button", "end-button-lit");
        counters[ROLES.r1.seeker].seeker.built = true;
      }

      timer_text.classList.remove("flash");
      var time_left = timer.get_time_left();
      // store this time_left somewhere
      timer.reinit(ONEMIN);
      timer.start();
      game_state = STATES.r2_setting;
      set_state_board("r1-header", false); set_state_board("r1-build", false);
      set_state_board("r2-header", true); set_state_board("r2-setting", true); 
    }
  } else if (game_state === STATES.r2_setting) {
    // timer runs out:
    if (timer.time_up()) {
      timer.reinit(HALFMIN);
      timer.start();
      game_state = STATES.r2_break;
      set_state_board("r2-break", true); set_state_board("r2-setting", false);
    }
  } else if (game_state === STATES.r2_break) {
    if (
      timer.time_up() || // 1. time runs out
      counters[ROLES.r2.seeker].seeker.balls_used == 3 || // 2. all 3 balls are used
      counters[ROLES.r2.seeker].seeker.lagori_broken.filter((n)=>n>0).length == 5 // 3. all 3 lagoris broken
      ) {
      var time_left = timer.get_time_left();
      counters[ROLES.r2.seeker].seeker.break_time = HALFMIN - time_left;
      // store this time_left somewhere
      place_times[1] = ONEMIN + time_left;
      timer.reinit(ONEMIN + time_left);
      timer.start();
      if (BREAK_PAUSE_GAME) pause_game();
      game_state = STATES.r2_build;
      set_state_board("r2-break", false); set_state_board("r2-build", true);
    }
  } else if (game_state === STATES.r2_build) {
    if (timer.get_time_left() < 10*1000) {
      timer_text.classList.add("flash");
    }

    if (
      timer.time_up() || // 1. time runs out
      counters[ROLES.r2.seeker].seeker.lagori_placed.filter((n)=>n>0).length == 5 || // 2. lagori tower complete
      counters[ROLES.r2.hitter].hitter.hit // 3. if hit
    ) {
      if (counters[ROLES.r2.seeker].seeker.lagori_placed.filter((n)=>n>0).length == 5) {
        built_indicators[ROLES.r2.seeker].classList.replace("end-button", "end-button-lit");
        counters[ROLES.r2.seeker].seeker.built = true;
      }

      // store this time_left somewhere
      var time_left = timer.get_time_left();
      counters[ROLES.r2.seeker].seeker.time_remaining = time_left;
      counters[ROLES.r2.hitter].hitter.time_remaining = time_left;
      counters[ROLES.r2.seeker].seeker.place_time = 0;
      

      game_state = STATES.end;
      set_state_board("r2-header", false); set_state_board("r2-build", false); 
    }
  }

}

function saveResult() {
  const result = {
      createdAt: toIsoString(new Date()),
      data: {
          red: {
              score: game_stats.red.counters.seekerScore(),
              seeker: game_stats.red.counters.seekerCompiled(),
              hitter: game_stats.red.counters.hitterCompiled(),
              records: game_stats.red.records.map((obj) => obj.toString()),
              win: false,
          },
          blue: {
            score: game_stats.blue.counters.seekerScore(),
            seeker: game_stats.blue.counters.seekerCompiled(),
            hitter: game_stats.blue.counters.hitterCompiled(),
            records: game_stats.blue.records.map((obj) => obj.toString()),
            win: false,  
          },
      },
  };
  saveToJSON(result, "result.json");
}

document.getElementById("btn_save").addEventListener("click", () => {
  // alert("hi");
  saveResult();
})
// let main_loop_id = setInterval(main_loop, 8);

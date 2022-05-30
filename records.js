
class Counters {

    constructor() {
        this.hitter_counters = {
          restarts: 0,
          restart_times: [],
          violations: 0,
          violation_type: [],
          hit: false,
          balls_collected: 0,
          balls_passed: 0,
          balls_thrown: 0,
          time_remaining: 0,
        };

      this.seeker_counters = {
        restarts: 0,
        restart_times: [],
        violations: 0,
        violation_type: [],
        built: false,
        balls_used: 0,
        lagori_broken: [0, 0, 0, 0, 0],
        lagori_picked: [false, false, false, false, false],
        lagori_placed: [false, false, false, false, false],
        break_time: 0,
        place_time: 0,
        time_remaining: 0,
      };

    }

    seekerScore() {
        const break_score = 5 * this.seeker_counters.lagori_broken.filter(elm => elm > 0).length;
        const pile_score = 10 * this.seeker_counters.lagori_placed.filter(elm => elm).length;
        return break_score + pile_score;
    }

    seekerCompiled() {
        return this.seeker_counters;
    }

    hitterCompiled() {
        return this.hitter_counters;
    }

}

class Record {
    
    constructor(state, time, action, score) {
        this.state = state;
        this.time = time;
        this.action = action;
        this.score = score;
    }

    toHTML() {
        return `<div class="record"><span>${this.state} ${this.time}</span>
        <span>${this.action}</span><span>${this.score}</span></div>`;
    }

    toString() {
        var span = document.createElement('span');
        span.innerHTML = this.action;
        return `[${this.state} ${this.time}] ${span.textContext || span.innerText} (score: ${this.score})`;
    }
}

function saveToJSON(obj, filename = "result.json") {
    var a = document.createElement("a");
    a.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(JSON.stringify(obj, null, 4))
    );
    a.setAttribute("download", filename);
    a.click();
}

function toIsoString(date) {
    const tzo = -date.getTimezoneOffset(),
      dif = tzo >= 0 ? "+" : "-",
      pad = function (num) {
        const norm = Math.floor(Math.abs(num));
        return (norm < 10 ? "0" : "") + norm;
      };
  
    return (
      date.getFullYear() +
      "-" +
      pad(date.getMonth() + 1) +
      "-" +
      pad(date.getDate()) +
      "T" +
      pad(date.getHours()) +
      ":" +
      pad(date.getMinutes()) +
      ":" +
      pad(date.getSeconds()) +
      dif +
      pad(tzo / 60) +
      ":" +
      pad(tzo % 60)
    );
  }

export {Counters, Record, saveToJSON, toIsoString};
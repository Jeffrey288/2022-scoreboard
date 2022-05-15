
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

    toRecord() {
        var span = document.createElement('span');
        span.innerHTML = this.action;
        return `[${this.state} ${this.time}] ${span.textContext || span.innerText} (score: ${this.score})`;
    }

}

export {Counters, Record};
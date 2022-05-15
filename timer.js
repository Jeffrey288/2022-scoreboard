class Timer {

  constructor(timeTarget = undefined) {
    this.reinit(this.timeTarget);
  }

  reinit(timeTarget = undefined) {
    this.timeTarget = timeTarget;
    this.isRunning = false;
    this.startTime = 0;
    this.cumulatedTime = 0;
    this.totalTime = 0;
    if (timeTarget == undefined) {
      this.countUp = true;
    } else {
      this.countUp = false;
    }
  }

  _getTimeElasped() {
    if (this.isRunning) {
      this.totalTime = Date.now() - this.startTime + this.cumulatedTime;
    }
    return this.totalTime;
  }

  _getTimeRemaining() {
    if (this.countUp) return undefined;
    const remTime = this.timeTarget - this._getTimeElasped();
    if (remTime < 0)
      return 0;
    return remTime;
  }
  
  get_time_elapsed() { 
    return this._getTimeElasped();
  }

  get_time_left() {
    return this._getTimeRemaining();
  }

  is_running() {
    return this.isRunning;
  }

  time_up() {
    if (this._getTimeElasped() > this.timeTarget) {
      return true;
    } return false;
  }

  start() {
    if (!this.isRunning) {
      this.startTime = Date.now();
    }
    this.isRunning = true;
  }

  stop() {
    if (this.isRunning) {
      this.cumulatedTime += Date.now() - this.startTime;
    }
    this.isRunning = false;
  }

  get_ms_string() {
    if (this.countUp) return Timer.ms2msStr(this._getTimeElasped());
    return Timer.ms2msStr(this._getTimeRemaining());
  }

  get_s_string() {
    if (this.countUp) return Timer.ms2secStr(this._getTimeElasped());
    return Timer.ms2secStr(this._getTimeRemaining());
  }

  get_ms_s_string() {
    if (this.countUp) return Timer.ms2mssecStr(this._getTimeElasped());
    return Timer.ms2mssecStr(this._getTimeRemaining());
  }

  static ms2msStr(ms) {
    const centisec = String(ms % 1000).padStart(3, '0').slice(0, 2);
    const sec = String(Math.floor(ms / 1000) % 60).padStart(2, '0');
    const min = String(Math.floor(ms / 60 / 1000)).padStart(2, '0');
    return `${min}:${sec}.${centisec}`;
  }

  static ms2secStr(ms) {
    const sec = String(Math.floor(ms / 1000)).padStart(2, '0');
    return sec;
  }
  
  static ms2mssecStr(ms) {
    const sec = String(Math.floor(ms / 1000));
    const decisec = String(ms % 1000).padStart(3, '0').slice(0, 1);
    return `${sec}.${decisec}`;
  }


}

export default Timer;

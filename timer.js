class Timer {
  constructor() {
    this.isRunning = false;
    this.startTime = 0;
    this.overallTime = 0;
  }

  _getTimeElapsedSinceLastStart() {
    if (!this.startTime) {
      return 0;
    }

    return Date.now() - this.startTime;
  }

  start() {
    if (this.isRunning) {
      //   return console.error("Timer is already running");
      return;
    }

    this.isRunning = true;

    this.startTime = Date.now();
  }

  stop() {
    if (!this.isRunning) {
      //   return console.error("Timer is already stopped");
      return;
    }

    this.isRunning = false;

    this.overallTime = this.overallTime + this._getTimeElapsedSinceLastStart();
  }

  reset() {
    this.overallTime = 0;

    if (this.isRunning) {
      this.startTime = Date.now();
      return;
    }

    this.startTime = 0;
  }

  getTime() {
    if (!this.startTime) {
      return 0;
    }

    if (this.isRunning) {
      return this.overallTime + this._getTimeElapsedSinceLastStart();
    }

    return this.overallTime;
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

}

export default Timer;

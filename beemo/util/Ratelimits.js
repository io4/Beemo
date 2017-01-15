class Ratelimiter {
  constructor (options = { timeout: 1, limit: 5 }) {
    this.tracked = [];
    
    this.limit = options.limit;

    setInterval(() => {
      for (const x in this.tracked) {
        if (this.tracked[x] > 0) this.tracked[x]--;
      }
    }, options.timeout * 1000);
  }

  check (id) {
    if (!(id in this.tracked)) {
      this.tracked[id] = 0;
    }
    this.tracked[id]++;
    if (this.tracked[id] > this.limit) return this.tracked[id];
    return true;
  }
  
  reset (id) {
    this.tracked[id] = 0;
  }
}

module.exports = Ratelimiter;

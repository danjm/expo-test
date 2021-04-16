module.exports = class Client {
  constructor(bus, source, target) {
    this.lastId = 0;
    this.bus = bus;
    this.source = source;
    this.target = target;
    this.waitingCalls = {};

    this.bus.onMessage(this.onMessage.bind(this), this.source);
  }

  callRemote(method, ...params) {
    const id = this.lastId++;

    return new Promise((resolve, reject) => {
      this.waitingCalls[id] = (result) => {
        if (result.error) {
          reject(result.error);
        } else {
          resolve(result.result);
        }

        delete this.waitingCalls[id];
      };

      this.bus.postMessage({
        id,
        method,
        params
      }, this.target);
    })
  }

  onMessage(data) {
    const parsed = JSON.parse(data);
    this.waitingCalls[parsed.id].call(null, parsed);
  }
};
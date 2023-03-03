class EventEmitter extends EventTarget {
  constructor() {
    super();
  }
  on(type, listener) {
    this.addEventListener(type, listener);
  }
  off(type, listener) {
    this.removeEventListener(type, listener);
  }
  emit(type, detail) {
    this.dispatchEvent(new CustomEvent(type, { detail }));
  }
}

export default EventEmitter;
class Cache {
  data = {};
  constructor(storageName) {
    this.storageName = storageName;
    this.data =
      localStorage.getItem(storageName) == "" ||
      localStorage.getItem(storageName) == null
        ? {}
        : JSON.parse(localStorage.getItem(storageName));
  }
  set(key, value) {
    this.data[key] = value;
    this.save();
  }
  get(key) {
    return this.data[key];
  }
  save() {
    localStorage.setItem(this.storageName, this.toString());
  }
  toString() {
    return JSON.stringify(this.data);
  }
}

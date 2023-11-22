class LocalStorage {
  private storage: {
    [id: string | number]: string;
  };

  constructor() {
    this.storage = {};
  }

  set(key: string | number, value: string) {
    this.storage[key] = value || '';
  }

  get(key: string | number) {
    return this.storage[key];
  }

  remove(key: string | number) {
    if (this.storage[key]) {
      delete this.storage[key];
    }
  }
}

export default new LocalStorage();

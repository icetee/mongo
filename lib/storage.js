'use babel';

const version = 0x002;

export default class Storage {
  constructor(state) {
    atom.deserializers.add(this);
    this.data = state && state.version === version ? state : Storage.createBlankCache();
  }

  static createBlankCache() {
    return {
      options: {
        docViewSide: 'bottom',
        docViewShow: false,
      },
      version,
    };
  }

  get version() {
    return this.data.version;
  }
}

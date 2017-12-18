'use babel';

/** @jsx etch.dom */

import etch from 'etch';

export default class EtchComponent {
  constructor(props = {}, children = []) {
    if (etch.getScheduler() !== atom.views) {
      etch.setScheduler(atom.views);
    }

    this.props = props;
    this.children = children;

    this.ready();
  }

  ready() {
    if (!this.initialized) {
      etch.initialize(this);
      this.initialized = true;
    }
  }

  async update(props = {}, children = this.children) {
    this.props = Object.assign({}, this.props, props);
    this.children = children;

    await etch.update(this);
  }

  async destroy() {
    await etch.destroy(this);
  }
}

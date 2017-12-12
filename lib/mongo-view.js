'use babel';

import { CompositeDisposable, Emitter } from 'atom';
import { Documents } from './doms';

module.exports = class MongoView {
  constructor(storage) {
    this.storage = storage;

    this.emitter = new Emitter();
    this.subscriptions = new CompositeDisposable();

    this.documentDom = null;

    this.events();
  }

  attach() {
    const currentSide = this.storage.data.options.docViewSide.toLowerCase();
    const currentDock = atom.workspace.paneContainers[currentSide];

    if (typeof currentDock !== 'object') return;

    const activePane = currentDock.getPanes()[0];

    this.documentDom = new Documents({ status: 0 });
    this.panel = activePane.addItem(this.documentDom);

    if (!currentDock.isVisible()) {
      currentDock.toggle();
    }

    this.emitter.emit('attached');
  }

  detach() {
    if (this.panel) {
      if (typeof this.panel.destroy === 'function') {
        this.panel.destroy();
      } else if (typeof atom.workspace.paneForItem === 'function') {
        if (typeof atom.workspace.paneForItem(this.panel) !== 'undefined') {
          atom.workspace.paneForItem(this.panel).destroyItem(this.panel, true);
        }
      }
    }

    this.panel = null;
    this.emitter.emit('detached');
  }

  toggle() {
    if (this.isVisible) {
      this.destroy();
    } else {
      this.attach();
    }
  }

  async destroy() {
    await this.detach();
  }

  events() {
    this.onDidAttached(() => {
      this.isVisible = true;
      this.storage.data.options.docViewShow = true;
    });

    this.onDidDetached(() => {
      this.isVisible = false;
      this.storage.data.options.docViewShow = false;
    });
  }

  onDidAttached(callback) {
    this.subscriptions.add(this.emitter.on('attached', callback));
  }

  onDidDetached(callback) {
    this.subscriptions.add(this.emitter.on('detached', callback));
  }
};

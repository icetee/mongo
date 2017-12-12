'use babel';

import { CompositeDisposable } from 'atom';
import Api from './api';
import Client from './client';
import MongoView from './mongo-view';
import Storage from './storage';

export default {

  mongoView: null,
  subscriptions: null,

  activate(state) {
    this.storage = new Storage(state);
    this.mongoView = new MongoView(this.storage);
    this.client = new Client({
      storage: this.storage,
      mongoView: this.mongoView,
    });

    atom.project.mongo = new Api(this.client);

    this.subscriptions = new CompositeDisposable();

    if (this.storage.data.options.docViewShow) {
      this.mongoView.attach();
    }

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'mongo:toggle': () => {
        this.mongoView.toggle();
      },
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
    this.mongoView.destroy();
  },

  serialize() {
    return this.storage.data;
  },
};

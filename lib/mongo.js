'use babel';

import {
  CompositeDisposable,
} from 'atom';
import Storage from './storage';
import MongoError from './mongo-error';

export default {
  client: null,
  mongoView: null,
  subscriptions: null,

  activate(state) {
    window.MongoError = MongoError;
    this.storage = new Storage(state);

    this.subscriptions = new CompositeDisposable();

    if (this.storage.data.options.docViewShow) {
      this.loadView(true);
    }

    this.subscriptions.add(
      atom.commands.add('atom-workspace', {
        'mongo:initialize': async () => {
          await this.loadClient();
        },
        'mongo:toggle': async () => {
          await this.loadClient();

          this.mongoView.toggle();
        },
        'mongo:connection': async () => {
          await this.loadClient();

          this.client.connection();
        },
        'mongo:create-config': async () => {
          await this.loadClient();

          this.client.createConfig();
        },
        'mongo:run': async () => {
          await this.loadClient();

          this.client.runCommand();
        },
      }),
    );
  },

  async loadView(attach) {
    if (this.mongoView) return true;

    const MongoView = require('./mongo-view');

    this.mongoView = await new MongoView(this.storage);

    if (attach) {
      this.mongoView.attach();
    }

    return true;
  },

  async loadClient() {
    if (this.client) return true;
    await this.loadView();

    const Client = require('./client');

    this.client = await new Client({
      storage: this.storage,
      mongoView: this.mongoView,
    });

    return true;
  },

  deactivate() {
    this.subscriptions.dispose();
    this.mongoView.destroy();
    this.client = null;

    delete atom.project.mongo;
  },

  serialize() {
    return this.storage.data;
  },
};

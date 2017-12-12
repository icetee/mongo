'use babel';

import { CompositeDisposable, Emitter } from 'atom';
import { MongoClient } from 'mongodb';
import { readConfig } from './helper';

export default class Client {
  constructor({ storage, mongoView }) {
    this.storage = storage;
    this.mongoView = mongoView;

    this.emitter = new Emitter();
    this.subscriptions = new CompositeDisposable();

    this.status = 0; // 0: Not connected, 1: Connected
    this.config = null;

    this.events();
  }

  async connection() {
    this.config = await readConfig();
    MongoClient.connect(this.config.host, (err, client) => {
      const db = client.db(this.config.db);
      const col = db.collection('shows');

      col.find({}).toArray((errFind, items) => {
        console.log(items);
        client.close();
      });
    });
  }

  setStatus(code) {
    this.status = code;
    this.emitter.emit('change-status');
  }

  events() {
    this.onDidChangeStatus(() => {
      this.mongoView.documentDom.update({ status: this.status });
    });
  }

  onDidChangeStatus(callback) {
    this.subscriptions.add(this.emitter.on('change-status', callback));
  }
}

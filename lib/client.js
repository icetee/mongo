'use babel';

import { File, CompositeDisposable, Emitter } from 'atom';
import { MongoClient } from 'mongodb';
import { isInvalidJSONConfig, basicNotification } from './notifications';
import { mongoConfigSchema } from './fixtures';
import { hasProject, commands, getSelectedProject } from './helper';

export default class Client {
  constructor({ storage, mongoView }) {
    this.storage = storage;
    this.mongoView = mongoView;

    this.emitter = new Emitter();
    this.subscriptions = new CompositeDisposable();

    this.status = 0; // 0: Not connected, 1: Connected, 2: Connecting
    this.config = null;

    this.events();
  }

  normalizeConfig() {
    const hasProtocol = (/^mongodb:\/\//.test(this.config.host));

    if (this.config.auth && this.config.auth.enable) {
      const account = `${encodeURIComponent(this.config.auth.username)}:${encodeURIComponent(this.config.auth.password)}`;

      if (hasProtocol) {
        this.config.host = `mongodb://${account}@${this.config.host.replace('mongodb://')}`;
      } else {
        this.config.host = `mongodb://${account}@${this.config.host}`;
      }
    } else if (!hasProtocol) {
      this.config.host = `mongodb://${this.config.host}`;
    }

    this.config.Uri = `${this.config.host}:${this.config.port}`;
  }

  async connection() {
    try {
      this.config = await Client.readConfig();
    } catch (e) {
      isInvalidJSONConfig(e);
      return;
    }

    this.normalizeConfig();

    MongoClient.connect(this.config.Uri, this.config.options, async (errClient, client) => {
      this.setStatus(2);

      if (errClient) {
        basicNotification({
          message: 'Database error',
          detail: errClient,
        }, 'Error');
        this.setStatus(0);
        return;
      }

      const host = {
        db: null,
        col: null,
      };

      try {
        host.db = await client.db(this.config.db);
      } catch (e) {
        basicNotification({
          message: 'Database error',
          detail: e,
        });
        this.setStatus(0);
        return;
      }

      try {
        host.col = await host.db.collection('shows');
      } catch (e) {
        basicNotification({
          message: 'Database error',
          detail: e,
        });
        this.setStatus(0);
        return;
      }

      host.col.find({}).toArray((errFind, items) => {
        if (errFind) {
          basicNotification({
            message: 'Database error',
            detail: errFind,
          }, 'Error');
          return;
        }

        this.mongoView.documentDom.refs.documents.update({ status: 1 }, items);
        client.close();
      });
    });
  }

  static async readCurrentFile() {
    const editor = atom.workspace.getActivePaneItem();
    const query = await editor.buffer.file.read(1);

    return query;
  }

  async runCommand() {
    try {
      this.config = await Client.readConfig();
    } catch (e) {
      isInvalidJSONConfig(e);
      return;
    }

    this.normalizeConfig();

    MongoClient.connect(this.config.Uri, this.config.options, async (errClient, client) => {
      if (errClient) {
        basicNotification({
          message: 'Database error',
          detail: errClient,
        }, 'Error');
        return;
      }

      const query = await Client.readCurrentFile();
      eval(query);
    });
  }

  async createConfig() {
    await Client.createConfig();
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

  static async readConfig() {
    if (!hasProject) return false;

    const configFile = new File(`${getSelectedProject()}/.mongoconfig`);
    const configExists = await configFile.exists();

    if (!configExists) {
      throw new MongoError('No exists .mongoconfig file', {
        dismissable: true,
        description: 'The active project no has config file.',
        buttons: [{
          className: 'btn btn-warning',
          text: 'Create config file',
          onDidClick: () => {
            commands('mongo:create-config');
          },
        }],
      });
    }

    const config = await configFile.read(true);

    try {
      return JSON.parse(config);
    } catch (e) {
      throw new MongoError('Bad JSON parse processing', {
        dismissable: true,
        detail: e,
      });
    }
  }

  static async createConfig() {
    if (!hasProject) return false;

    const configFile = new File(`${getSelectedProject()}/.mongoconfig`);
    const configExists = await configFile.exists();

    if (configExists) return true;

    await configFile.write(JSON.stringify(mongoConfigSchema, null, 2));

    return true;
  }
}

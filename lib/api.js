'use babel';

export default class Api {
  constructor(client) {
    this.client = client;
  }

  async connection() {
    await this.client.connection();
  }
}

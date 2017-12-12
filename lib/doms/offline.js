'use babel';

/** @jsx etch.dom */

const etch = require('etch');

module.exports =
class Document {
  constructor(properties) {
    this.properties = properties;

    etch.initialize(this);
    this.getTitle = () => 'Mongo';
  }

  render () {
    return <div className='mongo status-offline block'>
      <button className='inline-block btn' on={{click: this.didConnection}}>Connection</button>
    </div>
  }

  update(props, children) {
    return etch.update(this);
  }

  didConnection() {
    atom.project.mongo.connection();
  }

  async destroy() {
    await etch.destroy(this);
  }
};

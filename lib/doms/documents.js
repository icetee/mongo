'use babel'

/** @jsx etch.dom */

const etch = require('etch');
const Offline = require('./offline');

module.exports =
class Document {
  constructor(properties) {
    this.properties = properties;

    etch.initialize(this);
    this.getTitle = () => 'Mongo';
  }

  render () {
    if (this.properties.status) {
      return <div className='nuclide-ui-table mongo'>
        <div ref='header' className='nuclide-ui-table-header'>

        <div className='nuclide-ui-table-row'>
        </div>
        </div>
        <div ref='body' className='nuclide-ui-table-body'>
          Documents
        </div>
      </div>
    } else {
      return <Offline />
    }
  }

  async update(newProperties) {
    if (this.properties.status !== newProperties.status) {
      this.properties.status = newProperties.status
      await etch.update(this);
    } else {
      return Promise.resolve();
    }
  }

  async destroy() {
    await etch.destroy(this);
  }
};

'use babel';

/** @jsx etch.dom */

import etch from 'etch';
import { commands } from '../helper';
import EtchComponent from './etch-component';

export default class Interface extends EtchComponent {
  constructor (props, children) {
    super(props, children);
  }

  render () {
    return <div className='mongo status-offline block'>
      <div className='nuclide-ui-toolbar nuclide-ui-toolbar--top'>
        <div className='nuclide-ui-toolbar__left'>
          <button className='inline-block btn' on={{click: this.didConnection}}>Connection</button>
          <button className='inline-block btn' on={{click: this.didConfiguration}}>Configuration</button>
        </div>
        <div className='nuclide-ui-toolbar__right'>
          <button className="btn icon icon-gear btn-sm" on={{click: this.didGlobalSettings}}></button>
        </div>
      </div>
    </div>
  }

  didConnection() {
    commands('mongo:connection');
  }

  didConfiguration() {
    console.log('Not implemented');
    // commands('mongo:configuration');
  }

  didGlobalSettings() {
    atom.workspace.open('atom://config/packages/mongo');
  }
};

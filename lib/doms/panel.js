'use babel';

/** @jsx etch.dom */

import etch from 'etch';
import EtchComponent from './etch-component';
import Documents from './documents';
import Interface from './interface';

export const WORKSPACE_VIEW_URI = 'atom://mongo/panel';

export default class Panel extends EtchComponent {
  getTitle() {
    return 'Mongo';
  }

  getIconName() {
    return 'database';
  }

  getURI() {
    return WORKSPACE_VIEW_URI;
  }

  render() {
    return <div className='mongo-tab'>
      <Interface ref='interface' />
      <Documents ref='documents' />
    </div>;
  }
}

'use babel';

/** @jsx etch.dom */

import etch from 'etch';
import { commands } from '../helper';
import EtchComponent from './etch-component';
import checkBSONType from '../bson-types';

export default class Documents extends EtchComponent {
  constructor (props, children) {
    super(props, children);
  }

  render() {
    if (this.props.status === 1) {
      return <div className='mongo-documents tree-view'>
        <ol className='tree-view-root full-menu list-tree has-collapsable-children focusable-panel'>
          <li className='directory entry list-nested-item project-root expanded'>
            <div className="header list-item">
              <span className="id icon icon-database">mongo</span>
            </div>
            {this.children.map((object, index) => {
              return <Document ref={'document' + index} object={object} index={index} isExpanded={false} />;
            })}
          </li>
        </ol>
      </div>
    } else {
      return <div className='mongo-documents'><i>No connected to server.</i></div>
    }
  }
};

class Document extends EtchComponent {
  render() {
    return <document
      attributes={{index: this.props.index}}
      className={`directory entry list-nested-item ${this.props.isExpanded ? 'expanded' : 'collapsed'}`}
    >
    <div className="header list-item" on={{click: this.didCollapse}}>
      <span className="id icon icon-file-submodule">Document</span>
    </div>
    <ol className="entries list-tree">
      {
        (this.props.isExpanded) ? this.expand() : ''
      }
    </ol>
    </document>
  }

  expand() {
    return Object.keys(this.props.object).map((key, index) => {
      return <Page
        ref={'page' + index}
        key={key}
        value={this.props.object[key]}
        object={this.props.object}
      />;
    });
  }

  toggle() {
    const isExpanded = !this.props.isExpanded;

    this.update({ isExpanded });
  }

  didCollapse(e) {
    let target = null;

    if (e.target.parentElement.tagName === 'DOCUMENT') {
      target = e.target.parentElement;
    } else if (e.target.parentElement.parentElement.tagName === 'DOCUMENT') {
      target = e.target.parentElement.parentElement;
    }

    if (!target) return;

    this.toggle();
  }
}

class Objects extends EtchComponent {
  render() {
    return <li
      attributes={{index: this.props.index}}
      className={`directory entry list-nested-item ${this.props.isExpanded ? 'expanded' : 'collapsed'}`}
    >
      <objects>
      <ol className="entries list-tree">
        {
          (this.props.isExpanded) ? this.expand() : ''
        }
      </ol>
      </objects>
    </li>
  }

  expand() {
    return Object.keys(this.props.object).map((key, index) => {
      return <Page
        ref={'page' + index}
        key={key}
        value={this.props.object[key]}
        object={this.props.object}
      />;
    });
  }

  toggle() {
    const isExpanded = !this.props.isExpanded;

    this.update({ isExpanded });
  }

  didCollapse(e) {
    let target = null;

    if (e.target.parentElement.tagName === 'DOCUMENT') {
      target = e.target.parentElement;
    } else if (e.target.parentElement.parentElement.tagName === 'DOCUMENT') {
      target = e.target.parentElement.parentElement;
    }

    if (!target) return;

    this.toggle();
  }
}

class Page extends EtchComponent {
  render() {
    const type = checkBSONType.check(this.props.value);

    if (type === 'Object') {
      return <Objects object={this.props.value} isExpanded={true} />;
    }

    return <li className='directory entry list-nested-item collapsed status-ignored'>
      <ul>
        <li className='document-key'>{this.props.key}</li>
        <li className='document-value'>{this.props.value}</li>
        <li className='document-type'>{type}</li>
      </ul>
    </li>
  }
}

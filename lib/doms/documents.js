'use babel';

/** @jsx etch.dom */

import etch from 'etch';
import EtchComponent from './etch-component';
import checkBSONType from '../bson-types';

export default class Documents extends EtchComponent {
  render() {
    if (this.props.status === 1) {
      return <div class='mongo-documents tree-view'>
        <ol className='tree-view-root full-menu list-tree has-collapsable-children focusable-panel'>
          <li className={`directory entry list-nested-item project-root ${this.props.isExpanded ? 'expanded' : 'collapsed'}`}>
            <div className="header list-item" on={{ click: this.didCollapse }}>
              <span className="id icon icon-database">mongo</span>
            </div>
            {
              (this.props.isExpanded) ? this.expand() : ''
            }
          </li>
        </ol>
      </div>;
    }
    return <div className='mongo-documents'><i>No connected to server.</i></div>;
  }

  expand() {
    return this.children.map((object, index) => <Document ref={`document${index}`} object={object} index={index} isExpanded={false} />);
  }

  toggle() {
    const isExpanded = !this.props.isExpanded;

    this.update({ isExpanded });
  }

  didCollapse(e) {
    let target = null;

    if (e.target.parentElement.classList.contains('project-root')) {
      target = e.target.parentElement;
    } else if (e.target.parentElement.parentElement.classList.contains('project-root')) {
      target = e.target.parentElement.parentElement;
    }

    if (!target) return;

    this.toggle();
  }
}

class Document extends EtchComponent {
  render() {
    return <document
      attributes={{ index: this.props.index }}
      className={`directory entry list-nested-item ${this.props.isExpanded ? 'expanded' : 'collapsed'}`}
    >
    <div className="header list-item" on={{ click: this.didCollapse }}>
      <span className="id icon icon-file-submodule">Document</span>
    </div>
    <ol className="entries list-tree">
      {
        (this.props.isExpanded) ? this.expand() : ''
      }
    </ol>
    </document>;
  }

  expand() {
    return Object.keys(this.props.object).map((key, index) => <Page
        ref={`page${index}`}
        key={key}
        value={this.props.object[key]}
        object={this.props.object}
      />);
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
      attributes={{ index: this.props.index }}
      className={`directory entry list-nested-item has-collapsable-children ${this.props.isExpanded ? 'expanded' : 'collapsed'}`}
    >
      <div className="header list-item" on={{ click: this.didCollapse }}>
        <span className="id icon icon-file-submodule">{this.props.key}</span>
      </div>
      <ol className="entries list-tree">
        {
          (this.props.isExpanded) ? this.expand() : ''
        }
      </ol>
    </li>;
  }

  expand() {
    return Object.keys(this.props.object).map((key, index) => <Page
        ref={`page${index}`}
        key={key}
        value={this.props.object[key]}
        object={this.props.object}
      />);
  }

  toggle() {
    const isExpanded = !this.props.isExpanded;

    this.update({ isExpanded });
  }

  didCollapse(e) {
    let target = null;

    if (e.target.parentElement.classList.contains('has-collapsable-children')) {
      target = e.target.parentElement;
    } else if (e.target.parentElement.parentElement.classList.contains('has-collapsable-children')) {
      target = e.target.parentElement.parentElement;
    }

    if (!target) return;

    this.toggle();
  }
}

class Arrays extends EtchComponent {
  render() {
    return <li
      attributes={{ index: this.props.index }}
      className={`entry list-nested-item has-collapsable-children ${this.props.isExpanded ? 'expanded' : 'collapsed'}`}
    >
      <div className="header list-item" on={{ click: this.didCollapse }}>
        <span className="id icon icon-file-submodule">{this.props.key}</span>
      </div>
      <ol className="entries list-tree">
        {
          (this.props.isExpanded) ? this.expand() : ''
        }
      </ol>
    </li>;
  }

  expand() {
    return this.props.arrays.map((elem, index) => <Page
        ref={`page${index}`}
        key=''
        value={elem}
      />);
  }

  toggle() {
    const isExpanded = !this.props.isExpanded;

    this.update({ isExpanded });
  }

  didCollapse(e) {
    let target = null;

    if (e.target.parentElement.classList.contains('has-collapsable-children')) {
      target = e.target.parentElement;
    } else if (e.target.parentElement.parentElement.classList.contains('has-collapsable-children')) {
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
      return <Objects object={this.props.value} key={this.props.key} isExpanded={true} />;
    } else if (type === 'Array') {
      return <Arrays arrays={this.props.value} key={this.props.key} isExpanded={true} />;
    } else if (type === 'ObjectID') {
      return <Elem key={this.props.key} value={`ObjectId(${this.props.value.toString()})`} type={type} />;
    }

    return <Elem key={this.props.key} value={this.props.value} type={type} />;
  }
}

class Elem extends EtchComponent {
  render() {
    return <li className='entry list-nested-item collapsed status-ignored'>
      <ul>
        <li className='document-key'>{this.props.key}</li>
        <li className='document-value'>{(this.props.value === null) ? 'null' : this.props.value}</li>
        <li className='document-type'>{this.props.type}</li>
      </ul>
    </li>;
  }
}

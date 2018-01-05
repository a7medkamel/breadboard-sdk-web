/*
    ./client/index.js
    which is the webpack entry file
*/
import React from 'react';
import _ from 'lodash';
import ReactDOM from 'react-dom';
import EditorComponent from '../components/Editor.jsx';

import Bootstrap from 'bootstrap/dist/css/bootstrap.css';

export default class Editor {
  render(root, options = {}) {
    let elm = _.isString(root)
              ? document.getElementById(root)
              : root
              ;

    let { width         = '100%'
        , host          = 'github.com'
        , owner         = 'a7medkamel'
        , repo          = 'taskmill-help'
        , blob          = `module.exports = (req, res) => res.send({ message : 'Hello World!' });`
        , min_lines
        , max_lines
      } = options;

    ReactDOM.render(
      <EditorComponent
        blob={blob}
        host={host}
        owner={owner}
        repo={repo}
        width={width}
        min_lines={min_lines}
        max_lines={max_lines}
        style={{ height : '200px' }}
      />, elm);
  }
}

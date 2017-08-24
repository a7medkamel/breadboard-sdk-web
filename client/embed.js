/*
    ./client/index.js
    which is the webpack entry file
*/
import React from 'react';
import _ from 'lodash';
import ReactDOM from 'react-dom';
import Ide from './components/Ide.jsx';

import Bootstrap from 'bootstrap/dist/css/bootstrap.css';

export default class Breadboard {
  render(root) {
    let elm = _.isString(root)
              ? document.getElementById(root)
              : root
              ;

    ReactDOM.render(
      <Ide
        blob="module.exports = (req, res) => res.send({ name : 'yusuf' })"
        host="github.com"
        owner="a7medkamel"
        repo="taskmill-help"
        width='700px'
        editor={{ style : { height : '200px' }}}
        stdio={{ style : { height : '200px' }}}
        output={{ style : { height : '200px' }}}
      />, elm);
  }
}

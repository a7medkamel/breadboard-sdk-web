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
        http_method="GET"
        http_methods_allowed={["GET", "HEAD", "POST", "PUT", "DELETE", "CONNECT", "OPTIONS", "TRACE", "PATCH"]}
        http_content_type="application/json"
        http_content_type_allowed={["TEXT", "JSON", "XML"]}
        http_body={JSON.stringify({ name : 'adam' })}
        width='700px'
        editor={{ style : { height : '200px' }}}
        stdio={{ style : { height : '150px' }}}
        output={{ style : { height : '200px' }}}
      />, elm);
  }
}

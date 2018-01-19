/*
    ./client/index.js
    which is the webpack entry file
*/
import React from 'react';
import _ from 'lodash';
import ReactDOM from 'react-dom';
import Ide from '../components/Ide.jsx';

import Bootstrap from 'bootstrap/dist/css/bootstrap.css';

export default class Breadboard {
  render(root, options = {}) {
    let elm = _.isString(root)
              ? document.getElementById(root)
              : root
              ;

    let { width         = '100%'
        , host          = 'github.com'
        , owner         = 'a7medkamel'
        , repo          = 'taskmill-help'
        , breadboard
        , platform      = 'github'
        , token
        , http_method   = 'GET'
        , http_body     = JSON.stringify({})
        , blob          = `module.exports = (req, res) => res.send({ message : 'Hello World!' });`
        , show_gutter   = false
      } = options;

    ReactDOM.render(
      <Ide
        blob={blob}
        host={host}
        owner={owner}
        repo={repo}
        breadboard={breadboard}
        platform={platform}
        token={token}
        http_method={http_method}
        http_methods_allowed={["GET", "HEAD", "POST", "PUT", "DELETE", "CONNECT", "OPTIONS", "TRACE", "PATCH"]}
        http_content_type="application/json"
        http_content_type_allowed={["TEXT", "JSON", "XML"]}
        http_body={http_body}
        show_gutter={show_gutter}
        width={width}
        editor={{ style : { height : '200px' }}}
        stdio={{ style : { height : '150px' }}}
        output={{ style : { height : '200px' }}}
      />, elm);
  }
}

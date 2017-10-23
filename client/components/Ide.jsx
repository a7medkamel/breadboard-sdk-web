/*
    ./client/components/App.jsx
*/
import React from 'react';

import Editor from './Editor.jsx';
// import Stdio from './Stdio.jsx';
import Stdio from 'tailf.io-sdk-web/client/components/Stdio.jsx';
import Output from './Output.jsx';

import HTTP_Body from './http/http_body.jsx';
import HTTP_Method_Dropdown from './http/http_method.jsx';
import HTTP_ContentType_Dropdown from './http/http_content_type.jsx';

import tailf_sdk from 'tailf.io-sdk';
// import { Button, Navbar } from 'react-bootstrap';
import 'bootstrap';

import breadboard_sdk from 'breadboard-sdk';

import content_type from 'content-type';

import FontAwesome from 'react-fontawesome';

import FA from 'font-awesome/css/font-awesome.css';

export default class Ide extends React.Component {
  constructor(props) {
     super(props);
     this.state = {
        json          : undefined
      , state         : 'none'
      , content       : props['http_body'] || 'module.exports = (req, res) => res.send({ "message" : "Hello World!" })'
      , content_type  : props['http_content_type'] || 'application/json'
      , method        : props['http_method'] || 'GET'
      , tailf_uri     : undefined
      , tailf_token   : undefined
     }
  }

  run(blob, options = {}) {
    let { body, method, breadboard, headers = {} } = options;

    this.setState({ state : 'in_progress' });
    breadboard_sdk
      .run(this.props.host, this.props.owner, this.props.repo, '$.js', {
          blob
        , body
        , method
        , headers
        , breadboard
      })
      .then((response) => {
        let ct = content_type.parse(response.headers.get('content-type'));

        if (ct.parameters.charset == 'utf-8') {
          return response
                  .json()
                  .then((json) => this.setState({ json, state : 'done' }));
        }
      })
      .catch((err) => {
        this.setState({ state : 'error', error : err });
      });
  }

  onRun(e) {
    e.preventDefault();

    let { Api : TailfApi } = tailf_sdk;

    TailfApi
      .open({ })
      .then((result) => {
        let { id, token, uri, host } = result;

        let blob          = this.editor.state['blob']
          , method        = this.http_method_selector.state['selected'].name
          , body          = this.http_content.state['content']
          , content_type  = this.http_content_type_selector.state['selected'].content_type
          , headers       = { tailf : uri }
          ;

        if (content_type) {
          headers['Content-Type'] = content_type + '; charset=utf-8';
        }

        this.setState({ tailf_uri : uri, tailf_token : token });

        this.run(blob, { headers, method, body });
      });
  }

  onContentTypeChange(msg) {
    let { selected } = msg;

    this.http_content.setState({ content_type : selected.content_type });
    this.setState({ content_type : selected.content_type });
  }

  onContentHTTPMethod(msg) {
    let { selected } = msg;

    this.setState({ method : selected.name });
  }

  render() {
    const css = `
      .navbar  {
        margin-bottom: 0;
      }
    `

    let has_body = HTTP_Method_Dropdown.has_body(this.state['method']);

    return (
      <div className='container' style={{
          width   : this.props.width
        , editor  : this.props.editor
        , stdio   : this.props.stdio
        , output  : this.props.output
      }}>
        <style>{css}</style>
        <nav className="navbar navbar-light bg-faded navbar-expand-lg">
          <ul className="navbar-nav">
            <li className="nav-item active">
              <a className="nav-link" href="#" onClick={this.onRun.bind(this)}>
                <FontAwesome name='rocket' />&nbsp;Run
              </a>
            </li>
            <li className="nav-item dropdown">
              <HTTP_Method_Dropdown method={this.state.method} onChange={this.onContentHTTPMethod.bind(this)} ref={(child) => { this.http_method_selector = child; }} />
            </li>
            { has_body &&
              <li className="nav-item dropdown">
                <HTTP_ContentType_Dropdown content_type={this.state.content_type} onChange={this.onContentTypeChange.bind(this)} ref={(child) => { this.http_content_type_selector = child; }} />
              </li>
            }
          </ul>
        </nav>
        { has_body &&
          <HTTP_Body content_type={this.state.content_type} content={this.state.content} rows={5} style={{ height : '60px' }} ref={(child) => { this.http_content = child; }}/>
        }
        <Editor blob={this.props.blob} style={this.props.editor.style} ref={(child) => { this.editor = child; }}/>
        <Stdio state={this.state.state} uri={this.state.tailf_uri} token={this.state.tailf_token} style={this.props.stdio.style} show_footer={true} ref={(child) => { this.stdio = child; }}/>
        <Output state={this.state.state} error={this.state.error} json={this.state.json} style={this.props.output.style}/>
      </div>
    );
  }
}

// {running && (
//   <Stdio style={this.props.stdio.style} />
// )}

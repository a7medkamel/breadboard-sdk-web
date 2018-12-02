import React from 'react';

import Editor from './Editor.jsx';

import Stdio from 'tailf.io-sdk-web/client/components/Stdio.jsx';

import Output from './Output.jsx';

import HTTP_Body from './http/http_body.jsx';
import HTTP_Method_Dropdown from './http/http_method.jsx';
import HTTP_ContentType_Dropdown from './http/http_content_type.jsx';

import tailf_sdk from 'tailf.io-sdk';

import 'bootstrap';

import breadboard_sdk from 'breadboard-sdk';

import content_type from 'content-type';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faRocket } from '@fortawesome/free-solid-svg-icons'

import { HotKeys } from 'react-hotkeys';

import 'bootstrap/dist/css/bootstrap.css';

const keyMap = {
  'run': 'command+option+r'
};

export default class Ide extends React.Component {
  constructor(props) {
     super(props);
     this.state = {
        output        : undefined
      , output_type   : undefined
      , state         : 'none'
      , content       : props['http_body'] || 'module.exports = (req, res) => res.send({ "message" : "Hello World!" })'
      , content_type  : props['http_content_type'] || 'application/json'
      , method        : props['http_method'] || 'GET'
      , tailf_uri     : undefined
      , tailf_token   : undefined
     }
  }

  run(blob, options = {}) {
    let { body, method, headers = {} } = options;

    this.setState({ state : 'in_progress' });

    let { host, owner, repo, token, breadboard, platform } = this.props;

    breadboard_sdk
      .run(host, owner, repo, '$.js', {
          blob
        , body
        , method
        , headers
        , breadboard
        , platform
        , token
      })
      .then((response) => {
        // move this into breadboard_sdk
        // let ct = content_type.parse(response.headers.get('content-type'));
        let { extension } = response.breadboard
          , out           = undefined
          ;

        if (extension == 'json') {
          out = response.json();
        } else {
          // todo [akamel] handle non-text output
          out = response.text();
        }

        return out.then((output) => { return { output, output_type : extension }; });
      })
      .then((result) => {
        let { output, output_type } = result;

        this.setState({ output, output_type, state : 'done' });
      })
      .catch((err) => {
        this.setState({ state : 'error', error : err });
      });
  }

  onRun(e) {
    e && e.preventDefault();

    let { Api : TailfApi }  = tailf_sdk
      , host                = this.props['tailf']
      ;

    TailfApi
      .open({ host })
      .then((result) => {
        let { id, token, uri, host } = result;

        let blob          = this.editor.state['blob']
          , method        = this.http_method_selector.state['selected'].name
          , body          = undefined
          , content_type  = undefined
          , headers       = { tailf : uri }
          ;

        if (this.http_content) {
          body = this.http_content.state['content'];
        }

        if (this.http_content_type_selector) {
          content_type = this.http_content_type_selector.state['selected'].content_type;
        }

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

  componentDidMount() {
    // let dom = ReactDOM.findDOMNode(this);

    $('[data-toggle="tooltip"]').tooltip();
  }

  componentDidUpdate() {
    // let dom = ReactDOM.findDOMNode(this);

    $('[data-toggle="tooltip"]').tooltip();
  }

  render() {
    const css = `
      .navbar  {
        margin-bottom: 0;
      }

      .gutter {
        float: left;
        clear: both;
        margin-left: -150px;
        width: 150px;
        text-align: right;
        padding-right: 15px;
        font-weight: bold;
        text-transform: uppercase;
      }

      .gutter h1 {
        font-size: 0.65em;
        margin-top: 0.65em;
        color: #777;
      }
    `

    let has_body    = HTTP_Method_Dropdown.has_body(this.state['method'])
      , show_stdio  = this.state['state'] != 'none'
      , show_output = this.state['state'] != 'none'
      , show_gutter = this.props['show_gutter']
      , handlers = {
        'run': (event) => this.onRun()
      }
      ;

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
              <a className="nav-link" href="#" onClick={this.onRun.bind(this)} data-toggle="tooltip" title="⌘ + ⌥ + r">
                <FontAwesomeIcon icon={faRocket} />&nbsp;Run
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
        { has_body && [
            show_gutter && <div key="a" className="gutter"><h1>Request Body</h1></div>
          , <HTTP_Body key="b" content_type={this.state.content_type} content={this.state.content} rows={5} style={{ height : '60px' }} ref={(child) => { this.http_content = child; }}/>
        ]}
        <HotKeys keyMap={keyMap} handlers={handlers}>
          { show_gutter && <div className="gutter"><h1>Script</h1></div> }
          <Editor blob={this.props.blob} style={this.props.editor.style} ref={(child) => { this.editor = child; }}/>
        </HotKeys>
        { show_stdio && [
            show_gutter && <div key="a" className="gutter"><h1>Console</h1></div>
          , <Stdio key="b" uri={this.state.tailf_uri} token={this.state.tailf_token} style={this.props.stdio.style} ref={(child) => { this.stdio = child; }}/>
        ]}
        { show_output && [
            show_gutter && <div key="a" className="gutter"><h1>Output</h1></div>
          , <Output key="b" state={this.state.state} error={this.state.error} output={this.state.output} output_type={this.state.output_type} style={this.props.output.style}/>
        ]}
      </div>
    );
  }
}

// {running && (
//   <Stdio style={this.props.stdio.style} />
// )}

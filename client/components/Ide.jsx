/*
    ./client/components/App.jsx
*/
import React from 'react';

import Editor from './Editor.jsx';
// import Stdio from './Stdio.jsx';
import Stdio from 'tailf.io-sdk-web/client/components/Stdio.jsx';
import Output from './Output.jsx';

import tailf_sdk from 'tailf.io-sdk';
// import { Button, Navbar } from 'react-bootstrap';

import breadboard_sdk from 'breadboard-sdk';

import content_type from 'content-type';

import FontAwesome from 'react-fontawesome';

import FA from 'font-awesome/css/font-awesome.css';

export default class Ide extends React.Component {
  constructor(props) {
     super(props);
     this.state = {
        json  : undefined
      , state : 'none'
     }
  }

  run(blob, options = {}) {
    let { body, breadboard, headers = {} } = options;

    this.setState({ state : 'in_progress' });
    breadboard_sdk
      .run(this.props.host, this.props.owner, this.props.repo, '$.js', {
          blob
        , body
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

  onRun = () => {
    let { Api : TailfApi } = tailf_sdk;

    TailfApi
      .open({ })
      .then((result) => {
        let { id, token, uri, host } = result;

        let blob    = this.editor.state['blob']
          , headers = { tailf : uri }
          ;

        this.stdio.setState({ uri, token });

        this.run(blob, { headers });
      });
  }

  render() {
    const css = `
      .navbar  {
        margin-bottom: 0;
      }
    `

    // <Navbar staticTop={true}>
    //   <ul className="nav navbar-nav">
    //     <li>
    //       <a className="btn" onClick={this.onRun}>
    //         <i className="glyphicon glyphicon-play"></i><span>Run</span>
    //       </a>
    //     </li>
    //   </ul>
    // </Navbar>
    return (
      <div className='container' style={{
          width   : this.props.width
        , editor  : this.props.editor
        , stdio   : this.props.stdio
        , output  : this.props.output
      }}>
        <style>{css}</style>
        <nav className="navbar navbar-light bg-faded">
          <ul className="navbar-nav">
            <li className="nav-item active">
              <a className="nav-link" href="#" onClick={this.onRun}>
                <FontAwesome name='rocket' />&nbsp;Run
              </a>
            </li>
          </ul>
        </nav>
        <Editor blob={this.props.blob} style={this.props.editor.style} ref={(child) => { this.editor = child; }}/>
        <Stdio state={this.state.state} style={this.props.stdio.style} show_footer={true} ref={(child) => { this.stdio = child; }}/>
        <Output state={this.state.state} error={this.state.error} json={this.state.json} style={this.props.output.style}/>
      </div>
    );
  }
}

// {running && (
//   <Stdio style={this.props.stdio.style} />
// )}

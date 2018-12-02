import React from 'react';

import { render } from 'react-dom';

import { Jumbotron } from 'react-bootstrap';

// import JSONTree from 'react-json-tree'

import { ObjectInspector } from 'react-inspector'

import { BarLoader } from 'react-spinners';

export default class Output extends React.Component {
  render() {
    if (this.props.state == 'none') {
      return null;
    }

    // if (this.props.state == 'in_progress') {
      return (
          <div className="container" style={{ padding : "40px 0" }}>
            <div className="row justify-content-md-center align-items-center">
              <div className="col-12 col-md-auto">
                <BarLoader color={'#123abc'} width={400} height={8} loading={true} />
              </div>
            </div>
          </div>
      );
    // }

    if (this.props.state == 'done') {
      // <JSONTree data={this.props.json} />
      return (
        <div style={{ width : '100%', padding : '10px', height : this.props.style.height }}>
          <ObjectInspector data={this.props.json} />
        </div>
      );
    }

    if (this.props.state == 'error') {
      return (
        <Jumbotron>
          <h1 style={{'color' : '#bbb'}}>Error :(</h1>
        </Jumbotron>
      );
    }
  }
}

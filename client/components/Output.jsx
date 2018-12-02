import React from 'react';

import { render } from 'react-dom';

import { Jumbotron } from 'react-bootstrap';

import { ObjectInspector } from 'react-inspector'

import { BarLoader } from 'react-spinners';

export default class Output extends React.Component {
  render() {
    if (this.props.state == 'none') {
      return null;
    }

    if (this.props.state == 'in_progress') {
      return (
          <div className="container" style={{ padding : "40px 0" }}>
            <div className="row justify-content-md-center align-items-center">
              <div className="col-12 col-md-auto">
                <BarLoader
                  color={'#2F3129'}
                  width={300}
                  height={8}
                  loading={true}
                />
              </div>
            </div>
          </div>
      );
    }

    if (this.props.state == 'done') {
      if (this.props.output_type == 'json') {
        return (
          <div style={{ width : '100%', padding : '10px', height : this.props.style.height }}>
            <ObjectInspector data={this.props.output} expandLevel={2} />
          </div>
        );
      }

      return (
        <div style={{ width : '100%', padding : '10px', height : this.props.style.height }}>
          <div dangerouslySetInnerHTML={{ __html : this.props.output}} />
        </div>
      );
    }

    if (this.props.state == 'error') {
      return (
        <Jumbotron>
          <h1 style={{'color' : '#bbb'}}>
          Error :(
          </h1>
          <small className="text-muted">{this.props.error.toString()}</small>
        </Jumbotron>
      );
    }
  }
}

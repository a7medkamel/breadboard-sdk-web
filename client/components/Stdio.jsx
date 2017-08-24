import React from 'react';

import XTerm from 'react-xterm';

import XTermCSS from 'xterm/dist/xterm.css';

export default class Stdio extends React.Component {
  componentDidMount() {
    // var $this = $(ReactDOM.findDOMNode(this));
    // set el height and width etc.
    this.xtermjs.fit();
  }

  render() {
    const css = `
      .terminal.xterm  {
        height : ${this.props.style.height}
      }
    `
    return (
      <div style={{ height : this.props.style.height }}>
        <style>{css}</style>
        <XTerm ref={(child) => { this.xtermjs = child; }}/>
      </div>
    );
  }
}

import _ from 'lodash';

import React from 'react';

import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/mode/javascript';
import 'brace/mode/xml';
import 'brace/mode/text';
import 'brace/theme/github';

export default class HTTP_Body extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        content       : props['content']      | ''
      , content_type  : props['content_type']
    }
  }

  onChange = (text) => {
    this.setState({ content : text });
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.content_type != nextState.content_type) {
      return true;
    }

    return false;
  }

  componentDidMount() {
  }

  render() {
    let mode = 'javascript';

    switch(this.state.content_type) {
      case 'application/json':
      mode='javascript'
      break;
      case 'application/xml':
      case 'text/xml':
      mode='xml'
      break;
      case 'text/plain':
      mode='text'
      break;
    }

    // height={this.props.style.height}
    return (
      <AceEditor
        value={this.props.content}
        ref={(child) => { this.aceeditor = child; }}
        mode={mode}
        theme="github"
        onChange={this.onChange}
        width="100%"
        name="BREADBOARD_IDE_HTTP_BODY"
        maxLines={Infinity}
        minLines={this.props.rows}
        highlightActiveLine={true}
        editorProps={{
            $blockScrolling           : Infinity
          , vScrollBarAlwaysVisible   : false
          , hScrollBarAlwaysVisible   : false
          , showFoldWidgets           : false
          , displayIndentGuides       : true
        }}
      />);
  }
};

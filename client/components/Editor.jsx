/*
    ./client/components/App.jsx
*/
import React from 'react';

import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/mode/javascript';
import 'brace/theme/monokai';

// https://github.com/securingsincity/react-ace/blob/master/docs/FAQ.md
// https://github.com/securingsincity/react-ace/blob/master/docs/Ace.md
// http://securingsincity.github.io/react-ace/

export default class Editor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
       blob  : props.blob
    }
  }

  onChange = (text) => {
    this.setState({ blob : text });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }

  componentDidMount() {
  }

  render() {
    return (
      <AceEditor
        value={this.props.blob}
        ref={(child) => { this.aceeditor = child; }}
        mode="javascript"
        theme="monokai"
        onChange={this.onChange}
        height={this.props.style.height}
        width="100%"
        name="BREADBOARD_IDE_EDITOR"
        maxLines={Infinity}
        minLines={15}
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
}

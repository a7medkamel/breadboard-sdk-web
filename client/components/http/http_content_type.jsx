import _ from 'lodash';

import React from 'react';

const HTTP_CONTENT_TYPES = [
    { text : 'Text (text/plain)', content_type : 'text/plain' }
  , { text : 'JSON (application/json)', content_type : 'application/json' }
  , { text : 'XML (application/xml)', content_type : 'application/xml' }
  , { text : 'XML (text/xml)', content_type : 'text/xml' }
];

export default class HTTP_ContentType_Dropdown extends React.Component {
  constructor(props) {
     super(props);
     this.state = {
        selected : _.find(HTTP_CONTENT_TYPES, { 'content_type': this.props.content_type })
     }
  }

  select(e, m) {
    e.preventDefault();
    this.setState({ selected : m })

    this.props.onChange({ selected : m });
  }

  render() {
    return (
      <div>
        <a className="nav-link dropdown-toggle" href="#" id="BREADBOARD_IDE_CONTENT_TYPE_DROPDOWN" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          {this.state.selected.text}
        </a>
        <div className="dropdown-menu" aria-labelledby="BREADBOARD_IDE_CONTENT_TYPE_DROPDOWN">
          {this.renderListItems()}
        </div>
      </div>
    );
  }

  renderListItems() {
    return _.map(HTTP_CONTENT_TYPES, (m) => {
            return <a key={m.content_type} className="dropdown-item" href="#" onClick={(e) => this.select(e, m)}>{m.text}</a>
          });
  }
};

import _ from 'lodash';

import React from 'react';


const HTTP_METHODS = [
    { name : 'GET', has_body : false }
  , { name : 'HEAD', has_body : false }
  , { name : 'POST', has_body : true }
  , { name : 'PUT', has_body : true }
  , { name : 'DELETE', has_body : false }
  , { name : 'CONNECT', has_body : false }
  , { name : 'OPTIONS', has_body : false }
  , { name : 'TRACE', has_body : false }
  , { name : 'PATCH', has_body : true }
];

export default class HTTP_Method_Dropdown extends React.Component {
  constructor(props) {
     super(props);
     this.state = {
       selected : _.find(HTTP_METHODS, { 'name': this.props.method })
     }
  }

  static has_body(method) {
    let ret = _.find(HTTP_METHODS, { 'name': method });
    return ret? ret.has_body : false;
  }

  select(e, m) {
    e.preventDefault();
    this.setState({ selected : m })

    this.props.onChange({ selected : m });
  }

  render() {
    return (
      <div>
        <a className="nav-link dropdown-toggle" href="#" id="BREADBOARD_IDE_METHOD_DROPDOWN" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          {this.state.selected.name}
        </a>
        <div className="dropdown-menu" aria-labelledby="BREADBOARD_IDE_METHOD_DROPDOWN">
          {this.renderListItems()}
        </div>
      </div>
    );
  }

  renderListItems() {
    return _.map(HTTP_METHODS, (m) => {
            return <a key={m.name} className="dropdown-item" href="#" onClick={(e) => this.select(e, m)}>{m.name}</a>
          });
  }
};

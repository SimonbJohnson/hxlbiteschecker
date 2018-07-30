import React, { Component } from 'react';
import './App.css';
import DataInputs from './DataInputs.jsx';
import HXLBites from './HXLBites.jsx';
import 'semantic-ui-css/semantic.css';


class App extends Component {

  constructor(props){
    super(props)
    this.state = { hxlData: null};
    this.initBites = this.initBites.bind(this);
  }

  initBites(data){
    this.setState({hxlData:data});
  }

  render() {
    return (
      <div>
        <DataInputs onLoad={this.initBites} />

        <HXLBites data={this.state.hxlData} show='charts' />
      </div>
    );
  }
}

export default App;
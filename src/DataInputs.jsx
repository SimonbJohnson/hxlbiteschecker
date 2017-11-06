import React, { Component } from 'react';
import { Input, Button } from 'semantic-ui-react'
import axios from 'axios';

class DataInputs extends Component {

  constructor(props){
    super(props)
    this.state = { hxlURL: null};
    this.setURL = this.setURL.bind(this);
    this.loadData = this.loadData.bind(this);
  }

  loadData(){
    let self = this;
    let url = 'https://proxy.hxlstandard.org/data.json?force=on&url=' + encodeURIComponent(this.state.hxlURL);
    axios
      .get(url)
      .then(function(result) {
        self.props.onLoad(result.data);
      });   
  }

  setURL(e){
    this.setState({hxlURL:e.target.value});
  }

  render() {
    return (
      <div>
        <Input id="urlinput" placeholder='url of data set' onChange={this.setURL} /><Button onClick={this.loadData} >Load</Button>
      </div>
    );
  }
}

export default DataInputs;
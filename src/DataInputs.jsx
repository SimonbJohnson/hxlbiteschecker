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

  componentDidMount(){
    this.urlParams = new URLSearchParams(window.location.search);
    let hxlURL = null;
    let paramsURL = this.urlParams.getAll('url');
    console.log(paramsURL);
    if(paramsURL.length>0){
      hxlURL = paramsURL[0];
      this.setState({ hxlURL: hxlURL},this.loadData);
    }  
  }

  loadData(){
    let self = this;
    window.history.pushState('', 'HXL Bites Checker', '?url='+this.state.hxlURL);
    let hxlProxyURL = 'https://proxy.hxlstandard.org/data.json?force=on&url=' + encodeURIComponent(this.state.hxlURL);
    axios
      .get(hxlProxyURL)
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
        <Input id="urlinput" placeholder='url of data set' value={this.state.hxlURL} onChange={this.setURL} /><Button onClick={this.loadData} >Load</Button>
      </div>
    );
  }
}

export default DataInputs;
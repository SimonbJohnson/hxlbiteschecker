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
    let hxlURL = null;
    var paramURL = decodeURIComponent(getUrlVars()["url"]);
    if(paramURL.length>0){
      hxlURL = paramURL;
      this.setState({ hxlURL: hxlURL},this.loadData);
    }

    function getUrlVars() {
      var vars = {};
      var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,    
      function(m,key,value) {
        vars[key] = value;
      });
    return vars;
  }  
  }

  loadData(){
    let self = this;
    let param = encodeURIComponent(this.state.hxlURL);
    window.history.pushState('', 'HXL Bites Checker', '?url='+param);
    let hxlProxyURL = 'https://proxy.hxlstandard.org/data.json?force=on&url=' +param;
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
import React, { Component } from 'react';
import SimpleMap from './simple-leaflet-geojson.jsx';
import * as topojson from 'topojson';
import axios from 'axios';

class MapBites extends Component {

    render(){
      let bites = [];

      this.props.bites.forEach(function(map,i){
        let key = 'map'+i
        let codes = {};
        map.bite.forEach(function(d,i){
          codes[d[0]] = d[1];
        });
        bites.push(<MapBite key={key} uniqueKey={key} url={map.geom_url} title={map.title} codes={codes} attribute={map.geom_attribute} id={map.id} uniqueID={map.uniqueID} />);
      });

      return (
        <div>{bites}</div>
      )      
    }
}

class MapBite extends Component {

  constructor(props){
      super(props)
      this.state = { loading: true, geom: []};
      this.loadGeoms(this.props.url);
  }

  /*componentWillReceiveProps(nextProps) {
    this.state = { loading: true, geom: null};
    this.loadGeoms(nextProps.url);
  }*/

  loadGeoms(urls){
    var self = this;
    if(urls.length>0){

      axios
        .get(urls[0])
        .then(function(result) {
          var geom = {};
          if(result.data.type=='Topology'){
            geom = topojson.feature(result.data,result.data.objects.geom);
          } else {
            geom = result.data;
          }
          self.setState({geom: self.state.geom.concat(geom)},
            function(){
              self.loadGeoms(urls.slice(1));
            }
          );
        });
    } else {
      self.setState({loading: false});
    }
  }

  render(){

    let comp = null;
    let colors = ["#CCCCCC","#FFCDD2","#E57373","#F44336","#D32F2F","#B71C1C"];
    if(this.state.loading){
      comp = <h1>Loading Map</h1>;
    } else {
      comp = <SimpleMap uniqueKey={this.props.uniqueKey} width="350" height="400" geom={this.state.geom} colors={colors} codes={this.props.codes} attribute={this.props.attribute} />;
    }
    return (
      <div className="mapbite">{this.props.title} - {this.props.id} - {this.props.uniqueID}<div>{comp}</div></div>
    )
  }
}

  export default MapBites;
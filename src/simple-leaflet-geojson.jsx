import React, { Component } from 'react';
import L from 'leaflet'
import 'leaflet/dist/leaflet.css';

class SimpleMap extends Component {

	componentDidMount() {

    var bounds = [];
    // create map
    this.map = L.map(this.props.uniqueKey, {
      center: [0, 0],
      zoom: 1,
      layers: [
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }),
      ]
    });

    var self = this;

		let maxValue = 0;
    let key = '';
    for (key in self.props.codes){
      if(self.props.codes[key]>maxValue){
        maxValue = self.props.codes[key];
      }
    }
    let colorLength = self.props.colors.length;    

    var getColor = function(feature){
    	let featureCode = feature.properties[self.props.attribute];

			if(isNaN(self.props.codes[featureCode])){
        return '#cccccc'
      } else {
        let value = self.props.codes[featureCode];
        let index = Math.ceil(value/maxValue*(colorLength-1));
        return self.props.colors[index];
      }
    }

    var style = function(feature){
    	return{
        className: self.props.uniqueKey+feature.properties[self.props.attribute],
	      weight: 1,
	      opacity: 1,
	      color: getColor(feature),
	      dashArray: '3',
	      fillOpacity: 0.7
	    }
    }

    var info = L.control();

    info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info');
        this.update();
        return this._div;
    };

    info.update = function (id) {
        var value = 0;
        if(!isNaN(self.props.codes[id])){
          value = self.props.codes[id];
        }
                               
        this._div.innerHTML = (id ?
            '<b>Value:</b> ' + value
            : 'Hover for value');
    };

    info.addTo(this.map);

    function onEachFeature(feature, layer) {
        var featureCode = feature.properties[self.props.attribute];
        if(!isNaN(self.props.codes[featureCode])){
          bounds.push(layer.getBounds());
        }
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
        });
    }

    function highlightFeature(e) {
       info.update(e.target.feature.properties[self.props.attribute]);
    }

    function resetHighlight(e) {
      info.update();
    }
    var layer
    this.props.geom.forEach(function(g){
      layer = L.geoJSON(g,{
        style:style,
        onEachFeature: onEachFeature
      }).addTo(self.map);    
    });
    var fitBound = bounds[0];
    bounds.forEach(function(bound){
      if(fitBound._northEast.lat>bound._northEast.lat){
        fitBound._northEast.lat=bound._northEast.lat;
      }
      if(fitBound._northEast.lng>bound._northEast.lng){
        fitBound._northEast.lng=bound._northEast.lng;
      }
      if(fitBound._southWest.lng<bound._southWest.lng){
        fitBound._southWest.lng=bound._southWest.lng;
      }
      if(fitBound._southWest.lat<bound._southWest.lat){
        fitBound._southWest.lat=bound._southWest.lat;
      }                           
    });

    console.log(fitBound);
		this.map.fitBounds(fitBound);
  }

  render() {

  	return (
  		<div id={this.props.uniqueKey} style={{width:this.props.width+'px',height:this.props.height+'px'}}></div>)
	}
}

export default SimpleMap;
import React, { Component } from 'react';
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell} from 'recharts';
import SimpleMap from './simple-map.jsx'
import * as topojson from 'topojson';
import axios from 'axios';
/* global hxlBites */

class TextBites extends Component {

  render(){

    let bites = [];

    this.props.bites.forEach(function(bite,i){
      let key = 'text'+i;
      bites.push(<li key={key} dangerouslySetInnerHTML={{__html: bite.id + " - " + bite.bite}}></li>)
    });

    return (
      <ul>
        {bites}
      </ul>
    )
  }
}

class TableBites extends Component {

  render(){

    let bites = [];
    this.props.bites.forEach(function(bite,i){
      let key = 'table'+i;
      bites.push(<div  key={key}>{bite.id} - {bite.uniqueID} - {bite.title}<div dangerouslySetInnerHTML={{__html: bite.html}}></div></div>)
    });

    return (
      <div>
        {bites}
      </div>
    )
  }
}

class CrossTableBites extends Component {

  render(){
    let bites = [];
    this.props.bites.forEach(function(bite,i){
      let key = 'crosstable'+i;
      bites.push(<div key={key}>{bite.id} - {bite.uniqueID} - {bite.title}<div dangerouslySetInnerHTML={{__html: bite.html}}></div></div>)
    });

    return (
      <div>
        {bites}
      </div>
    )
  }
}

class ChartBites extends Component {

  render(){

    let bites = [];
    this.props.bites.forEach(function(chart,i){
      let key = 'chart'+i
      if(chart.subtype==='pie'){
        bites.push(<Pie3WChart key={key} data={chart.bite} title={chart.title} id={chart.id} uniqueID={chart.uniqueID}/>);
      } else {
        bites.push(<Row3WChart key={key} data={chart.bite} title={chart.title} id={chart.id} uniqueID={chart.uniqueID}/>);
      }
    });

   

    return (
      <div>{bites}</div>
    )
  }
}

class MapBites extends Component {

    render(){
      let bites = [];

      this.props.bites.forEach(function(map,i){
        let key = 'map'+i
        let codes = {};
        map.bite.forEach(function(d,i){
          codes[d[0]] = d[1];
        });
        bites.push(<MapBite key={key} url={map.geom_url} title={map.title} codes={codes} attribute={map.geom_attribute} id={map.id} uniqueID={map.uniqueID} />);
      });

      return (
        <div>{bites}</div>
      )      
    }
}

class MapBite extends Component {

  constructor(props){
      super(props)
      this.state = { loading: true, geom: null};
      this.loadGeom(this.props.url);
  }

  componentWillReceiveProps(nextProps) {
    this.state = { loading: true, geom: null};
    this.loadGeom(nextProps.url);
  }

  loadGeom(url){
    let self = this;

    axios
      .get(url)
      .then(function(result) {
        let geom = topojson.feature(result.data,result.data.objects.geom);
        self.setState({geom: geom, loading: false});
      });
  }

  render(){

    let comp = null;
    let colors = ["#CCCCCC","#FFCDD2","#E57373","#F44336","#D32F2F","#B71C1C"];
    if(this.state.loading){
      comp = <h1>Loading Map</h1>;
    } else {
      comp = <SimpleMap width="350" height="400" geom={this.state.geom} colors={colors} codes={this.props.codes} attribute={this.props.attribute} />;
    }
    return (
      <div className="mapbite">{this.props.title} - {this.props.id} - {this.props.uniqueID}<div>{comp}</div></div>
    )
  }
}

class Pie3WChart extends Component {

  render(){

    let colors = ['#EF5350','#FFAB00','#43A047','#90CAF9'];

    return (
      <div>
        <p>{this.props.title} - {this.props.id} - {this.props.uniqueID}</p>
        <PieChart width={350} height={400} isAnimationActive={false}>
          <Pie data={this.props.data} cx="50%" cy="50%" outerRadius={60} label={({name, value})=>`${name}: ${value}`} dataKey="value" labelLine={false} isAnimationActive={false}>
            {
              this.props.data.map((d, index) => (
                <Cell key={`cell-${index}`} fill={colors[index]} />
              ))
            }
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>
    )
  }
}

class Row3WChart extends Component {

  render () {

    let color = '#EF5350';

    return (
      <div>
        <p>{this.props.title} - {this.props.id} - {this.props.uniqueID}</p>
        <BarChart width={350} height={400} data={this.props.data}
              margin={{top: 5, right: 20, left: 50, bottom: 5}} layout='vertical'>
         <XAxis type="number" allowDecimals={false} />
         <YAxis type="category" dataKey="name" />
         <CartesianGrid strokeDasharray="3 3" />
         <Tooltip />
         <Legend />
         <Bar dataKey="value" fill={color} isAnimationActive={false} />
        </BarChart>
      </div>
    );
  }
}

class HXLBites extends Component {

  getNamedArray(data){
    let headers = ['name','value'];
    let output = [];
    data.forEach(function(row,i){
      if(i>0){
        let newRow = {};
        row.forEach(function(d,j){
          let header = headers[j];
          newRow[header] = d; 
        });
        output.push(newRow);
      }
    });
    return output;
  }

  render() {

    let self = this;
    let textBites = [];
    let chartBites = [];
    let mapBites = [];
    let tableBites = [];
    let crossTableBites = [];

    if(this.props.data!=null){
      console.log(this.props.data);
      textBites = hxlBites.data(this.props.data).getTextBites();
      textBites.sort(function(a,b){
        return b.priority > a.priority;
      });

      chartBites = hxlBites.getChartBites();
      chartBites.sort(function(a,b){
        return b.priority > a.priority;
      });
      chartBites.forEach(function(bite){
        bite.bite = self.getNamedArray(bite.bite)
      });
      console.log(chartBites);
      mapBites = hxlBites.getMapBites();
      tableBites = hxlBites.getTableBites();
      tableBites.forEach(function(bite){
        bite.html = hxlBites.render(null,bite);
      });
      crossTableBites = hxlBites.getCrossTableBites();
      crossTableBites.forEach(function(bite){
        bite.html = hxlBites.render(null,bite);
      });
    }


    return (
      <div>
        <h1>Texts</h1>
        <TextBites bites={textBites} />
        <h1>Charts</h1>
        <ChartBites bites={chartBites} />
        <h1>Maps</h1>
        <MapBites bites={mapBites} />
        <h1>Cross Tables</h1>
        <CrossTableBites bites={crossTableBites} />        
        <h1>Tables</h1>
        <TableBites bites={tableBites} />
      </div>
    );
  }
}

export default HXLBites;
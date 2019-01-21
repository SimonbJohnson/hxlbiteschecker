import React, { Component } from 'react';
import ChartBites from './ChartBites.jsx';
import MapBites from './MapBites.jsx';
import TextBites from './TextBites.jsx';
import TableBites from './TableBites.jsx';
import CrossTableBites from './CrossTableBites.jsx';
import axios from 'axios';
import { Tab } from 'semantic-ui-react'
/* global hxlBites */

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
    let lineBites = [];

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

      lineBites = hxlBites.getTimeSeriesBites();

      lineBites.sort(function(a,b){
        return b.priority > a.priority;
      });

      lineBites.forEach(function(bite){
        bite.bite = self.getNamedArray(bite.bite)
        bite.bite.forEach(function(d){
          d['name'] = d['name'].getTime ();
        });
      });

      console.log(lineBites);

      chartBites = lineBites.concat(chartBites);

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

      const panes = [
        { menuItem: 'Charts', render: () => <Tab.Pane><ChartBites bites={chartBites} /></Tab.Pane> },
        { menuItem: 'Maps', render: () => <Tab.Pane><MapBites bites={mapBites} /></Tab.Pane> },
        { menuItem: 'CrossTables', render: () => <Tab.Pane><CrossTableBites bites={crossTableBites} /></Tab.Pane> },
        { menuItem: 'Text', render: () => <Tab.Pane><TextBites bites={textBites} /></Tab.Pane> },
        { menuItem: 'Tables', render: () => <Tab.Pane><TableBites bites={tableBites} /></Tab.Pane> },
      ]

      return (
        <Tab panes={panes} />
      )
    }

}

export default HXLBites;
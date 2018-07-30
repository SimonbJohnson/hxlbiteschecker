import React, { Component } from 'react';
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell} from 'recharts';

class Pie3WChart extends Component {

  render(){

    let colors = ['#EF5350','#FFAB00','#43A047','#90CAF9'];

    return (
      <div className="chartbite">
        <p>{this.props.title} - {this.props.id} - {this.props.uniqueID}</p>
        <PieChart width={400} height={500} isAnimationActive={false}>
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
      <div className="chartbite">
        <p>{this.props.title} - {this.props.id} - {this.props.uniqueID}</p>
        <BarChart width={400} height={500} data={this.props.data}
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

export default ChartBites
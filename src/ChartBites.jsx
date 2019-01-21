import React, { Component } from 'react';
import {LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell} from 'recharts';

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

class Line3WChart extends Component {

  formatXAxis(tick){
    let labeltext = new Date(tick).toISOString().slice(0,10);
    return labeltext;
  }

  render () {

    let color = '#EF5350';

    return (
      <div className="chartbite">
        <p>{this.props.title} - {this.props.id} - {this.props.uniqueID}</p>
        <LineChart width={400} height={500} data={this.props.data}
              margin={{top: 5, right: 20, left: 50, bottom: 5}} >
         <XAxis type="number" dataKey="name" domain={['dataMin', 'dataMax']} tickFormatter={this.formatXAxis}/>
         <YAxis />
         <CartesianGrid strokeDasharray="3 3" />
         <Tooltip labelFormatter={this.formatXAxis} />
         <Legend />
         <Line type="monotone" dataKey="value" stroke={color} dot={false}/>
        </LineChart>
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
      } else if (chart.subtype==='row') {
        bites.push(<Row3WChart key={key} data={chart.bite} title={chart.title} id={chart.id} uniqueID={chart.uniqueID}/>);
      } else if (chart.subtype==='line') {
        bites.push(<Line3WChart key={key} data={chart.bite} title={chart.title} id={chart.id} uniqueID={chart.uniqueID}/>);
      }
    });

   

    return (
      <div>{bites}</div>
    )
  }
}

export default ChartBites
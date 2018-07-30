import React, { Component } from 'react';

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

export default TableBites
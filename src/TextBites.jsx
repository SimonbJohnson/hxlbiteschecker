import React, { Component } from 'react';

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

export default TextBites
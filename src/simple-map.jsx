import React, { Component } from 'react'
import { geoMercator, geoPath } from 'd3-geo'
import { select } from 'd3-selection'
import { max } from 'd3-array'


class SimpleMap extends Component {

   constructor(props){
      super(props)
      this.createMap = this.createMap.bind(this)
   }
   componentDidMount() {
      this.createMap()
   }

   componentDidUpdate() {
      this.createMap()
   }
   createMap() {

      let self = this;
      const node = this.node
      let maxValue = 0;
      let key = '';
      for (key in self.props.codes){
         if(self.props.codes[key]>maxValue){
            maxValue = self.props.codes[key];
         }
      }
      let colorLength = self.props.colors.length;
      select(node).selectAll("*").remove();

      var svg = select(node)
          .append('g');

      var projection = geoMercator()
          .center([0, 0])
          .scale(this.props.width/6)
          .translate([this.props.width / 2, this.props.height / 2]);

      var path = geoPath().projection(projection);    

      svg.selectAll("path")
         .data(self.props.geom.features)
         .enter().append("path")
         .attr("d", path)
         .attr("fill",function(d){
            let featureCode = d.properties[self.props.attribute];            
            if(isNaN(self.props.codes[featureCode])){
               return '#cccccc'
            } else {
               let value = self.props.codes[featureCode];
               let index = Math.ceil(value/maxValue*(colorLength-1));
               return self.props.colors[index];
            }           
         })
         .attr("stroke","#ffffff")
         .attr("stroke-width","0.5px")
         .attr('id',function(d){
            return 'country'+d.properties[self.props.attribute];
         });
         let bound = [];
         let set = false;
         for (key in this.props.codes){
            let geom = select('#country'+key)
            if(!geom.empty()){
               let bounds = geom.node().getBBox();
               if(!set){
                  bound = [bounds.x,bounds.y,bounds.x+bounds.width,bounds.y+bounds.height];
                  set = true;
               } else {
                  if(bound[0]>bounds.x){
                     bound[0] = bounds.x;
                  }
                  if(bound[1]>bounds.y){
                     bound[1] = bounds.y;
                  }
                  if(bound[2]<bounds.x+bounds.width){
                     bound[2] = bounds.x+bounds.width;
                  }
                  if(bound[3]<bounds.y+bounds.height){
                     bound[3] = bounds.y+bounds.height;
                  }                  
               }
            }
         };
      
         let dx = (bound[2]-bound[0]);
         let dy = (bound[3]-bound[1]);
         let x = bound[0]+dx/2;
         let y = bound[1]+dy/2;
         let scale = .6 / Math.max(dx / this.props.width, dy / this.props.height);
         if(scale<1){
            scale = 1;
         }
         let translate = [this.props.width / 2 - scale * (x), this.props.height / 2 - scale * (y)];

      svg.attr("transform", "translate(" + translate + ")scale(" + scale + ")");
      svg.selectAll("path").attr("stroke-width",(0.5/scale)+"px")
   }

   render() {
      return <svg ref={node => this.node = node}
      width={this.props.width} height={this.props.height}>
      </svg>
   }
}

export default SimpleMap
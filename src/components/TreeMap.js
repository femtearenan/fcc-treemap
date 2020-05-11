import React from 'react';
import { connect } from 'react-redux';
import * as d3 from 'd3';
import { color } from 'd3';

class TreeMap extends React.Component {

    constructor(props) {
        super(props);
        this.drawMapIfOk = this.drawMapIfOk.bind(this);
        this.drawMap = this.drawMap.bind(this);
    }

    drawMapIfOk() {
        if (this.props.appReducer.isOK) {
            this.drawMap();
        }
    }

    drawMap() {
        console.log("drawMap is called!");
        const dimension = {
            width: 800,
            height: 800
        }
        const margin = {
            top: 1,
            right: 1,
            bottom: 1,
            left: 1
        }
        const color = d3.scaleOrdinal([...d3.schemeCategory10, ...d3.schemeAccent]);

        const kickstarterData = this.props.appReducer.kickstarterData;
        const movieData = this.props.appReducer.movieData;
        const gameData = this.props.appReducer.gameData;
        let hierarchy = d3.hierarchy(movieData);
        hierarchy.sum( d => d.value);
        console.log(hierarchy);

        const canvas = d3.select("#treemap")
            .append("svg")
            .attr("width", dimension.width + margin.left + margin.right)
            .attr("height", dimension.height + margin.top + margin.bottom);

        const treemap = d3.treemap()
            .size([dimension.width, dimension.height])
            .paddingTop(margin.top)
            .paddingRight(margin.right)
            .paddingBottom(margin.bottom)
            .paddingLeft(margin.left);

        const root = treemap(hierarchy);

        const nodes = canvas
            .selectAll("g")
            .data(root.descendants())
            .enter()
            .append("g")
            .attr("transform", d => `translate(${[d.x0, d.y0]})`)

        nodes
            .append("rect")
            .attr("width", d => {
                return d.x1 - d.x0
            })
            .attr("height", d => d.y1 - d.y0)
            .attr("fill", d => d.children ? null : color(d.parent.data.name));
        
        nodes
            .append("text")
            .attr("dx", 5)
            .attr("dy", 10)
            .style("font-size", "7px")
            .text(d => d.data.name)        
        
        const legendWidth = 500;
        const legendHeight = 50;
        const legend = d3.select("#treemap")
            .append("svg")
            .attr("id", "legend")
            .attr("width", legendWidth)
            .attr("height", legendHeight);

        const rectWidth = legendWidth/root.children.length;
        
            // console.log(root.children);
        legend.selectAll("rect")
            .data(root.children)
            .enter()
            .append("rect")
            .attr("x", (d, i) => rectWidth*i)
            .attr("y", 0)
            .attr("height", legendHeight)
            .attr("width", rectWidth)
            .attr("fill", d => {
                console.log(d.data.name);
                return color(d.data.name);
            });
        
        legend.selectAll("text")
            .data(root.children)
            .enter()
            .append("text")
            .attr("x", (d, i) => 10 + rectWidth*i)
            .attr("y", legendHeight/2)
            .style("font-size", "12px")
            .text(d => d.data.name);
        
            
        
    }

    render() {
        return (
            <div id="treemap">
                {this.drawMapIfOk()}
            </div>
        )
    }
}

const mapStateToProps = state => ({
    ...state
});
export default connect(mapStateToProps)(TreeMap);
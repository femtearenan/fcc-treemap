import React from 'react';
import { connect } from 'react-redux';
import * as d3 from 'd3';

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
        const dimension = {
            width: 900,
            height: 600
        }
        const margin = {
            top: 1,
            right: 1,
            bottom: 1,
            left: 1
        }
        const color = d3.scaleOrdinal([...d3.schemeCategory10, ...d3.schemeAccent]);

        const movieData = this.props.appReducer.movieData;
        let hierarchy = d3.hierarchy(movieData);
        hierarchy.sum( d => d.value);

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
            .attr("transform", d => `translate(${[d.x0, d.y0]})`);

        const tooltip = d3.select("#treemap")
            .append("div")
            .attr("id", "tooltip");

        nodes
            .append("rect")
            .attr("class", d => d.children === undefined ? "tile" : null)
            .attr("width", d => {
                return d.x1 - d.x0
            })
            .attr("height", d => d.y1 - d.y0)
            .attr("fill", d => d.children ? null : color(d.parent.data.name))
            .attr("data-name", d => d.data.name)
            .attr("data-category", d => d.parent === null ? d.data.name : d.parent.data.name)
            .attr("data-value", d => {
                return d.data.value;
            })
            .on("mouseover", d => {
                tooltip.html(`Category: ${d.parent === null ? d.data.name : d.parent.data.name}`).attr("data-value", d.data.value).style("opacity", 1)
            })
            .on("mouseout", () => tooltip.style("opacity", 0));
        
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
        
        legend.selectAll("rect")
            .data(root.children)
            .enter()
            .append("rect")
            .attr("class", "legend-item")
            .attr("x", (d, i) => rectWidth*i)
            .attr("y", 0)
            .attr("height", legendHeight)
            .attr("width", rectWidth)
            .attr("fill", d => {
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
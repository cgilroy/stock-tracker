import React from 'react';
import ReactDOM from 'react-dom';
import ChartistGraph from 'react-chartist';
import './css/chartist.scss'
import './css/chartist.css'
import { formatMoney } from './helpers.js'
const Chart = (props) => {

  var Chartist = require('chartist')
  var tooltip = require('chartist-plugin-tooltip')

  if (props.chartType === 'stock') {
    var tempCoordinates = []
    var xData = []
    var yData = []
    var xIter = 1
    for (let dayData of props.data) {
      tempCoordinates.push(
        {x:xIter,y:parseFloat(dayData[1]["4. close"])}
      )
      let xLabel = dayData[0]
      xData.push(xLabel)
      yData.push(parseFloat(dayData[1]["4. close"]))
      xIter++;
    }
    var data = {
      labels: xData,
      series: [
        yData
      ]
    };
  } else if (props.chartType === 'summary') {
    var tempCoordinates = []
    var xData = []
    var yData = []
    var xIter = 1
    for (let dayData of props.data) {
      tempCoordinates.push(
        {x:xIter,y:parseFloat(dayData.totalHoldings)}
      )
      xData.push(dayData.date)
      yData.push(parseFloat(dayData.totalHoldings))
      xIter++;
    }
    var data = {
      labels: xData,
      series: [
        yData
      ]
    };
  }

  const getLabelDivisor = () => {
    switch(props.activeRange) {
      case 'WEEK':
        //WEEK
        return 1
        break
      case 'THIRTYDAYS':
        //30days
        return 6
        break
      case 'YEAR':
        //year
        return 11
        break
      default:
        return 8
    }
  }

  const getToolHoverWidth = () => {
    switch(props.activeRange) {
      case 'WEEK':
        //WEEK
        return 1
        break
      case 'THIRTYDAYS':
        //30days
        return 6
        break
      case 'YEAR':
        //year
        return 11
        break
      default:
        return 8
    }
  }

  var options = {
    axisX: {
      labelInterpolationFnc: function(value, index) {
        return index % (getLabelDivisor()) === 0 ? value : null;
      }
    },
    lineSmooth: Chartist.Interpolation.none(),
    plugins: [ tooltip({
      valueTransform: function (value) {
                    return '$' + formatMoney(value/1);
                }
    }) ],
    showGridBackground: true
  };
  var seq = 0,
  delays = 0,
  durations = 500;

  var type = 'Line'
  var tooltipLineAdded = false
  var listener = {
    created: () => {
      seq = 0
    },
    draw: (data) => {
      seq++;
      var boxHeight = 0

      if (data.type === 'line') {
        // If the drawn element is a line we do a simple opacity fade in. This could also be achieved using CSS3 animations.
        data.element.animate({
          opacity: {
            // The delay when we like to start the animation
            begin: seq * delays + 0,
            // Duration of the animation
            dur: durations,
            // The value where the animation should start
            from: 0,
            // The value where it should end
            to: 1
          }
        });
        const tooltipHoverWidth = 100/(data.path.pathElements.length-1) + '%'
      }

      if (data.type === 'grid') {
        if (data.y1 !== data.y2) {
          if (seq === 1) {
            data.group.append(
              new Chartist.Svg('line', {
                x1: data.x1,
                x2: data.x2,
                y1: data.y1,
                y2: data.y2,
                stroke: '#ccc'
              }, 'ct-tooltip-line-y')
            )
          }
        }
        if (data.x1 !== data.x2) {
          if (seq === 11 || seq === 27) {
            data.group.append(
              new Chartist.Svg('line', {
                x1: data.x1,
                x2: data.x2,
                y1: data.y1,
                y2: data.y2,
                stroke: '#ccc'
              }, 'ct-tooltip-line-x')
            )
          }
        }
      }
    }
  }

  return (
    <div>
      <ChartistGraph data={data} listener={listener} options={options} type={type} />
    </div>
  )
}

export default Chart

import React from 'react';
import ReactDOM from 'react-dom';
import ChartistGraph from 'react-chartist';
import './chartist.scss'
const Chart = (props) => {

  var Chartist = require('chartist')

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
      // console.log(xLabel,'xlabel')
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
        {x:xIter,y:parseFloat(dayData.holdingValue)}
      )
      xData.push(dayData.date)
      yData.push(parseFloat(dayData.holdingValue))
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
    // console.log('length',props.data.length)
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
    lineSmooth: Chartist.Interpolation.none()
  };
  var seq = 0,
  delays = 0,
  durations = 500;

  var type = 'Line'
  var listener = {
    created: () => {
      seq = 0
    },
    draw: (data) => {
      seq++;
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

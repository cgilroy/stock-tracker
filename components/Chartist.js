import React from 'react';
import ReactDOM from 'react-dom';
import ChartistGraph from 'react-chartist';
import './chartist.scss'
const another = (props) => {
  var data = {
    labels: props.x,
    series: [
      props.y
    ]
  };

  var options = {
    // axisX: {
    //   labelInterpolationFnc: function(value, index) {
    //     return index % 2 === 0 ? value : null;
    //   }
    // }
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

export default another

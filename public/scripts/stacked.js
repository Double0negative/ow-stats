
var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
 var config = {
     type: 'line',
     data: {
         labels: labels(stats),
         datasets: generateDataset(stats, keySet)
     },
     options: {
       animation: false,
         responsive: true,
         title:{
             display:false,
             text:'Chart.js Line Chart'
         },
         tooltips: {
             mode: 'index',
             intersect: false,
         },
         hover: {
             mode: 'nearest',
             intersect: true
         },
         scales: {
             xAxes: [{
                 display: true,
                 scaleLabel: {
                     display: false,
                     labelString: 'Month'
                 }
             }],
             yAxes: [{
                 display: true,
                 stacked: true,
                 scaleLabel: {
                     display: true,
                     labelString: 'Value'
                 }
             }]
         }
     }
 };

window.onload = function() {
    var ctx = document.getElementById("chart").getContext("2d");
    var chart = new Chart(ctx, config);


};
function labels(stats) {
  var labels = [];
  for (var i = 0; i < stats.length; i++) {
    labels.push(stats[i].timestamp);
  }
  return labels;
}

 function generateDataset(stats, statsKeys) {
   var dataSet = [];
   for (var i = 0; i < statsKeys.length; i++) {
     var key =  statsKeys[i];
     var color = colors[i];
     var set =
       {
           label: key,
           fill:true,
           backgroundColor: color,
           borderColor: "transparent",
           pointBorderColor: "transparent",
           pointBackgroundColor: "transparent",
           data: [ ],
     }
     for (var j = 0; j < stats.length; j++) {
       set.data.push(stats[j][key])
     }
     dataSet.push(set);
   }
   console.log(JSON.stringify(dataSet))
   return dataSet;
 }

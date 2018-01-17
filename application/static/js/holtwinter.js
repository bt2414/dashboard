//author: Alice Ke
//contact: kepu1994@outlook.com
//create: Jan.10.2018
//company: Graphen

var holtwinter1 = echarts.init(document.getElementById('hw1'));
var holtwinter2 = echarts.init(document.getElementById('hw2'));
var holtwinter3 = echarts.init(document.getElementById('hw3'));

// change user name on the chart
var divnode = document.getElementById('hw1_text')
var textnode = document.createTextNode("top_user: feature_1");
divnode.appendChild(textnode)

var divnode = document.getElementById('hw2_text')
var textnode = document.createTextNode("top_user: feature_2");
divnode.appendChild(textnode)

var divnode = document.getElementById('hw3_text')
var textnode = document.createTextNode("top_user: feature_3");
divnode.appendChild(textnode)

cycleHoltwinter();

setInterval( function(){
  cycleHoltwinter();
}, 10000 );

function cycleHoltwinter(){
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      holtwinter_data = JSON.parse(this.responseText);
      runHoltwinter(holtwinter_data);
      // console.log( this.responseText );
    }
  };
  xhttp.open("GET", "http://localhost:9090/holtwinter", false);
  // // change this part for demo in BOC
  // xhttp.open("GET", "http://22.232.212.146:9615/treemap", false);
  xhttp.send();
}

function runHoltwinter(holtwinter_data){

  holtwinter1.showLoading();
  holtwinter1.hideLoading();
  holtwinter2.showLoading();
  holtwinter2.hideLoading();
  holtwinter3.showLoading();
  holtwinter3.hideLoading();

  function colorMappingChange(value) {
          var levelOption = getLevelOption(value);
          chart.setOption({
              series: [{
                  levels: levelOption
              }]
          });
      }

  var formatUtil = echarts.format;

  function getLevelOption() {
          return [
              {
                  itemStyle: {
                      normal: {
                          borderColor: '#777',
                          borderWidth: 0,
                          gapWidth: 1
                      }
                  },
                  upperLabel: {
                      normal: {
                          show: false
                      }
                  }
              },
              {
                  itemStyle: {
                      normal: {
                          borderColor: '#555',
                          borderWidth: 5,
                          gapWidth: 1
                      },
                      emphasis: {
                          borderColor: '#ddd'
                      }
                  }
              },
              {
                  colorSaturation: [0.35, 0.5],
                  itemStyle: {
                      normal: {
                          borderWidth: 5,
                          gapWidth: 1,
                          borderColorSaturation: 0.6
                      }
                  }
              }
          ];
      }

  options = {}

  var i = 0;

  for( ; i < 3; i++ ){
      console.log(i)
      options["option_" + i ] = {
      // title: {
      //     text: 'top 3 features for user'
      // },
      tooltip: {
          trigger: 'axis'
      },
      legend: {
          data:[
          {
              name: 'total_events',
              textStyle:{
                  color: "#cc0000"
              }
          },
          {
              name: 'upperbound_weekly_value',
              textStyle:{
                  color: "#006699"
              }
          },
          {
              name: 'upperbound_daily_value',
              textStyle:{
                  color: "#33ccff"
              }
          },
          {
              name: 'lowerbound_weekly_value',
              textStyle:{
                  color: "#ff9966"
              }
          },
          {
              name:  'lowerbound_daily_value',
              textStyle:{
                  color: "#00cc66"
              }
          }
          ]
      },
      grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
      },
      toolbox: {
          feature: {
              saveAsImage: {}
          }
      },
      xAxis: {
          type: 'category',
          boundaryGap: false,
          data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
          axisLine: {
                  onZero: false,
                  lineStyle: {
                      color: "#ffffff"
                  }
          }
      },
      yAxis: {
          type: 'value',
          axisLine: {
                  onZero: false,
                  lineStyle: {
                      color: "#ffffff"
                  }
          }
      },
      series: [
          {
              name:'total_events',
              type:'line',
              // stack: 'total',
              data:holtwinter_data[i]['total_eventss'],
              lineStyle:{
                  normal:{
                      color: "#cc0000"
                  }
              }
          },
          {
              name:'upperbound_weekly_value',
              type:'line',
              data:holtwinter_data[i]['upperbound_weekly_values'],
              lineStyle:{
                  normal:{
                      color: "#006699"
                  }
              }
          },
          {
              name:'upperbound_daily_value',
              type:'line',
              data:holtwinter_data[i]['upperbound_daily_values'],
              lineStyle:{
                  normal:{
                      color: "#33ccff"
                  }
              }
          },
          {
              name:'lowerbound_weekly_value',
              type:'line',
              data:holtwinter_data[i]['lowerbound_weekly_values'],
              lineStyle:{
                  normal:{
                      color: "#ff9966"
                  }
              }
          },
          {
              name:'lowerbound_daily_value',
              type:'line',
              data:holtwinter_data[i]['lowerbound_daily_values'],
              lineStyle:{
                  normal:{
                      color: "#00cc66"
                  }
              }
          }
      ]
  };
  }


  holtwinter1.setOption(options['option_0']);
  holtwinter2.setOption(options['option_1']);
  holtwinter3.setOption(options['option_2']);

}
// function getInfoClick(params){
//   alert("para: " + JSON.stringify(params.data));
// }
// myChart.on('click', getInfoClick);

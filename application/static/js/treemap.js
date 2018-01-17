//author: Alice Ke
//contact: kepu1994@outlook.com
//create: Jan.10.2018
//company: Graphen

var myChart = echarts.init(document.getElementById('treemap'));

cycleTreemap();

setInterval( function(){
  cycleTreemap();
}, 10000 );

function cycleTreemap(){
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      treemap_data = JSON.parse(this.responseText);
      runTreemap(treemap_data);
      // console.log( this.responseText );
    }
  };
  xhttp.open("GET", "http://localhost:9090/treemap", false);
  // // change this part for demo in BOC
  // xhttp.open("GET", "http://22.232.212.146:9615/treemap", false);
  xhttp.send();
}

function runTreemap(treemap_data){

  myChart.showLoading();
  myChart.hideLoading();

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

  option = {

          title: {
                text: 'BOC ACMS',
                textStyle: {
                  color: '#ff99cc',
                  fontSize: 30
                },
                // show: false,
                left: 'center'
            },

          tooltip: {
                formatter: function (info) {
                    // alert("info:" + JSON.stringify(info));
                    var value = info.value;
                    var score = info.data.score;
                    var treePathInfo = info.treePathInfo;
                    var treePath = [];

                    for (var i = 1; i < treePathInfo.length; i++) {
                        treePath.push(treePathInfo[i].name);
                    }

                    return [
                        '<div class="tooltip-title">' + formatUtil.encodeHTML(treePath.join('/')) + '</div>',
                        'Number: ' + formatUtil.addCommas(value),

                        '</br><div> Score: ' + score + "</div>",
                    ].join('');
                }
            },

          series: [
                {
                    name:'BOC',
                    type:'treemap',
                    visibleMin: 300,
                    label: {
                        show: true,
                        formatter: '{b}'
                    },
                    upperLabel: {
                        normal: {
                            show: true,
                            height: 30
                        }
                    },
                    itemStyle: {
                        normal: {
                            borderColor: '#fff'
                        }
                    },
                    levels: getLevelOption(),
                    data: treemap_data,

                }
            ]
          };
  myChart.setOption(option);
}

function getInfoClick(params){
  user_name = params.data["name"];

  // change user name on the chart
  var divnode = document.getElementById('hw1_text')
  var textnode = document.createTextNode(user_name + ": feature_1");
  divnode.appendChild(textnode)
  divnode.removeChild(divnode.childNodes[0])

  var divnode = document.getElementById('hw2_text')
  var textnode = document.createTextNode(user_name + ": feature_2");
  divnode.appendChild(textnode)
  divnode.removeChild(divnode.childNodes[0])

  var divnode = document.getElementById('hw3_text')
  var textnode = document.createTextNode(user_name + ": feature_3");
  divnode.appendChild(textnode)
  divnode.removeChild(divnode.childNodes[0])

  var data = new FormData();
  data.append('user_name', user_name )
  cycleClick(data)
  setInterval( function(){
    cycleClick(data);
    }, 10000 );
}

function cycleClick(data){
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      click_data = JSON.parse(this.responseText);
      runHoltwinter(click_data);
      // console.log( this.responseText );
    }
  };
  console.log(data)
  xhttp.open("POST", "http://localhost:9090/click", false);
  xhttp.send(data);
}

myChart.on('click', getInfoClick);

var xmlhttp = new XMLHttpRequest();
var url = "http://54.233.67.111:8081/analytics/hourly/queries/day/avg";
var myArr;
xmlhttp.open("GET", url, true);
xmlhttp.send();

xmlhttp.onload = function() {
    if (this.readyState == 4 && this.status == 200) {
        myArr = JSON.parse(this.responseText);
    }

    //ordena pela hora (label)
    myArr.sort(function(a,b) {return a.hora - b.hora});
    dataJ = [];

    //cria dados para o grafico baseado no json de resposta
    for (el in myArr)
        dataJ.push({label: myArr[el].hora+":hrs", value: myArr[el].media_casos});

    Morris.Donut({
        element: 'morris-donut-example',
        data: dataJ,
        colors: ['#95B75D', '#1caf9a', '#FEA223', "#33414e", "#D32F2F"]
    });
};

var xmlhttp1 = new XMLHttpRequest();
var url1 = "http://54.233.67.111:8081/analytics/queries/date";
var myArr1;
xmlhttp1.open("GET", url1, true);
xmlhttp1.send();

xmlhttp1.onload = function () {
  if(this.readyState==4 && this.status==200) {
      myArr1 = JSON.parse(this.responseText);
  }

  dataJ2 = [];
    for (el in myArr1)
        dataJ2.push({y: myArr1[el].data.substring(0,10), a: myArr1[el].count})

    Morris.Line({
        element: 'morris-line-example',
        data: dataJ2,
        xkey: 'y',
        ykeys: ['a'],
        labels: ['Consultas'],
        resize: true,
        lineColors: ['#33414E', '#95B75D']
    })

};

var xmlhttp3 = new XMLHttpRequest();
var url3 = "http://54.233.67.111:8081/analytics/users/by/cases";
var myArr3;
xmlhttp3.open("GET", url3, true);
xmlhttp3.send();

xmlhttp3.onload = function () {
    if(this.readyState==4 && this.status==200) {
        myArr3 = JSON.parse(this.responseText);
    }

    dataJ3 = [];
    for (el in myArr3)
        dataJ3.push({y: myArr3[el].casos, a: myArr3[el].usuarios})
    Morris.Bar({
        element: 'morris-bar-example',
        data: dataJ3,
        xkey: 'y',
        ykeys: ['a'],
        labels: ['Casos'],
        barColors: ['#2aabd2']
    });

};


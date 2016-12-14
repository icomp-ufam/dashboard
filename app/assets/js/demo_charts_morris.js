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



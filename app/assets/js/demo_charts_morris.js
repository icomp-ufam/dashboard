var xmlhttp = new XMLHttpRequest();
var url = "http://54.233.67.111:8081/analytics/hourly/queries/day/avg";
var myArr;
console.log(1);
xmlhttp.open("GET", url, true);
xmlhttp.send();

xmlhttp.onload = function() {
    if (this.readyState == 4 && this.status == 200) {
        myArr = JSON.parse(this.responseText);

    }

    Morris.Donut({
        element: 'morris-donut-example',
        data: [

            {label: "teste1", value: myArr[0].media_casos},
            {label: "teste2", value: myArr[1].media_casos},
            {label: "teste3", value: myArr[2].media_casos}
        ],
        colors: ['#95B75D', '#1caf9a', '#FEA223']
    });
};



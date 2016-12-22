var baseURl = "http://api.teewa.com.br:8081";
var xmlhttp = new XMLHttpRequest();
var url = baseURl + "/analytics/hourly/queries/day/avg";
var myArr;
xmlhttp.open("GET", url, true);
xmlhttp.send();

xmlhttp.onload = function() {
    if (this.readyState == 4 && this.status == 200) {
        myArr = JSON.parse(this.responseText);
    }

    //ordena pela hora (label)
    myArr.sort(function(a,b) {return a.hora - b.hora});
    dataJ = [];//new Array(23);

    //cria dados para o grafico baseado no json de resposta
    for (el in myArr){
        dataJ.push({label: myArr[el].hora+":hrs", value: myArr[el].media_casos});
        
    }
    /*for (i = 0; i < dataJ.length; i++){
        if(i == myArr[i].hora)
            dataJ.push({label: myArr[el].hora+":hrs", value: myArr[el].media_casos});
        else
            dataJ.push({label: i+":hrs", value: 0});
    }*/
    Morris.Donut({
        element: 'morris-donut-example',
        data: dataJ,
        //resize: true,
        colors: ['#95B75D', '#1caf9a', '#FEA223', "#33414e", "#D32F2F"]
    });
};

var xmlhttp1 = new XMLHttpRequest();
var url1 = baseURl + "/analytics/queries/date";
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

//usuarios por caso
var xmlhttp3 = new XMLHttpRequest();
var url3 = baseURl + "/analytics/users/by/cases";
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

var xmlhttp4 = new XMLHttpRequest();
var url4 = baseURl + "/analytics/hourly/queries/day";
var myArr4;
xmlhttp4.open("GET", url4, true);
xmlhttp4.send();

xmlhttp4.onload = function() {
    if (this.readyState == 4 && this.status == 200) {
        myArr4 = JSON.parse(this.responseText);
    }

    //ordena pela hora (label)
    myArr4.sort(function(a,b) {return a.hora - b.hora});
    dataJ4 = [];

    //cria dados para o grafico baseado no json de resposta
    for (el in myArr4)
        dataJ4.push({label: myArr4[el].hora+":hrs", value: myArr4[el].casos});

    Morris.Donut({
        element: 'consultaPorHora',
        data: dataJ4,
        resize: true,
        colors: ['#9EFD04', '#02D2B3', '#FEA223', "#B218C3", "#E22431"]
    });
};

//Consulta por loja e atendimento: Quantidade de consultas atendidas;
var xmlhttpConsultaLA1 = new XMLHttpRequest();
var urlConsultaLA1 = baseURl + "/analytics/inquiries/store/service";
var myArrConsultaLA1;
xmlhttpConsultaLA1.open("GET", urlConsultaLA1, true);
xmlhttpConsultaLA1.send();

xmlhttpConsultaLA1.onload = function () {
    if(this.readyState==4 && this.status==200) {
        myArrConsultaLA1 = JSON.parse(this.responseText);
    }

    dataJConsultaLA1 = [];
    for (el in myArrConsultaLA1)
        dataJConsultaLA1.push({y: myArrConsultaLA1[el].name, a: myArrConsultaLA1[el].atendidas, n: myArrConsultaLA1[el].id})
    Morris.Bar({
        element: 'morris-bar-ConsultaLA1',
        data: dataJConsultaLA1,
        xkey: 'y',
        ykeys: ['a'],
        labels: ['Atendidas'],
        barColors: ['#2aabd2']
    });

};

//Consulta por loja e atendimento: Total de consultas realizadas;
var xmlhttpConsultaLA2 = new XMLHttpRequest();
var urlConsultaLA2 = baseURl + "/analytics/inquiries/store/service";
var myArrConsultaLA2;
xmlhttpConsultaLA2.open("GET", urlConsultaLA2, true);
xmlhttpConsultaLA2.send();

xmlhttpConsultaLA2.onload = function () {
    if(this.readyState==4 && this.status==200) {
        myArrConsultaLA2 = JSON.parse(this.responseText);
    }

    dataJConsultaLA2 = [];
    for (el in myArrConsultaLA2)
        dataJConsultaLA2.push({y: myArrConsultaLA2[el].name, a: myArrConsultaLA2[el].totais})
    Morris.Bar({
        element: 'morris-bar-ConsultaLA2',
        data: dataJConsultaLA2,
        xkey: 'y',
        ykeys: ['a'],
        labels: ['Totais'],
        barColors: ['#2aabd2']
    });

};

//Consulta por loja e atendimento: Percentual de atendimento;
var xmlhttpConsultaLA3 = new XMLHttpRequest();
var urlConsultaLA3 = baseURl + "/analytics/inquiries/store/service";
var myArrConsultaLA3;
xmlhttpConsultaLA3.open("GET", urlConsultaLA3, true);
xmlhttpConsultaLA3.send();

xmlhttpConsultaLA3.onload = function () {
    if(this.readyState==4 && this.status==200) {
        myArrConsultaLA3 = JSON.parse(this.responseText);
    }

    dataJConsultaLA3 = [];
    for (el in myArrConsultaLA3)
        dataJConsultaLA3.push({y: myArrConsultaLA3[el].name, a: myArrConsultaLA3[el].percentual})
    Morris.Bar({
        element: 'morris-bar-ConsultaLA3',
        data: dataJConsultaLA3,
        xkey: 'y',
        ykeys: ['a'],
        labels: ['Totais'],
        barColors: ['#2aabd2']
    });

};

var xmlhttpConsultaCaseByUser = new XMLHttpRequest();
var urlConsultaCaseByUser = baseURl + "/analytics/cases/by/users";
var myArrConsultaCaseByUser;
xmlhttpConsultaCaseByUser.open("GET", urlConsultaCaseByUser, true);
xmlhttpConsultaCaseByUser.send();

xmlhttpConsultaCaseByUser.onload = function () {
    if(this.readyState==4 && this.status==200) {
        myArrConsultaCaseByUser = JSON.parse(this.responseText);
    }

    dataJConsultaCaseByUser = [];
    for (el in myArrConsultaCaseByUser)
        dataJConsultaCaseByUser.push({y: myArrConsultaCaseByUser[el].name, a: myArrConsultaCaseByUser[el].casos})
    Morris.Bar({
        element: 'morris-bar-ConsultaCaseByUser',
        data: dataJConsultaCaseByUser,
        xkey: 'y',
        ykeys: ['a'],
        labels: ['casos'],
        barColors: ['#2aabd2']
    });
};

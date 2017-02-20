/**
 * Created by marcos on 22/12/16.
 */
angular.module("teewa").value("config",  {
    //servidor teewa
    baseUrl: "http://api.teewa.com.br:8081",
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE0ODA2MjA2MjZ9.LL1jFE5Epo22h2usXTIEKySbUTGtSZlBpfWsQEL8nOk',
    //servidor xmpp teewa
    XMPP_DOMAIN:'ip-172-31-47-155',
    BOSH_SERVICE: 'http://api.teewa.com.br:7070/http-bind/',
    password: '123456',
    //Rotas para serviços do chat
    casos_aceitos: "/accepted/cases",
    novos_casos: "/sellers/news/cases",
    aceitar_caso: "/cases/accept/xmpp",
    nao_tenho: "/cases/dont/have",
    recusar_caso: "/cases/deny",
    encerra_caso: "/chats/close",
    denunciar_cliente: "/stores/complaint",
    envio_de_imagem: "/chats/send/image",
    remove_vendedor: "/stores/sellers/remove",
    aceitar_vendedor: "/stores/sellers/accept",
    recusar_vendedor: "/stores/sellers/deny"
});
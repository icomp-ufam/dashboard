angular.module('teewa').config(function ($stateProvider, $urlRouterProvider){
        $urlRouterProvider.otherwise('/dashboard/lista');
        $urlRouterProvider.when('/', '/dashboard/lista');
        $urlRouterProvider.when('/admin', '/admin/lista');
        $urlRouterProvider.when('/clientes', '/clientes/lista');
        $urlRouterProvider.when('/vendedores', '/vendedores/lista');
        $urlRouterProvider.when('/estabelecimentos', '/estabelecimentos/lista');
        $urlRouterProvider.when('/atendimentos', '/atendimentos/lista');
        $urlRouterProvider.when('/chat', '/chat/lista');
        $urlRouterProvider.when('/pacotes', '/pacotes/lista');



        $stateProvider.state('main', {
            url: '/',
            templateUrl: 'app/pages/main/main.html',
            controller: 'mainCtrl'
        }).state('main.vendedores', {
            url: 'vendedores',
            template: '<ui-view></ui-view>'
        }).state('main.vendedores.listar', {
            url: '/lista',
            templateUrl: 'app/pages/vendedores/vendedores.html',
            controller: 'vendedoresCtrl',
            activetab: 'vendedores'
        }).state('main.clientes', {
            url: 'clientes',
            template: '<ui-view></ui-view>'
        }).state('main.clientes.listar', {
            url: '/lista',
            templateUrl: 'app/pages/clientes/clientes.html',
            controller: 'clientesCtrl',
            activetab: 'clientes'
        }).state('main.estabelecimentos', {
            url: 'estabelecimentos',
            template: '<ui-view></ui-view>'
        }).state('main.estabelecimentos.listar', {
            url: '/lista',
            templateUrl: 'app/pages/estabelecimentos/estabelecimentos.html',
            controller: 'estabelecimentosCtrl',
            activetab: 'estabelecimentos'
        }).state('main.admin', {
            url: 'admin',
            template: '<ui-view></ui-view>'
        }).state('main.admin.listar', {
            url: '/lista',
            templateUrl: 'app/pages/admin/form_admin.html',
            controller: 'form_adminCtrl',
            activetab: 'admin'
        }).state('main.atendimentos', {
            url: 'atendimentos',
            template: '<ui-view></ui-view>'
        }).state('main.atendimentos.listar', {
            url: '/lista',
            templateUrl: 'app/pages/atendimentos/atendimentos.html',
            controller: 'atendimentosCtrl',
            activetab: 'atendimentos'
        }).state('main.chat', {
            url: 'chat',
            template: '<ui-view></ui-view>'
        }).state('main.chat.listar', {
            url: '/lista',
            templateUrl: 'app/pages/chat/chat.html',
            controller: 'chatCtrl',
            activetab: 'chat'
        }).state('main.dashboard', {
            url: 'dashboard',
            template: '<ui-view></ui-view>'
        }).state('main.dashboard.listar', {
            url: '/lista',
            templateUrl: 'app/pages/dashboard/dashboard.html',
            controller: 'dashboardCtrl',
            activetab: 'dashboard'
        }).state('main.pacotes', {
            url: 'pacotes',
            template: '<ui-view></ui-view>'
        }).state('main.pacotes.listar', {
            url: '/lista',
            templateUrl: 'app/pages/pacotes/form_pacotes.html',
            controller: 'formPacotesCtrl',
            activetab: 'pacotes'
        })

    });

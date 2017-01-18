angular.module('teewa').config(function ($stateProvider, $urlRouterProvider){
        $urlRouterProvider.otherwise('/dashboard/lista');
        $urlRouterProvider.when('/dashboard', '/dashboard/lista');
        $urlRouterProvider.when('/admin', '/admin/lista');
        $urlRouterProvider.when('/clientes', '/clientes/lista');
        $urlRouterProvider.when('/vendedores', '/vendedores/lista');
        $urlRouterProvider.when('/estabelecimentos', '/estabelecimentos/lista');
        $urlRouterProvider.when('/atendimentos', '/atendimentos/lista');
        $urlRouterProvider.when('/chat', '/chat/lista');
        $urlRouterProvider.when('/pacotes', '/pacotes/lista');
        $urlRouterProvider.when('/denuncias', '/denuncias/lista');
        $urlRouterProvider.when('/avaliacoes', '/avaliacoes/lista');
        $urlRouterProvider.when('/pacotes-escolher', '/pacotes/escolha');
        $urlRouterProvider.when('/analisesCasos', '/analises/lista');

        $urlRouterProvider.when('dashboard-vendedor', 'dashboard-vendedor/index');

        $urlRouterProvider.when('/perfil', '/perfil/perfil');

        $stateProvider.state('main', {
            url: '/',
            templateUrl: 'app/pages/main/main.html',
            controller: 'mainCtrl'
        }).state('main.vendedores', {
            url: 'vendedores',
            template: '<ui-view></ui-view>'
        }).state('main.vendedores.listar', {
            url: '/lista/:idloja',
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
        }).state('main.clientes.graphic', {
            url: '/graphic/:data_startParametro/:data_endParametro',
            
            templateUrl: 'app/pages/clientes/clienteGraphic.html',
            controller: 'clientesCtrl',
            activetab: 'clientes'
        }).state('main.clientes.NDeconsultasGraphic', {
            url: '/listaNumeroDeConsultasgraphic',
            templateUrl: 'app/pages/clientes/clienteUsuariosPorNdeConsultas.html',
            controller: 'clientesCtrl',
            activetab: 'clientesPorNdeConsultas'
        }).state('main.estabelecimentos', {
            url: 'estabelecimentos',
            template: '<ui-view></ui-view>'
        }).state('main.estabelecimentos.listar', {
            url: '/lista',
            templateUrl: 'app/pages/estabelecimentos/estabelecimentos.html',
            controller: 'estabelecimentosCtrl',
            activetab: 'estabelecimentos'
        }).state('main.estabelecimentos.listarConsultasPorLojaAtendimento', {
            url: '/listaConsultasPorLojaAtendimento',
            templateUrl: 'app/pages/estabelecimentos/estabelecimentosConsultasPorLojaAtendimento.html',
            controller: 'estabelecimentosCtrl',
            activetab: 'estabelecimentosConsultasPorLojaAtendimento'
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
        }).state('main.atendimentos.listarPorHora', {
            url: '/listarPorHora/:data_startParametro/:data_endParametro',
            templateUrl: 'app/pages/atendimentos/atendimentosPorHora.html',
            controller: 'atendimentosCtrl',
            activetab: 'atendimentosPorHora'
        }).state('main.atendimentos.listarPorHoraContagemMedia', {
            url: '/listarPorHoraContagemMedia',
            templateUrl: 'app/pages/atendimentos/atendimentosPorHoraContagemMedia.html',
            controller: 'atendimentosCtrl',
            activetab: 'atendimentosPorHoraContagemMedia'
        }).state('main.atendimentos.listarPorDiaSemana', {
            url: '/listarPorDiaSemana/:data_startParametro/:data_endParametro',
            templateUrl: 'app/pages/atendimentos/atendimentosPorDiaSemana.html',
            controller: 'atendimentosCtrl',
            activetab: 'atendimentosDiaSemana'
        }).state('main.atendimentos.listarPorDiaMes', {
            url: '/listarPorDiaMes/:data_startParametro/:data_endParametro',
            templateUrl: 'app/pages/atendimentos/atendimentosPorDiaMes.html',
            controller: 'atendimentosCtrl',
            activetab: 'atendimentosDiaMes'
        }).state('main.atendimentos.listarPorCategoria', {
            url: '/listarPorCategoria/:data_startParametro/:data_endParametro',
            templateUrl: 'app/pages/atendimentos/atendimentosPorCategoria.html',
            controller: 'atendimentosCtrl',
            activetab: 'atendimentosPorCategoria'
        }).state('main.atendimentos.listarPorDate', {
            url: '/listarPorDate/:data_startParametro/:data_endParametro',
            templateUrl: 'app/pages/atendimentos/atendimentosPorData.html',
            controller: 'atendimentosCtrl',
            activetab: 'atendimentosPorData'
        }).state('main.atendimentos.listarPorDataGeral', {
            url: '/listarPorDataGeral',
            templateUrl: 'app/pages/atendimentos/atendimentosPorDataGeral.html',
            controller: 'atendimentosCtrl',
            activetab: 'atendimentosPorDataGeral'
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
        })

        .state('main.dashboardVendedor', {
                url: 'dashboard-vendedor',
                template: '<ui-view></ui-view>'
            }).state('main.dashboardVendedor.index', {
            url: '/index',
            templateUrl: 'app/pages/dashboard-vendedor/dashboard-vendedor.html',
            controller: 'dashboardVendedorCtrl',
            activetab: 'dashboardVendedor'
        }).state('main.dashboardVendedor.casosAbertos', {
            url: '/casos-abertos',
            templateUrl: 'app/pages/dashboard-vendedor/casos-abertos.html',
            controller: 'dashboardVendedorCtrl',
            activetab: 'chat'
        }).state('main.dashboardVendedor.casosNovos', {
            url: '/casos-novos',
            templateUrl: 'app/pages/dashboard-vendedor/casos-novos.html',
            controller: 'dashboardVendedorCtrl',
            activetab: 'casos-novos'
        })


        .state('main.pacotes', {
            url: 'pacotes',
            template: '<ui-view></ui-view>'
        }).state('main.pacotes.listar', {
            url: '/lista',
            templateUrl: 'app/pages/pacotes/form_pacotes.html',
            controller: 'formPacotesCtrl',
            activetab: 'pacotes'
        }).state('main.denuncias', {
            url: 'denuncias',
            template: '<ui-view></ui-view>'
        }).state('main.denuncias.listar', {
            url: '/lista',
            templateUrl: 'app/pages/denuncias/denuncias.html',
            controller: 'denunciasCtrl',
            activetab: 'denuncias'
        }).state('main.avaliacoes', {
            url: 'avaliacoes',
            template: '<ui-view></ui-view>'
        }).state('main.avaliacoes.listar', {
            url: '/lista',
            templateUrl: 'app/pages/avaliacoes/avaliacoes.html',
            controller: 'avaliacoesCtrl',
            activetab: 'avaliacoes'
        }).state('main.escolher-pacote', {
            url: '/escolher-pacote',
            template: '<ui-view></ui-view>'
        }).state('main.pacotes.escolher', {
            url: '/escolha',
            templateUrl: 'app/pages/pacotes/pacotes.html',
            controller: 'formPacotesCtrl',
            activetab: 'escolher-pacote'
        }).state('main.analisesCasos', {
            url: 'analisesCasos',
            template: '<ui-view></ui-view>'
        }).state('main.analisesCasos.listar', {
            url: '/listaCasos/:data_startParametro/:data_endParametro',
            //url: '/listaCasos',
            
            templateUrl: 'app/pages/analises/analiseCasos.html',
            controller: 'analiseCtrl',
            activetab: 'analisesCasos'
        }).state('main.analisesCasos.listarAtendimentos', {
            url: '/listaAtendimentos',
            templateUrl: 'app/pages/analises/analiseAtendimentos.html',
            controller: 'analiseCtrl',
            activetab: 'analisesAtendimentos'
        }).state('main.analisesCasos.listarNatendimentos', {
            url: '/listaNatendimentos',
            templateUrl: 'app/pages/analises/analiseNatendimentos.html',
            controller: 'analiseCtrl',
            activetab: 'analisesNatendimentos'
       }).state('main.analisesCasos.ratingGeral', {
            url: '/rating-geral',
            templateUrl: 'app/pages/analises/ratingGeral.html',
            controller: 'analiseCtrl',
            activetab: 'estabelecimentos'
        }).state('main.perfil', {
            url: 'perfil',
            template: '<ui-view></ui-view>'
        }).state('main.perfil.listar', {
            url: '/perfil',
            templateUrl: 'app/pages/perfil/perfil.html',
            controller: 'estabelecimentosCtrl'
        })

    });

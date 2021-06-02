// ==UserScript==
// @name            OTRS refresh =D
// @namespace       http://tampermonkey.net/
// @version         1.0.2
// @description     Auto-Refresh OTRS
// @author          Marcelo_Valvassori_Bittencourt
// @copyright     	2019, Marcelo_Valvassori_Bittencourt (https://openuserjs.org/users/Marcelo_Valvassori_Bittencourt)
// @namespace       mbitts.com
// @homepageURL     https://openuserjs.org/users/Marcelo_Valvassori_Bittencourt
// @match           http://otrs.1cta.eb.mil.br/otrs/index.pl?Action=AgentDashboard
// @grant           none
// @icon            https://otrs.com/favicon-16x16.png
// ==/UserScript==




//--- https://stackoverflow.com/questions/25484978/i-want-a-simple-greasemonkey-script-to-reload-the-page-every-minute
(function(){
    'use strict';

	var jOTRS = {

        debug : true,
		default_time : 5,
		default_days_cookies : 1,

        about : {
            'author' : 'Marcelo Valvassori Bittencourt',
            'supportURL':'http://mbitts.com/scripts/jOTRS.js',
            'create':'2020-04-13',
            'description':'Refresh page into defined minuts.',
            'name':'[HK]jOTRS Refresh',
            'namespace':'mbitts.com'
        },

        version : [
            {'1.0.2':'Contador regressivo.'},
            {'1.0.2':'Adicionando como caixa de menu padrão do OTRS'},
            {'1.0.1':'Adicionando uma interface simples de apresentacao fixed to botton.'},
            {'1.0.0':'Criação de atualização da página principal com dados definidos em variáveis.'}
        ],

		init : function(){
			//jOTRS.interface_old();
            jOTRS.interface_otrs();
			jOTRS.contagem();
		},

		min : function(){
			var tm = jOTRS.readCookie("timerefresh");
			if(!tm || tm == '' || tm === 0) {
				tm = jOTRS.default_time;
				jOTRS.createCookie("timerefresh", tm, jOTRS.default_days_cookies);
			}
			return tm;
		},

        log : function(txt){
            if(jOTRS.debug){
                let tm = new Date().toLocaleString();
                console.log(tm, txt);
            }
        },

        interface_otrs : function(){
            let id = '0500';
            let name = 'UpdateSYS';
            let last_refresh = jOTRS.readCookie("jotrs_tmref");

            /*
            let fim = Date.parse( new Date().toJSON().slice(0,10).replace(/-/g,'/') + ' ' + new Date().toJSON().slice(11,19) );
            let inicio = Date.parse( new Date().toJSON().slice(0,10).replace(/-/g,'/') + last_refresh.slice(10) );
            let jafoi = new Date(fim - inicio).toLocaleTimeString();
            jOTRS.log(jafoi)
            */
            let last_regress = jOTRS.readCookie("jotrs_regress");
            var panel = $('<div />', {'id':'Dashboard' + id + '-' + name +'-box'}).addClass('WidgetSimple CanDrag').append(
                $('<div />').addClass('Header').append(
                    $('<div />').addClass('ActionMenu').append(
                        $('<div />').addClass('WidgetAction Close').append(
                            $('<a />',{'href':'/otrs/index.pl?Action=AgentDashboard;Subaction=UpdateRemove;Name='+ id +'-'+ name +';CustomerID=;CustomerUserID=;ChallengeToken=zEjoGaeeoOnDGn4TZ9K36B1AflIVmGjh;','title':'Fechar este widget'}).append(
                                $('<i />').addClass('fa fa-times')
                            )
                        ),
                        $('<div />').addClass('Clear')
                    ),
                    $('<h2 />',{'title':'Update Config'}).addClass('ui-sortable-handle').text('Update Config')
                ),
                $('<div />').addClass('Content').append(
                    $('<div />',{'id':'Dashboard'+ id +'-'+ name }).append(
                        $('<p />').append(
                            'Contagem: ',
                            $('<span />').addClass('jotrs_contagem').text( jOTRS.readCookie("jotrs_contagem") )
                        ),
                        $('<div />').css({'float':'right'}).append(
                        '[',
                            $('<span />').addClass('jotrs_tmcnt').show(function(){
                                var counter = (last_regress && last_regress > 0)?last_regress:( jOTRS.min() * 60 );
                                var myInterval = setInterval(function () {
                                    counter--;
                                    $('.jotrs_tmcnt').text(counter);
                                    jOTRS.createCookie("jotrs_tmcnt", counter, jOTRS.default_days_cookies);
                                }, 1000);
                            }),
                            ']'
                        ),
                        (!last_refresh && last_refresh === "")?'':
                        $('<p />').append(
                            'Last TimeRefresh: ',
                            $('<span />').addClass('jotrs_tmref').text( last_refresh )
                        ),
                        $('<p />').append(
                            'Time Update: ',
                            $('<input />',{'name':'jotrs_minrf','type':'text'}).css({'width':'20px','text-align':'center'}).val( jOTRS.min() ),
                            'min ',
                            $('<button />').val('Save').append(
                                $('<span />').append(
                                    $('<i />').addClass('fa fa-save')
                                )
                            ).on('click', function(){
                                let jotrs_tmref = $("input[name='jotrs_minrf']").val();
                                jOTRS.createCookie("jotrs_tmref", jotrs_tmref, jOTRS.default_days_cookies);
                                jOTRS.log('Atualizado TimeRefresh para '+ jotrs_tmref);
                            })
                        )
                    )
                )
            );
            $('.SidebarColumn').prepend( panel );
        },

		interface_old : function(){
			let last_refresh = jOTRS.readCookie("jotrs_tmref");
			let mostrador = $('<div />')
				.addClass('jotrs_contagem')
				.css({
					'position': 'fixed',
					'width':'250px',
					'height':'60px',
					'border': '1px solid #000',
					'bottom': 0,
					'right':'50px',
					'background':'#fff',
					'padding':'5px 0px 0 5px',
                    'text-align':'center'
				}).append(
					$('<p />').append(
						'Contagem: ',
						$('<span />').addClass('jotrs_contagem').text( jOTRS.readCookie("jotrs_contagem") )
					),
					(!last_refresh && last_refresh === "")?'':
					$('<p />').append(
						'Last TimeRefresh: ',
						$('<span />').addClass('jotrs_tmref').text( last_refresh )
					),
                    $('<p />').append(
                        'Time Update: ',
                        $('<input />',{'name':'jotrs_minrf','type':'text'}).css({'width':'20px','text-align':'center'}).val( jOTRS.min() ),
                        $('<button />').val('Save').append(
                            $('<span />').append(
                                $('<i />').addClass('fa fa-save')
                            )
                        ).on('click', function(){
                            let jotrs_tmref = $("input[name='jotrs_minrf']").val();
                            jOTRS.createCookie("jotrs_tmref", jotrs_tmref, jOTRS.default_days_cookies);
                            jOTRS.log('Atualizado TimeRefresh para '+ jotrs_tmref);
                        })
                    )
				);
    		$('body').append( mostrador );
		},

		contagem : function(){
			let cnt = jOTRS.readCookie("jotrs_contagem");
			if(!cnt || cnt == '' ) {
				cnt = 0;
				jOTRS.createCookie("jotrs_contagem", cnt, jOTRS.default_days_cookies);
                jOTRS.log('Criando cookie[name = jotrs_contagem][value = '+ jOTRS.default_days_cookies +']');
			}

			$('.jotrs_contagem span.jcnt').text(cnt);

			setTimeout(function(){
                let tm = new Date().toLocaleString();
                jOTRS.log('Iniciando armazenamento de valores em cookies [name = jotrs_tmref][value = '+ tm +']');
				jOTRS.createCookie("jotrs_tmref", tm, jOTRS.default_days_cookies );

				cnt++;

                jOTRS.log('Iniciando armazenamento de valores em cookies [name = jotrs_contagem][value = '+ jOTRS.default_days_cookies +']');
				jOTRS.createCookie("jotrs_contagem", cnt, jOTRS.default_days_cookies);
				location.reload();
			}, (jOTRS.min() * 60 * 1000) );
		},

		createCookie : function(name, value, days) {
			var expires = "";
			if (days) {
				var date = new Date();
				date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
				expires = "; expires=" + date.toGMTString();
			}

			document.cookie = name + "=" + value + expires + "; path=/";
		},

		readCookie : function(name) {
			var nameEQ = name + "=";
			var ca = document.cookie.split(';');
			for (var i = 0; i < ca.length; i++) {
				var c = ca[i];
				while (c.charAt(0) == ' ') c = c.substring(1, c.length);
				if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
			}
			return null;
		},

		eraseCookie : function(name) {
			jOTRS.createCookie(name, "", -1);
		}
	};

    jOTRS.init();

})();



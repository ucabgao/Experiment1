/* @flow */
if (window.JSON === undefined) {
    document.write('<' + 'script src="lib/json/json2.js">/script>"></' + 'script>');
}
$(document).ready(function () {
    _.defer(function () {
        $('#loadingDiv')
            .hide() // hide it initially
            .ajaxStart(function () {
            $(this).show();
        })
            .ajaxStop(function () {
            $(this).hide();
        });
        var z = new VIE();
        z.use(new z.StanbolService({
            url: "http://dev.iks-project.eu:8081",
            proxyDisabled: true
        }));
        // make the content element editable
        $('.content').hallo({
            plugins: {},
            editable: true
        });
        function enable() {
            $('.content')
                .each(function () {
                $(this)
                    .annotate('enable', function (success) {
                    if (success) {
                        $('.enhanceButton')
                            .button('enable')
                            .button('option', 'label', 'Done');
                        $('.acceptAllButton')
                            .show()
                            .button('enable');
                    }
                    else {
                        $('.enhanceButton')
                            .button('enable')
                            .button('option', 'label', 'error, see the log.. Try to enhance again!');
                    }
                });
            });
        }
        function instantiate() {
            $('.content').annotate({
                vie: z,
                // typeFilter: ["http://dbpedia.org/ontology/Place", "http://dbpedia.org/ontology/Organisation", "http://dbpedia.org/ontology/Person"],
                debug: true,
                //autoAnalyze: true,
                showTooltip: true,
                decline: function (event, ui) {
                    console.info('decline event', event, ui);
                },
                select: function (event, ui) {
                    console.info('select event', event, ui);
                },
                remove: function (event, ui) {
                    console.info('remove event', event, ui);
                },
                success: function (event, ui) {
                    console.info('success event', event, ui);
                },
                error: function (event, ui) {
                    console.info('error event', event, ui);
                }
            });
        }
        instantiate();
        $('.acceptAllButton')
            .button()
            .hide()
            .click(function () {
            $('.content')
                .each(function () {
                $(this)
                    .annotate('acceptAll', function (report) {
                    console.log('AcceptAll finished with the report:', report);
                });
            });
            $('.acceptAllButton')
                .button('disable');
        });
        $('.enhanceButton')
            .button({ enhState: 'passiv' })
            .click(function () {
            // Button with two states
            var oldState = $(this).button('option', 'enhState');
            var newState = oldState === 'passiv' ? 'active' : 'passiv';
            $('.enhanceButton').button('option', 'enhState', newState);
            if ($(this).button('option', 'enhState') === 'active') {
                // annotate.enable()
                try {
                    console.info(".content", $('.content'));
                    enable();
                    $('.enhanceButton')
                        .button('disable')
                        .button('option', 'label', 'in progress...');
                }
                catch (e) {
                    alert(e);
                }
            }
            else {
                // annotate.disable()
                $('.content').annotate('disable');
                $('.enhanceButton').button('option', 'label', 'Enhance!');
                $('.acceptAllButton')
                    .hide();
            }
        });
        jQuery('.instantiate').button().click(instantiate);
        jQuery('.destroy').button().click(function () {
            jQuery('.content').annotate('destroy');
        });
        jQuery('.enable').button().click(function () {
            enable();
        });
        jQuery('.disable').button().click(function () {
            jQuery('.content').annotate('disable');
        });
        jQuery('.listDom').button().click(function () {
            alert(jQuery('.content')[0].outerHTML);
        });
    });
});

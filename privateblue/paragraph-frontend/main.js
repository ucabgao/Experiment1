crossroads.addRoute('/', function() {
    topbar();
    start();
});

crossroads.addRoute('/{blockIds*}', function(blockIds) {
    topbar();
    getPath(blockIds.split("/"), function(blocks) {
        $('#story').show();
        var first = renderBlock(blocks[0], true);
        $('#story').append(first);
        viewBlock(blocks[0].blockId);
        blocks.shift();
        var prev = first;
        blocks.forEach(function(block) {
            prev = append(block, prev);
        });
    }, function(jqXHR, textStatus, errorThrown) {
        $('#global-error').text(errorThrown);
        $('#global-error').show();
    });
});

var topbar = function() {
    $('#topbar').empty();
    authenticated(function(session) {
        var loggedin = $('<span class="loggedin">Logged in as ' + session.name + '</span>');
        var button = $('<span class="logout-button">Logout</span>');
        button.click(function() {
            logout(function() {
                topbar();
            });
        });
        $('#topbar').append(loggedin);
        $('#topbar').append(button);
        $('#topbar').show();
    }, function() {
        var button = $('<span class="login-button">Login / Register</span>');
        button.click(function() {
            authForm(function() {
                topbar();
            });
        });
        $('#topbar').append(button);
        $('#topbar').show();
    });
}

var start = function(callback) {
    $('.starter-editor').show();
    $('.starter-editor .title, .starter-editor .body').one('focus', function() {
        $(this).text('');
        $(this).css('opacity', 1);
        $(this).data('edited', true);
    });
    $('.starter-editor').bind('keydown', function(e) {
        if (e.which == 13) {
            var title = $('.starter-editor .title').text();
            if (!$('.starter-editor .title').data('edited') || title == '') {
                title = undefined;
            }
            var text = $('.starter-editor .body').text();
            if (!$('.starter-editor .body').data('edited') || text == '') {
                return false;
            } else {
                startBlock(title, text, function(blockId) {
                    window.document.location = '/' + blockId;
                });
            }
        }
    });
}

crossroads.parse(document.location.pathname);

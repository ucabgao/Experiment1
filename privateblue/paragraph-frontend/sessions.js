var sessionName = 'graphsession';

var authenticated = function(callback, otherwise) {
    var session = Cookies.getJSON(sessionName);
    if (session) {
        callback(session);
    } else {
        otherwise();
    }
}

var logout = function(callback) {
    authenticated(function(session) {
        $.ajax({
            url: '/api/logout?token=' + session.token,
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            success: function(response) {
                Cookies.remove(sessionName);
                callback();
            },
            error: function(jqXHR, textStatus, errorThrown) {
                $('#global-error').text(errorThrown);
                $('#global-error').show();
            }
        });
    }, function() {
        $('#global-error').text("You must be logged in to log out");
        $('#global-error').show();
    });
}

var login = function(username, password, callback, error) {
    var hashbits = sjcl.hash.sha256.hash(password);
    var hash = sjcl.codec.hex.fromBits(hashbits);
    data = {
        name: username,
        password: hash
    };
    $.ajax({
        url: '/api/login',
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(data),
        dataType: 'json',
        success: function(response) {
            if (response.data) {
                Cookies.set(sessionName, response.data, { expires: 365 });
                callback();
            } else {
                error(undefined, "error", "Login failed, try again");
            }
        },
        error: error
    });
}

var loginForm = function(callback) {
    var username = $('#username').val();
    var password = $('#password').val();
    login(username, password, function() {
        $('#auth-form').hide();
        callback();
    }, function(jqXHR, textStatus, errorThrown) {
        if (jqXHR && jqXHR.responseText) {
            var response = JSON.parse(jqXHR.responseText);
            if (response.error) {
                $('.auth-errors').text(response.error);
            } else {
                $('.auth-errors').text(errorThrown);
            }
        } else {
            $('.auth-errors').text(errorThrown);
        }
    });
}

var registerForm = function(callback) {
    var username = $('#username').val();
    var password = $('#password').val();
    var verify = $('#verify-password').val();
    if (password == verify) {
        var hashbits = sjcl.hash.sha256.hash(password);
        var hash = sjcl.codec.hex.fromBits(hashbits);
        data = {
            name: username,
            foreignId: username,
            password: hash
        }
        $.ajax({
            url: '/api/register',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(data),
            dataType: 'json',
            success: function(response) {
                if (response.data) {
                    login(username, password, function() {
                        $('#auth-form').hide();
                        callback();
                    }, function(jqXHR, textStatus, errorThrown) {
                        $('.auth-errors').text(errorThrown);
                    });
                } else {
                    $('.auth-errors').text("Registration failed, try again");
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                var response = JSON.parse(jqXHR.responseText);
                if (response.error) {
                    $('.auth-errors').text(response.error);
                } else {
                    $('.auth-errors').text(errorThrown);
                }
            }
        });
    } else {
        $('.auth-errors').text("Passwords must match");
    }
}

var authForm = function(callback) {
    $('#auth-form').show();
    $('#auth-form').bind('keydown', function(e) {
        if (e.which == 13) {
            loginForm(callback);
        } else {
            $('.auth-errors').text('');
        }
    });

    $('.register').click(function() {
        $('.login').css('opacity', 0.54);
        $('.register').css('opacity', 1);
        $('#auth-form').animate({
            height: "+=60"
        }, 200, function() {
            $('#verify-password').show();
        });
        $('#auth-form').unbind('keydown');
        $('#auth-form').bind('keydown', function(e) {
            if (e.which == 13) {
                registerForm(callback);
            } else {
                $('.auth-errors').text('');
            }
        });
        $('#username').focus();
    });

    $('.login').click(function() {
        $('.login').css('opacity', 1);
        $('.register').css('opacity', 0.54);
        $('#verify-password').hide();
        $('#auth-form').animate({
            height: "-=60"
        }, 200);
        $('#auth-form').unbind('keydown');
        $('#auth-form').bind('keydown', function(e) {
            if (e.which == 13) {
                loginForm(callback);
            } else {
                $('.auth-errors').text('');
            }
        });
        $('#username').focus();
    });

    $('#username').focus();
}

var onUnauthorized = function(callback) {
    removeSession();
    authForm(function() {
        topbar();
        callback();
    });
}

var removeSession = function() {
    Cookies.remove(sessionName);
    topbar();
}

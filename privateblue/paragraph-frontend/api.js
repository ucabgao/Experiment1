var getBlock = function(blockId, callback, otherwise) {
    var param = [blockId];
    getPath(param, function(blocks) {
        if (blocks.length > 0) {
            callback(blocks[0]);
        } else {
            otherwise();
        }
    }, otherwise);
}

var getPath = function(blockIds, callback, otherwise) {
    var idsParam = "";
    blockIds.forEach(function(blockId) {
        idsParam += "&blockIds=" + blockId;
    });
    idsParam = "?" + idsParam.substring(1, idsParam.length);
    $.ajax({
        url: '/api/path' + idsParam,
        success: function(response) {
            if (response.data) {
                callback(response.data);
            } else {
                otherwise(undefined, "error", "No blocks returned");
            }
        },
        error: otherwise
    });
}

var startBlock = function(title, text, callback) {
    authenticated(function(session) {
        var data = {
            body: {
                type: 'text',
                content: {
                    text: text
                }
            }
        };
        if (title) {
            data.title = title;
        }
        $.ajax({
            url: '/api/start?token=' + session.token,
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(data),
            success: function(response) {
                callback(response.data);
            },
            statusCode: {
                401: function() {
                    onUnauthorized(function() {
                        startBlock(title, text, callback);
                    });
                }
            }
        });
    }, function() {
        onUnauthorized(function() {
            startBlock(title, text, callback);
        });
    });
}

var appendBlock = function(blockId, text, callback) {
    authenticated(function(session) {
        var data = {
            target: blockId,
            body: {
                type: 'text',
                content: {
                    text: text
                }
            }
        };
        $.ajax({
            url: '/api/append?token=' + session.token,
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(data),
            success: function(response) {
                callback(response.data);
            },
            statusCode: {
                401: function() {
                    onUnauthorized(function() {
                        appendBlock(blockId, text, callback);
                    });
                }
            }
        });
    }, function() {
        onUnauthorized(function() {
            appendBlock(blockId, text, callback);
        });
    });
}

var viewBlock = function(blockId) {
    authenticated(function(session) {
        var data = {
            target: blockId
        };
        $.ajax({
            url: '/api/view?token=' + session.token,
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(data),
            success: function(response) {

            },
            statusCode: {
                401: removeSession
            }
        });
    }, function() {

    });
}

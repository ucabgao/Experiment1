var blockTemplate = '<li class="block"> \
                        <div> \
                            <h1 class="title"></h1> \
                            <div class="authortime"><a class="time"></a><span class="by"> by </span><a class="author" href="#"></a></div> \
                            <p class="body"></p> \
                            <div class="counts"><span class="seen-count"></span><span class="child-count"></span></div> \
                        </div> \
                    </li>'

var renderBlock = function(block, withTitle) {
    var blockNode = $(blockTemplate);
    addBlockMain(blockNode, block, withTitle);
    var outgoing = getOutgoing(block.outgoing);
    blockNode.append(outgoing)
    var replyEditor = getReplyEditor();
    outgoing.prepend(replyEditor);
    addExplode(blockNode);
    return blockNode;
}

var addBlockMain = function(blockNode, block, withTitle) {
    // metadata on node
    blockNode.data('id', block.blockId);
    blockNode.data('author', block.author.userId);
    blockNode.data('timestamp', block.timestamp);
    blockNode.data('seen-count', block.seen.length);
    blockNode.data('child-count', block.outgoing.length);

    // block title
    if (withTitle && block.title) {
        $('.title', blockNode).text(block.title);
        document.title = block.title;
    } else {
        $('.title', blockNode).remove();
    }

    // author and time
    var time = moment(block.timestamp).fromNow();
    $('.time', blockNode).text(time);
    $('.time', blockNode).attr('href', '/' + block.blockId);
    $('.author', blockNode).text(block.author.name);

    // block body
    $('.body', blockNode).addClass(block.body.type);
    if (block.body.type == 'text') {
        $('.body', blockNode).text(block.body.content.text);
    } else if (block.body.type == 'image') {
        var img = $('<img/>');
        img.attr('src', block.body.content.uri);
        $('.body', blockNode).append(img);
    } else {
        $('.body', blockNode).remove();
    }

    // seen count
    addSeenCount(blockNode);

    // child count
    addChildCount(blockNode);
}

var addSeenCount = function(blockNode) {
    var c = blockNode.data('seen-count');
    var seenCount = 'Seen by ' + c + ' people';
    if (c == 0) {
        var seenCount = 'Seen by no one yet';
    } else if (c == 1) {
        seenCount = 'Seen by one person';
    }
    $('.seen-count', blockNode).text(seenCount);
}

var addChildCount = function(blockNode) {
    var c = blockNode.data('child-count');
    var childCount = 'View ' + c + ' replies';
    console.log(childCount);
    if (c == 0) {
        childCount = 'No replies yet';
    } else if (c == 1) {
        childCount = 'View one reply';
    }
    $('.child-count', blockNode).text(childCount);
}

var getOutgoing = function(connections) {
    var outgoing = $('<ul class="outgoing"></ul>');
    $(connections).each(function() {
        var arrow = this.connection.arrow;
        var blockId = this.blockId;
        addConnection(outgoing, arrow, blockId);
    });
    return outgoing;
}

var addConnection = function(ul, arrow, blockId, callback) {
    sneakpeek(blockId, function(sp) {
        sp.addClass(arrow);
        sp.data('connection-id', blockId);
        sp.click(appendSelected);
        ul.append(sp);
        if (callback) {
            callback(sp);
        }
    });
}

var sneakpeek = function(blockId, callback) {
    getBlock(blockId, function(block) {
        if (block) {
            var sp = $('<li class="sneakpeek"> \
                            <div class="authortime"><span class="time"></span> by <span class="author" href="#"></span></div> \
                        </li>');
            var time = moment(block.timestamp).fromNow();
            $('.time', sp).text(time);
            $('.author', sp).text(block.author.name);
            if (block.title) {
                var body = $('<h1 class="title"></h1>');
                body.text(block.title);
                sp.prepend(body);
                callback(sp);
            } else if (block.body.type == 'text') {
                var body = $('<p class="text"></p>');
                body.text(block.body.content.text);
                sp.append(body);
                callback(sp);
            } else if (block.body.type == 'image') {
                var body = $('<img class="image"/>');
                body.attr('src', block.body.content.uri);
                sp.append(body);
                callback(sp);
            } else {
                callback(sp);
            }
        } else {
            callback(undefined);
        }
    });
}

var appendSelected = function() {
    var blockId = $(this).data('connection-id')
    var parent = $(this).closest('.block');
    if (parent.next() && parent.next().data('id') == blockId) {
        return false;
    } else if (parent.next()) {
        parent.nextAll().remove();
    }
    getBlock(blockId, function(block) {
        var appended = append(block, parent);
        updateUri();
        implode(parent, function() {
            appended[0].scrollIntoView(true);
        });
    });
}

var append = function(block, after) {
    var afterAuthor = after.data('author');
    var afterTimestamp = after.data('timestamp');
    var appended = renderBlock(block, false);
    var appendedAuthor = appended.data('author');
    var appendedTimestamp = appended.data('timestamp');
    if (afterAuthor == appendedAuthor && appendedTimestamp - afterTimestamp < 60 * 60 * 1000) {
        $('.authortime', appended).remove();
    } else if (afterAuthor == appendedAuthor) {
        $('.time', appended).nextAll().remove();
    }
    $('#story').append(appended);
    viewBlock(block.blockId);
    return appended;
}

var updateUri = function() {
    var state = '';
    $('.block').each(function() {
        state += '/' + $(this).data('id');
    });
    History.pushState(null, null, state);
}

var getReplyEditor = function() {
    var editor = $('<li class="reply-editor">Your reply</li>');
    editor.click(replyEditorClick);
    return editor;
}

var replyEditorClick = function() {
    $(this).unbind('click');
    $('.child-count', $(this).closest('.block')).unbind('click');
    $(this).text('');
    $(this).nextAll().slideUp(100);
    $(this).animate({
        width: 954,
        opacity: 1
    }, 200, function() {
        $(this).addClass('reply-editor-active');
        $(this).attr('contenteditable', 'true');
        $(this).unbind('keydown');
        $(this).bind('keydown', replyEditorEnter);
        $(this).focus();
    });
}

var replyEditorEnter = function(e) {
    if (e.which == 13) {
        e.preventDefault();
        var block = $(this).closest('.block');
        var blockId = block.data('id');
        appendBlock(blockId, $(this).text(), function(replyId) {
            block.data('child-count', block.data('child-count') + 1);
            addChildCount(block);
            addConnection($('.outgoing', block), 'LINK', replyId, function(sp) {
                var editor = $('.reply-editor', block);
                editor.removeClass('reply-editor-active');
                editor.removeAttr('contenteditable');
                editor.unbind('keydown');
                editor.text('Your reply');
                addExplode(block);
                editor.nextAll().slideDown(100);
                editor.click(replyEditorClick);
                sp.click();
                editor.animate({
                    width: 250,
                    opacity: 0.54
                }, 200);
            });
        });
    }
}

var addExplode = function(block) {
    $('.child-count', block).unbind('click');
    $('.child-count', block).click(function() {
        explode(block);
    });
}

var explode = function(block, callback) {
    $('.child-count', block).unbind('click');
    $('.child-count', block).addClass('child-count-clicked');
    $('.outgoing', block).children().slideDown(100, function() {
        $('.outgoing:last-child', block)[0].scrollIntoView(true);
        if (callback) {
            callback();
        }
    });
    $('.child-count', block).click(function() {
        implode(block);
        return false;
    });
}

var implode = function(block, callback) {
    $('.outgoing', block).children().delay(200).slideUp(100, function() {
        $('.child-count', block).removeClass('child-count-clicked');
        if (callback) {
            callback();
        }
    });
    addExplode(block);
}

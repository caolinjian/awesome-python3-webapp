// awesome.js

function showError(err) {
    var alert = $('div.alert-danger');
    if (err) {
        alert.text(err.message || err.error || err).show();
        try {
            if (alert.offset().top < ($(window).scrollTop() - 41)) {
                $('html,body').animate({scrollTop: alert.offset().top - 41});
            }
        }
        catch (e) {}
    }
    else {
        alert.hide().text('');
    }
}

function _ajax(method, url, data, callback) {
    $.ajax({
        type: method,
        url: url,
        data: data,
        dataType: 'json'
    }).done(function(r) {
        if (r && r.error) {
            return callback && callback(r);
        }
        return callback && callback(null, r);
    }).fail(function(jqXHR, textStatus) {
        return callback && callback({error: 'HTTP ' + jqXHR.status, message: 'Network error (HTTP ' + jqXHR.status + ')'});
    });
}

function getApi(url, data, callback) {
    if (arguments.length === 2) {
        callback = data;
        data = {};
    }
    _ajax('GET', url, data, callback);
}

function postApi(url, data, callback) {
    if (arguments.length === 2) {
        callback = data;
        data = {};
    }
    _ajax('POST', url, data, callback);
}


// add to prototype:

if (! String.prototype.trim) {
    String.prototype.trim = function() {
        return this.replace(/^\s+|\s+$/g, '');
    };
}

if (! Number.prototype.toDateTime) {
    var replaces = {
        'yyyy': function(dt) {
            return dt.getFullYear().toString();
        },
        'yy': function(dt) {
            return (dt.getFullYear() % 100).toString();
        },
        'MM': function(dt) {
            var m = dt.getMonth() + 1;
            return m < 10 ? '0' + m : m.toString();
        },
        'M': function(dt) {
            var m = dt.getMonth() + 1;
            return m.toString();
        },
        'dd': function(dt) {
            var d = dt.getDate();
            return d < 10 ? '0' + d : d.toString();
        },
        'd': function(dt) {
            var d = dt.getDate();
            return d.toString();
        },
        'hh': function(dt) {
            var h = dt.getHours();
            return h < 10 ? '0' + h : h.toString();
        },
        'h': function(dt) {
            var h = dt.getHours();
            return h.toString();
        },
        'mm': function(dt) {
            var m = dt.getMinutes();
            return m < 10 ? '0' + m : m.toString();
        },
        'm': function(dt) {
            var m = dt.getMinutes();
            return m.toString();
        },
        'ss': function(dt) {
            var s = dt.getSeconds();
            return s < 10 ? '0' + s : s.toString();
        },
        's': function(dt) {
            var s = dt.getSeconds();
            return s.toString();
        },
        'a': function(dt) {
            var h = dt.getHours();
            return h < 12 ? 'AM' : 'PM';
        }
    };
    var token = /([a-zA-Z]+)/;
    Number.prototype.toDateTime = function(format) {
        var fmt = format || 'yyyy-MM-dd hh:mm'
        var dt = new Date(this * 1000);
        var arr = fmt.split(token);
        for (var i=0; i<arr.length; i++) {
            var s = arr[i];
            if (s && s in replaces) {
                arr[i] = replaces[s](dt);
            }
        }
        return arr.join('');
    };
}

function gotoPage(index) {
    if (index) {
        var search = location.search;
        var hasPageParam = search.search(/page\=\d+\&?/)!==(-1);
        if (hasPageParam) {
            search = search.replace(/page\=\d+\&?/g, '');
        }
        search = (search==='' || search==='?') ? ('?page=' + index) : (search + '&page=' + index);
        location.assign(search);
    }
}

function showConfirm(title, text, fn_ok, fn_cancel) {
    var s = '<div class="modal fade" id="div-confirm" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'+
              '<div class="modal-dialog modal-sm">'+
                '<div class="modal-content">'+
                  '<div class="modal-header">'+
                    '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'+
                    '<h4 class="modal-title x-title" id="myModalLabel"></h4>'+
                  '</div>'+
                  '<div class="modal-body x-text"></div>'+
                  '<div class="modal-footer">'+
                    '<button type="button" class="btn btn-primary x-ok"><i class="fa fa-check"></i> 是</button>'+
                    '<button type="button" class="btn btn-default x-cancel" data-dismiss="modal"><i class="fa fa-times"></i> 否</button>'+
                  '</div>'+
                '</div>'+
              '</div>'+
            '</div>'
    $('body').append(s);
    var m = $('#div-confirm');
    m.find('.x-title').text(title);
    m.find('.x-text').text(text);
    m.find('.x-ok').click(function () {
        m.modal('hide');
        fn_ok && fn_ok();
    });
    m.find('.x-cancel').click(function () {
        m.modal('hide');
        fn_cancel && fn_cancel();
    });
    m.on({
        'hidden.bs.modal': function() {
            $('#div-confirm').remove();
        }
    });
    m.modal('show');
}


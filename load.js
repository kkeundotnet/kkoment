function kkoment_load(div_id, url, thread_id) {

// Global variables
var div = document.getElementById(div_id);
var loading_msg = document.createElement('p');
div.appendChild(loading_msg);
var comments_div = document.createElement('div');
div.appendChild(comments_div);
var last_id = -1;
var default_src = "https://kkoment.kkeun.net/a.php"
                + "?url=" + encodeURI(url)
                + "&thread_id=" + encodeURI(thread_id);

function update_last_id(new_id) {
    if(new_id > last_id)
        last_id = new_id;
}

function is_safe_html(md, error_msg) {
    var el = document.createElement( 'html' );
    el.innerHTML = (new showdown.Converter()).makeHtml(md);

    var block_tags = ['script', 'iframe', 'frame', 'img'];
    var block_tags_leng = block_tags.length;
    for (var i = 0; i < block_tags_leng; i++) {
        var block_tag = block_tags[i];
        if(el.getElementsByTagName(block_tag).length != 0) {
            error_msg('ERROR: '+block_tag+' 태그는 사용이 금지되어 있습니다.');
            return false;
        }
    }
    return true;
}

function make_http_request() {
    if (window.XMLHttpRequest) {
        return new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        return new ActiveXObject("Microsoft.XMLHTTP");
    }
}

function gen_space() {
    return document.createTextNode(' ');
}

function make_comment_div(j, is_preview = false) {
    var comment_div = document.createElement('div');

    var emoji = document.createElement('td');
    emoji.rowSpan = "2";
    emoji.className += " kkoment-emoji";
    emoji.innerHTML = "&#x1F601;" // TODO emoji

    var name = document.createTextNode(j.name);

    var date = document.createElement('span');
    date.className += " kkoment-date";
    date.innerText = (new Date(j.time)).toLocaleString();

    var name_date = document.createElement('td');
    name_date.appendChild(name);
    name_date.appendChild(gen_space());
    name_date.appendChild(date);

    var hash = document.createElement('td');
    hash.className += " kkoment-hash";
    hash.innerText = j.hashed;

    var tr1 = document.createElement('tr');
    tr1.appendChild(emoji);
    tr1.appendChild(name_date);

    var tr2 = document.createElement('tr');
    tr2.appendChild(hash);

    var info = document.createElement('table');
    info.className += " kkoment-table";
    info.appendChild(tr1);
    info.appendChild(tr2);
    comment_div.appendChild(info);

    var text = document.createElement('div');
    text.className += " kkoment-text";
    text.innerHTML = j.text;
    comment_div.appendChild(text);

    if(!is_preview) {
        var hr = document.createElement('hr');
        hr.className += " kkoment-hr";
        comment_div.appendChild(hr);
    }

    return comment_div;
}

function add_comments_div(j) {
    var j_length = j.length;
    for (var i = 0; i < j_length; i++) {
        var comment_div = make_comment_div(j[i]);
        update_last_id(j[i].id);
        comments_div.appendChild(comment_div);
        loading_msg.style.display = "none";
    }
}

function add_last_comments_div(j) {
    var filtered = j.filter(function(e){return e.id > last_id;});
    add_comments_div(filtered);
}

function refresh(normal_msg, error_msg) {
    function process_refresh_result(http_request) {
        if (http_request.readyState == 4) {
            if (http_request.status == 200 && http_request.responseText != "0") {
                add_last_comments_div(JSON.parse(http_request.responseText));
                normal_msg('리프레시 되었습니다.');
            } else {
                error_msg("리프레시에 실패하였습니다.");
            }
        } else {
            normal_msg("리프레시 중입니다...");
        }
    }

    var http_request = make_http_request();
    http_request.onreadystatechange = function(){process_refresh_result(http_request);};
    http_request.open('GET', default_src);
    http_request.send(null);
}

function add_input_form() {
    var name_box = document.createElement('input');
    name_box.type = "text";
    name_box.placeholder = "이름";

    var pw_box = document.createElement('input');
    pw_box.type = "password";
    pw_box.placeholder = "비밀번호";

    var textarea = document.createElement('textarea');
    textarea.placeholder = "마크다운 문법으로 댓글을 써 보세요.";
    textarea.className += " kkoment-textarea";
    autosize(textarea);

    var msg_console = document.createElement('span');
    function normal_msg(s) {
        msg_console.innerText = s;
        msg_console.style.color = "black";
    };
    function error_msg(s) {
        msg_console.innerText = s;
        msg_console.style.color = "red";
    };

    var send_button = document.createElement('button');
    send_button.innerHTML = "전송";

    var p1 = document.createElement('p');
    p1.appendChild(name_box);
    p1.appendChild(gen_space());
    p1.appendChild(pw_box);

    var p2 = document.createElement('p');
    p2.appendChild(textarea);

    var typing = document.createElement('div');
    typing.appendChild(p1);
    typing.appendChild(p2);

    var preview = document.createElement('div');
    preview.className += " kkoment-preview";
    preview.style.display = "none";

    var preview_button = document.createElement('button');
    preview_button.innerHTML = "미리보기";

    function process_add_result(http_request, send_button) {
        if (http_request.readyState == 4) {
            if (http_request.status == 200 && http_request.responseText == "1") {
                name_box.value = "";
                pw_box.value = "";
                textarea.value = "";
                if(preview.style.display != "none") {
                    preview.style.display = "none";
                    typing.style.display = "";
                }
                normal_msg('전송 되었습니다.');
                refresh(normal_msg, error_msg);
            } else {
                error_msg('전송에 실패하였습니다.');
            }
            send_button.disabled = false;
        } else {
            normal_msg('전송 중입니다...');
        }
    };

    send_button.onclick = function() {
        name = name_box.value;
        pw = pw_box.value;
        text = (new showdown.Converter()).makeHtml(textarea.value);
        time = (new Date()).toUTCString();

        if(!name || !pw || !text) {
            error_msg('ERROR: 이름, 비밀번호, 댓글 중 하나가 비었어요.');
            return
        }
        if(!is_safe_html(text, error_msg)) {
            return
        }

        send_button.disabled = true;

        // TODO: generate proof-of-work

        var params = new FormData();
        params.append('url', url);
        params.append('thread_id', thread_id);
        params.append('name', name);
        params.append('pw', pw);
        params.append('time', time);
        params.append('text', text);

        var src = "https://kkoment.kkeun.net/add.php";
        var http_request = make_http_request();
        http_request.onreadystatechange = function(){
            process_add_result(http_request, send_button);
        };
        http_request.open('POST', src);
        http_request.send(params);
    };

    preview_button.onclick = function() {
        if(preview.style.display == "none") {
            preview.innerHTML = "";
            var j = {
                name: name_box.value,
                text: (new showdown.Converter()).makeHtml(textarea.value),
                time: (new Date()).toUTCString(),
                hashed: sha256(name_box.value+pw_box.value),
            };
            preview.appendChild(make_comment_div(j, true));
            typing.style.display = "none";
            preview.style.display = "";
        } else {
            preview.style.display = "none";
            typing.style.display = "";
        }
    };

    var p3 = document.createElement('p');
    p3.appendChild(preview_button);
    p3.appendChild(gen_space());
    p3.appendChild(send_button);
    p3.appendChild(gen_space());
    p3.appendChild(msg_console);

    var input_form_div = document.createElement('div');
    input_form_div.appendChild(typing);
    input_form_div.appendChild(preview);
    input_form_div.appendChild(p3);
    div.appendChild(input_form_div);
}

function load_css() {
    var css_id = 'kkoment.css';
    if(!document.getElementById(css_id)) {
        var head = document.getElementsByTagName('head')[0];
        var link = document.createElement('link');
        link.id = css_id;
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = 'https://kkoment.kkeun.net/kkoment.css';
        link.media = 'all';
        head.appendChild(link);
    }
}

function load_ext_js(src) {
    var imported = document.createElement('script');
    imported.src = src;
    document.head.appendChild(imported);
}

function add_notice() {
    var markdown = document.createElement('p');
    markdown.style.fontSize = "small";
    markdown.innerHTML =
        "&#x26A0; 댓글은 " +
        "<a href=\"https://daringfireball.net/projects/markdown/syntax\">" +
        "마크다운 문법</a>으로 쓰되, 그림, 프레임, 스크립트는 보안을 위해 사용할 수 없습니다.";
    div.appendChild(markdown);
}

function kkoment_load_in() {
    load_ext_js('https://cdn.rawgit.com/jackmoore/autosize/4.0.0/dist/autosize.min.js');
    load_ext_js('https://cdnjs.cloudflare.com/ajax/libs/showdown/1.8.6/showdown.min.js');
    load_ext_js('https://cdnjs.cloudflare.com/ajax/libs/js-sha256/0.9.0/sha256.min.js');

    function render(j) {
        if(j.length == 0) {
            loading_msg.innerText = "아직 댓글이 없습니다.";
        } else {
            add_comments_div(j);
        }
        add_input_form();
        add_notice();
    }

    function process_result(http_request) {
        if (http_request.readyState == 4) {
            if (http_request.status == 200 && http_request.responseText != "0") {
                render(JSON.parse(http_request.responseText));
            } else {
                loading_msg.innerText = "loading kkoments error";
            }
        } else {
            loading_msg.innerText = "loading kkoments...";
        }
    };

    load_css();

    var http_request = make_http_request();
    http_request.onreadystatechange = function(){process_result(http_request);};
    http_request.open('GET', default_src);
    http_request.send(null);
}

kkoment_load_in();
}

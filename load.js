function is_safe_markdown(s) {
    // TODO
    return true;
}

function make_http_request() {
    if (window.XMLHttpRequest) {
        return new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        return new ActiveXObject("Microsoft.XMLHTTP");
    }
}

function make_comment_div(j) {
    var comment_div = document.createElement('div');

    var emoji = document.createElement('td');
    emoji.rowSpan = "2";
    emoji.className += " kkoment-emoji";
    emoji.innerHTML = "&#x1F601;" // TODO emoji

    var name = document.createElement('td');
    name.innerHTML = j.name;
    name.innerHTML += " ";

    var date = document.createElement('span');
    date.className += " kkoment-date";
    date.innerHTML = (new Date(j.time)).toLocaleString();
    name.appendChild(date);

    var hash = document.createElement('td');
    hash.className += " kkoment-hash";
    hash.innerHTML = j.hashed;

    var tr1 = document.createElement('tr');
    tr1.appendChild(emoji);
    tr1.appendChild(name);

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

    var hr = document.createElement('hr');
    hr.className += " kkoment-hr";
    comment_div.appendChild(hr);

    return comment_div;
}

function refresh() {
    alert('refresh called');
}

function add_input_form(url, thread_id, div) {
    var name_box = document.createElement('input');
    name_box.type = "text";
    name_box.placeholder = "이름";

    var pw_box = document.createElement('input');
    pw_box.type = "password";
    pw_box.placeholder = "비밀번호";

    var textarea = document.createElement('textarea');
    textarea.placeholder = "댓글을 써 보세요.";
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
    function process_add_result(http_request) {
        if (http_request.readyState == 4) {
            if (http_request.status == 200 && http_request.responseText == "1") {
                name_box.value = "";
                pw_box.value = "";
                textarea.value = "";
                normal_msg('전송에 성공하였습니다.');
                refresh();
            } else {
                error_msg('전송에 실패하였습니다.');
            }
        } else {
            normal_msg('전송 중입니다.');
        }
    };
    send_button.onclick = function() {
        name = name_box.value;
        pw = pw_box.value;
        text = textarea.value;
        time = (new Date()).toUTCString();

        if(!name || !pw || !text) {
            error_msg('ERROR: 이름, 비밀번호, 댓글 중 하나가 비었어요.');
            return
        }
        if(!is_safe_markdown(text)) {
            error_msg('ERROR: 안전한 마크다운 형식이 아닙니다.');
            return
        }

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
        http_request.onreadystatechange = function(){process_add_result(http_request);}
        http_request.open('POST', src);
        http_request.send(params);
    };
    send_button.innerHTML = "전송";

    var space = document.createTextNode(' ');

    var p1 = document.createElement('p');
    p1.appendChild(name_box);
    p1.appendChild(space);
    p1.appendChild(pw_box);

    var p2 = document.createElement('p');
    p2.appendChild(textarea);

    var p3 = document.createElement('p');
    p3.appendChild(send_button);
    p3.appendChild(space);
    p3.appendChild(msg_console);

    var input_form_div = document.createElement('div');
    input_form_div.appendChild(p1);
    input_form_div.appendChild(p2);
    input_form_div.appendChild(p3);
    div.appendChild(input_form_div);
}

function add_comments_div(j, div) {
    var comments_div = document.createElement('div');

    var j_length = j.length;
    for (var i = 0; i < j_length; i++) {
        var comment_div = make_comment_div(j[i]);
        comments_div.appendChild(comment_div);
    }

    div.appendChild(comments_div);
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

function kkoment_load(div_id, url, thread_id) {
    var loading_msg = document.createElement('p');
    var div = document.getElementById(div_id);
    div.appendChild(loading_msg);

    function render(j) {
        loading_msg.style.display = "none";
        add_comments_div(j, div);
        add_input_form(url, thread_id, div);
    }

    function process_result(http_request) {
        if (http_request.readyState == 4) {
            if (http_request.status == 200) {
                render(JSON.parse(http_request.responseText));
            } else {
                loading_msg.innerText = "loading kkoments error";
            }
        } else {
            loading_msg.innerText = "loading kkoments...";
        }
    };

    load_css();

    var src = "https://kkoment.kkeun.net/a.php"
        + "?url=" + encodeURI(url)
        + "&thread_id=" + encodeURI(thread_id);

    var http_request = make_http_request();
    http_request.onreadystatechange = function(){process_result(http_request);};
    http_request.open('GET', src);
    http_request.send(null);
}

function kkoment_load(div_id, url, thread_id) {
    var http_request;
    var loading_msg;
    var prefix = thread_id+"-kkoment-prefix";
    var div = document.getElementById(div_id);

    function loading_start() {
        var loading_msg_id = prefix+"-loading-msg";
        loading_msg = document.createElement('p');
        loading_msg.id = loading_msg_id;
        div.appendChild(loading_msg);
    }

    function add_comment_div(s) {
        var comment_p = document.createElement('p');
        comment_p.innerHTML = "TODO: add comment here";

        var comment_div = document.createElement('div');
        comment_div.appendChild(comment_p);
        div.appendChild(comment_div);
        // TODO
    }

    function add_input_form() {
        var name_box = document.createElement('input');
        name_box.type = "text";
        name_box.placeholder = "이름";

        var pw_box = document.createElement('input');
        pw_box.type = "password";
        pw_box.placeholder = "비밀번호";

        var textarea = document.createElement('textarea');
        textarea.placeholder = "댓글을 써 보세요.";
        textarea.style.width = "100%";
        textarea.style["-webkit-box-sizing"] = "border-box";
        textarea.style["-moz-box-sizing"] = "border-box";
        textarea.style["box-sizing"] = "border-box";
        autosize(textarea);

        var send_button = document.createElement('button');
        send_button.onclick = function() { alert('hello world'); };
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

        var input_form_div = document.createElement('div');
        input_form_div.appendChild(p1);
        input_form_div.appendChild(p2);
        input_form_div.appendChild(p3);
        div.appendChild(input_form_div);
    }


    function render(s) {
        div.innerHTML = s;      // TODO: remove
        loading_msg.style.display = "none";
        add_comment_div(s);
        add_input_form();
    }

    function process_result() {
        if (http_request.readyState == 4) {
            if (http_request.status == 200) {
                render(http_request.responseText);
            } else {
                loading_msg.innerText = "loading kkoments error";
            }
        } else {
            loading_msg.innerText = "loading kkoments...";
        }
    };

    var src = "https://kkoment.kkeun.net/a.php"
        + "?url=" + encodeURI(url)
        + "&thread_id=" + encodeURI(thread_id);

    loading_start();
    if (window.XMLHttpRequest) {
        http_request = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        http_request = new ActiveXObject("Microsoft.XMLHTTP");
    }
    http_request.onreadystatechange = process_result;
    http_request.open('GET', src);
    http_request.send(null);
}

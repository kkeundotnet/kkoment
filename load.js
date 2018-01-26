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
var emojis =
    ['1F601', '1F602', '1F603', '1F604', '1F605', '1F606', '1F609',
     '1F60A', '1F60B', '1F60C', '1F60D', '1F60F', '1F612', '1F613',
     '1F614', '1F616', '1F618', '1F61A', '1F61C', '1F61D', '1F61E',
     '1F620', '1F621', '1F622', '1F623', '1F624', '1F625', '1F628',
     '1F629', '1F62A', '1F62B', '1F62D', '1F630', '1F631', '1F632',
     '1F633', '1F635', '1F637', '1F638', '1F639', '1F63A', '1F63B',
     '1F63C', '1F63D', '1F63E', '1F63F', '1F640', '1F645', '1F646',
     '1F647', '1F648', '1F649', '1F64A', '1F64B', '1F64C', '1F64D',
     '1F64E', '1F64F', '2702', '2705', '2708', '2709', '270A', '270B',
     '270C', '270F', '2712', '2714', '2716', '2728', '2733', '2734',
     '2744', '2747', '274C', '274E', '2753', '2754', '2755', '2757',
     '2764', '2795', '2796', '2797', '27A1', '27B0', '1F680', '1F683',
     '1F684', '1F685', '1F687', '1F689', '1F68C', '1F68F', '1F691',
     '1F692', '1F693', '1F695', '1F697', '1F699', '1F69A', '1F6A2',
     '1F6A4', '1F6A5', '1F6A7', '1F6A8', '1F6A9', '1F6AA', '1F6AB',
     '1F6AC', '1F6AD', '1F6B2', '1F6B6', '1F6B9', '1F6BA', '1F6BB',
     '1F6BC', '1F6BD', '1F6BE', '1F6C0', '24C2', '1F170', '1F171', '1F17E',
     '1F17F', '1F18E', '1F191', '1F192', '1F193', '1F194', '1F195',
     '1F196', '1F197', '1F198', '1F199', '1F19A', '203C', '2049', '2139',
     '231A', '231B', '23E9', '23EA', '23EB', '23EC', '23F0', '23F3',
     '25B6', '25C0', '2600', '2601', '260E', '2611', '2614', '2615',
     '261D', '263A', '2648', '2649', '264A', '264B', '264C', '264D',
     '264E', '264F', '2650', '2651', '2652', '2653', '2660', '2663',
     '2665', '2666', '2668', '267B', '267F', '2693', '26A0', '26A1',
     '26AA', '26AB', '26BD', '26BE', '26C4', '26C5', '26CE', '26D4',
     '26EA', '26F2', '26F3', '26F5', '26FA', '26FD', '2B05', '2B06',
     '2B07', '2B1B', '2B1C', '2B50', '2B55', '1F004', '1F0CF', '1F300',
     '1F301', '1F302', '1F303', '1F304', '1F305', '1F306', '1F307',
     '1F308', '1F309', '1F30A', '1F30B', '1F30C', '1F30F', '1F311',
     '1F313', '1F314', '1F315', '1F319', '1F31B', '1F31F', '1F320',
     '1F330', '1F331', '1F334', '1F335', '1F337', '1F338', '1F339',
     '1F33A', '1F33B', '1F33C', '1F33D', '1F33E', '1F33F', '1F340',
     '1F341', '1F342', '1F343', '1F344', '1F345', '1F346', '1F347',
     '1F348', '1F349', '1F34A', '1F34C', '1F34D', '1F34E', '1F34F',
     '1F351', '1F352', '1F353', '1F354', '1F355', '1F356', '1F357',
     '1F358', '1F359', '1F35A', '1F35B', '1F35C', '1F35D', '1F35E',
     '1F35F', '1F360', '1F361', '1F362', '1F363', '1F364', '1F365',
     '1F366', '1F367', '1F368', '1F369', '1F36A', '1F36B', '1F36C',
     '1F36D', '1F36E', '1F36F', '1F370', '1F371', '1F372', '1F373',
     '1F374', '1F375', '1F376', '1F377', '1F378', '1F379', '1F37A',
     '1F37B', '1F380', '1F381', '1F382', '1F383', '1F384', '1F385',
     '1F386', '1F387', '1F388', '1F389', '1F38A', '1F38B', '1F38C',
     '1F38D', '1F38E', '1F38F', '1F390', '1F391', '1F392', '1F393',
     '1F3A0', '1F3A1', '1F3A2', '1F3A3', '1F3A4', '1F3A5', '1F3A6',
     '1F3A7', '1F3A8', '1F3A9', '1F3AA', '1F3AB', '1F3AC', '1F3AD',
     '1F3AE', '1F3AF', '1F3B0', '1F3B1', '1F3B2', '1F3B3', '1F3B4',
     '1F3B5', '1F3B6', '1F3B7', '1F3B8', '1F3B9', '1F3BA', '1F3BB',
     '1F3BC', '1F3BD', '1F3BE', '1F3BF', '1F3C0', '1F3C1', '1F3C2',
     '1F3C3', '1F3C4', '1F3C6', '1F3C8', '1F3CA', '1F3E0', '1F3E1',
     '1F3E2', '1F3E3', '1F3E5', '1F3E6', '1F3E7', '1F3E8', '1F3E9',
     '1F3EA', '1F3EB', '1F3EC', '1F3ED', '1F3EE', '1F3EF', '1F3F0',
     '1F40C', '1F40D', '1F40E', '1F411', '1F412', '1F414', '1F417',
     '1F418', '1F419', '1F41A', '1F41B', '1F41C', '1F41D', '1F41E',
     '1F41F', '1F420', '1F421', '1F422', '1F423', '1F424', '1F425',
     '1F426', '1F427', '1F428', '1F429', '1F42B', '1F42C', '1F42D',
     '1F42E', '1F42F', '1F430', '1F431', '1F432', '1F433', '1F434',
     '1F435', '1F436', '1F437', '1F438', '1F439', '1F43A', '1F43B',
     '1F43C', '1F43D', '1F43E', '1F440', '1F442', '1F443', '1F444',
     '1F445', '1F446', '1F447', '1F448', '1F449', '1F44A', '1F44B',
     '1F44C', '1F44D', '1F44E', '1F44F', '1F450', '1F451', '1F452',
     '1F453', '1F454', '1F455', '1F456', '1F457', '1F458', '1F459',
     '1F45A', '1F45B', '1F45C', '1F45D', '1F45E', '1F45F', '1F460',
     '1F461', '1F462', '1F463', '1F464', '1F466', '1F467', '1F468',
     '1F469', '1F46A', '1F46B', '1F46E', '1F46F', '1F470', '1F471',
     '1F472', '1F473', '1F474', '1F475', '1F476', '1F477', '1F478',
     '1F479', '1F47A', '1F47B', '1F47C', '1F47D', '1F47E', '1F47F',
     '1F480', '1F481', '1F482', '1F483', '1F484', '1F485', '1F486',
     '1F487', '1F488', '1F489', '1F48A', '1F48B', '1F48C', '1F48D',
     '1F48E', '1F48F', '1F490', '1F491', '1F492', '1F493', '1F494',
     '1F495', '1F496', '1F497', '1F498', '1F499', '1F49A', '1F49B',
     '1F49C', '1F49D', '1F49E', '1F49F', '1F4A0', '1F4A1', '1F4A2',
     '1F4A3', '1F4A4', '1F4A5', '1F4A6', '1F4A7', '1F4A8', '1F4A9',
     '1F4AA', '1F4AB', '1F4AC', '1F4AE', '1F4AF', '1F4B0', '1F4B1',
     '1F4B2', '1F4B3', '1F4B4', '1F4B5', '1F4B8', '1F4B9', '1F4BA',
     '1F4BB', '1F4BC', '1F4BD', '1F4BE', '1F4BF', '1F4C0', '1F4C1',
     '1F4C2', '1F4C3', '1F4C4', '1F4C5', '1F4C6', '1F4C7', '1F4C8',
     '1F4C9', '1F4CA', '1F4CB', '1F4CC', '1F4CD', '1F4CE', '1F4CF',
     '1F4D0', '1F4D1', '1F4D2', '1F4D3', '1F4D4', '1F4D5', '1F4D6',
     '1F4D7', '1F4D8', '1F4D9', '1F4DA', '1F4DB', '1F4DC', '1F4DD',
     '1F4DE', '1F4DF', '1F4E0', '1F4E1', '1F4E2', '1F4E3', '1F4E4',
     '1F4E5', '1F4E6', '1F4E7', '1F4E8', '1F4E9', '1F4EA', '1F4EB',
     '1F4EE', '1F4F0', '1F4F1', '1F4F2', '1F4F3', '1F4F4', '1F4F6',
     '1F4F7', '1F4F9', '1F4FA', '1F4FB', '1F4FC', '1F503', '1F50A',
     '1F50B', '1F50C', '1F50D', '1F50E', '1F50F', '1F510', '1F511',
     '1F512', '1F513', '1F514', '1F516', '1F517', '1F518', '1F519',
     '1F51A', '1F51B', '1F51C', '1F51D', '1F51E', '1F51F', '1F520',
     '1F521', '1F522', '1F523', '1F524', '1F525', '1F526', '1F527',
     '1F528', '1F529', '1F52A', '1F52B', '1F52E', '1F52F', '1F530',
     '1F531', '1F532', '1F533', '1F534', '1F535', '1F536', '1F537',
     '1F53A', '1F53B', '1F550', '1F551', '1F552', '1F553', '1F554',
     '1F555', '1F556', '1F557', '1F558', '1F559', '1F55A', '1F55B',
     '1F5FB', '1F5FC', '1F5FD', '1F5FE', '1F5FF', '1F600', '1F607',
     '1F608', '1F60E', '1F610', '1F611', '1F615', '1F617', '1F619',
     '1F61B', '1F61F', '1F626', '1F627', '1F62C', '1F62E', '1F62F',
     '1F634', '1F636', '1F681', '1F682', '1F686', '1F688', '1F68A',
     '1F68D', '1F68E', '1F690', '1F694', '1F696', '1F698', '1F69B',
     '1F69C', '1F69D', '1F69E', '1F69F', '1F6A0', '1F6A1', '1F6A3',
     '1F6A6', '1F6AE', '1F6AF', '1F6B0', '1F6B1', '1F6B3', '1F6B4',
     '1F6B5', '1F6B7', '1F6B8', '1F6BF', '1F6C1', '1F6C2', '1F6C3',
     '1F6C4', '1F6C5', '1F30D', '1F30E', '1F310', '1F312', '1F316',
     '1F317', '1F318', '1F31A', '1F31C', '1F31D', '1F31E', '1F332',
     '1F333', '1F34B', '1F350', '1F37C', '1F3C7', '1F3C9', '1F3E4',
     '1F400', '1F401', '1F402', '1F403', '1F404', '1F405', '1F406',
     '1F407', '1F408', '1F409', '1F40A', '1F40B', '1F40F', '1F410',
     '1F413', '1F415', '1F416', '1F42A', '1F465', '1F46C', '1F46D',
     '1F4AD', '1F4B6', '1F4B7', '1F4EC', '1F4ED', '1F4EF', '1F4F5',
     '1F500', '1F501', '1F502', '1F504', '1F505', '1F506', '1F507',
     '1F509', '1F515', '1F52C', '1F52D', '1F55C', '1F55D', '1F55E',
     '1F55F', '1F560', '1F561', '1F562', '1F563', '1F564', '1F565',
     '1F566', '1F567'];

function get_emoji(hash) {
    let n = parseInt("0x" + hash.substring(0, 6));
    return "&#x"+emojis[n % emojis.length]+";";
}

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
    emoji.innerHTML = get_emoji(j.hashed);

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

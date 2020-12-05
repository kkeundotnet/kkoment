declare function autosize(text_area: HTMLTextAreaElement): void;

declare namespace autosize {
    function update(text_area: HTMLTextAreaElement): void;
}

declare namespace kkmarkdown {
    function trans(s: string): string;
}

type kkoment_num = {
    "n": number,
    "recent": boolean,
}

const kkoment = (function() {
    function get_http_request({
        succeeded,
        failed,
        waiting,
    }: {
        succeeded: (response_text: string) => void,
        failed: () => void,
        waiting: () => void,
    }): XMLHttpRequest {
        const http_request = new XMLHttpRequest();
        http_request.onreadystatechange = function(): void {
            if (http_request.readyState == 4) {
                if (http_request.status == 200) {
                    succeeded(http_request.responseText);
                } else {
                    failed();
                }
            } else {
                waiting();
            }
        };
        return http_request;
    }

    // https://stackoverflow.com/questions/11076975/insert-text-into-textarea-at-cursor-position-javascript
    function insert_at_cursor(text_area: HTMLTextAreaElement, s: string): void {
        if ((document as any).selection) {
            // IE support
            text_area.focus();
            const sel = (document as any).selection.createRange();
            sel.text = s;
        } else if (text_area.selectionStart || text_area.selectionStart == 0) {
            // MOZILLA and others
            const startPos = text_area.selectionStart;
            const endPos = text_area.selectionEnd;
            text_area.value = text_area.value.substring(0, startPos)
                + s
                + text_area.value.substring(endPos, text_area.value.length);
            const cursorPos = startPos + s.length;
            text_area.selectionStart = cursorPos;
            text_area.selectionEnd = cursorPos;
        } else {
            text_area.value += s;
        }
    }

    function id(): void { }

    function get_emojis(ranges: { start: string, end: string }[]): string[] {
        const emojis: string[] = [];
        ranges.forEach(function(range) {
            const start = parseInt(range.start, 16);
            const end = parseInt(range.end, 16);
            for (let i = start; i <= end; i++) {
                emojis.push(i.toString(16));
            }
        });
        return emojis;
    }

    function load(
        div_id: string,
        domain_id: string,
        thread_id: string,
    ): void {
        const div_nullable = document.getElementById(div_id);
        if (!div_nullable) {
            alert(`${div_id}를 못 찾았습니다.`);
            return;
        }
        const div: HTMLElement = div_nullable;

        const loading_msg = document.createElement('p');
        div.appendChild(loading_msg);

        const comments_body = document.createElement('div');
        div.appendChild(comments_body);

        let last_id = -1;

        const thread_php = `${kkoment_url}?domain_id=${encodeURI(domain_id)}&thread_id=${encodeURI(thread_id)}`;

        const characters = get_emojis([
            { start: '1f32d', end: '1f335' },
            { start: '1f337', end: '1f373' },
            { start: '1f375', end: '1f37a' },
            { start: '1f37c', end: '1f37c' },
            { start: '1f37f', end: '1f37f' },
            { start: '1f382', end: '1f385' },
            { start: '1f400', end: '1f43c' },
            { start: '1f47b', end: '1f480' },
            { start: '1f4a9', end: '1f4a9' },
            { start: '1f575', end: '1f575' },
            { start: '1f916', end: '1f916' },
            { start: '1f920', end: '1f921' },
            { start: '1f934', end: '1f934' },
            { start: '1f936', end: '1f936' },
            { start: '1f950', end: '1f961' },
            { start: '1f963', end: '1f96f' },
            { start: '1f980', end: '1f9a2' },
            { start: '1f9b7', end: '1f9b9' },
            { start: '1f9c0', end: '1f9c2' },
            { start: '1f9d9', end: '1f9df' },
            { start: '2615', end: '2615' },
            { start: '26c4', end: '26c4' },
        ]);

        const emojis = get_emojis([
            { start: '1f600', end: '1f637' },
            { start: '1f641', end: '1f644' },
            { start: '1f910', end: '1f915' },
            { start: '1f917', end: '1f917' },
            { start: '1f922', end: '1f925' },
            { start: '1f927', end: '1f92f' },
            { start: '1f970', end: '1f970' },
            { start: '1f973', end: '1f976' },
            { start: '1f97a', end: '1f97a' },
            { start: '270c', end: '270c' },
            { start: '1f44b', end: '1f44f' },
            { start: '1f64f', end: '1f64f' },
            { start: '1f64c', end: '1f64c' },
            { start: '1f645', end: '1f647' },
            { start: '1f64b', end: '1f64b' },
            { start: '1f926', end: '1f926' },
            { start: '1f648', end: '1f64a' },
            { start: '1f389', end: '1f38a' },
            { start: '2728', end: '2728' },
            { start: '1f3b5', end: '1f3b6' },
        ]).concat(characters);


        function character_of(name_hash: string): string {
            const n = parseInt(`0x${name_hash.substring(0, 6)}`);
            return `&#x${characters[n % characters.length]};`;
        }

        function update_last_id(new_id: number): void {
            if (new_id > last_id)
                last_id = new_id;
        }

        function make_space(): Text {
            return document.createTextNode(' ');
        }

        type CommentNew = {
            state: 'new';
            name: string;
            text: string;
            time: Date;
        };

        type CommentRead = {
            state: 'read';
            id: number;
            name: string;
            name_hash: string;
            removed: number;
            text: string;
            time: string;
        };

        type Comment = CommentNew | CommentRead

        function make_comment(j: Comment): HTMLDivElement {
            const comment = document.createElement('div');

            const emoji = document.createElement('td');
            emoji.rowSpan = 2;
            emoji.className += ' kkoment-emoji';
            switch (j.state) {
                case 'new':
                    emoji.innerHTML = '&#x263A';
                    break;
                case 'read':
                    emoji.innerHTML = character_of(j.name_hash);
                    break;
            }

            const name = document.createTextNode(j.name);

            const time = document.createElement('span');
            time.className += ' kkoment-time';
            switch (j.state) {
                case 'new':
                    time.innerText = j.time.toLocaleString();
                    break;
                case 'read':
                    time.innerText = (new Date(j.time)).toLocaleString();
                    break;
            }

            const name_time = document.createElement('td');
            name_time.appendChild(name);
            name_time.appendChild(make_space());
            name_time.appendChild(time);

            const name_hash = document.createElement('td');
            name_hash.className += ' kkoment-name-hash';
            switch (j.state) {
                case 'new':
                    name_hash.innerText = '실제 사용될 이모티콘은 서버 측에서 계산돼요.';
                    break;
                case 'read':
                    name_hash.innerText = `${j.name_hash} ${j.id}`;
                    break;
            }

            const row1 = document.createElement('tr');
            row1.appendChild(emoji);
            row1.appendChild(name_time);

            const row2 = document.createElement('tr');
            row2.appendChild(name_hash);

            const info = document.createElement('table');
            info.className += ' kkoment-info';
            info.appendChild(row1);
            info.appendChild(row2);
            comment.appendChild(info);

            const text = document.createElement('div');
            text.className += ' kkoment-text';
            text.innerHTML = j.text;
            comment.appendChild(text);

            switch (j.state) {
                case 'read':
                    const hr = document.createElement('hr');
                    hr.className += ' kkoment-hr';
                    comment.appendChild(hr);
                    break;
            }

            return comment;
        }

        function add_comments(j: CommentRead[]): void {
            for (let i = 0; i < j.length; i++) {
                const comment = make_comment(j[i]);
                update_last_id(j[i].id);
                comments_body.appendChild(comment);
                loading_msg.style.display = 'none';
            }
        }

        function add_last_comments(j: CommentRead[]): void {
            const filtered = j.filter(function(e: CommentRead): boolean {
                return e.id > last_id;
            });
            add_comments(filtered);
        }

        function parse_comments(response_text: string): CommentRead[] {
            const comments = JSON.parse(response_text);
            for (const comment of comments) {
                comment.state = 'read';
            }
            return comments;
        }

        function refresh_comments(
            normal_msg: (msg: string) => void,
            error_msg: (msg: string) => void,
        ): void {
            const http_request = get_http_request({
                succeeded: function(response_text: string): void {
                    add_last_comments(parse_comments(response_text));
                    normal_msg('리프레시됐습니다.');
                },
                failed: function(): void {
                    error_msg('리프레시 실패했습니다.');
                },
                waiting: function(): void {
                    normal_msg('리프레시 중입니다...');
                },
            });
            http_request.open('GET', thread_php);
            http_request.send();
        }

        function add_input_form(): void {
            const name_area = document.createElement('input');
            name_area.type = 'text';
            name_area.placeholder = '이름';

            const pw_area = document.createElement('input');
            pw_area.type = 'password';
            pw_area.placeholder = '비밀번호';

            const text_area = document.createElement('textarea');
            text_area.placeholder = '마크다운 문법으로 댓글을 써 보세요.';
            text_area.className += ' kkoment-text-area';
            autosize(text_area);

            const msg_console = document.createElement('span');
            function normal_msg(s: string): void {
                msg_console.innerText = s;
                msg_console.className = '';
            };
            function error_msg(s: string): void {
                msg_console.innerText = s;
                msg_console.className = 'kkoment-alert';
            };

            const send_button = document.createElement('button');
            send_button.innerHTML = '전송';
            send_button.classList.add('kkoment-button');

            const name_pw = document.createElement('p');
            name_pw.appendChild(name_area);
            name_pw.appendChild(make_space());
            name_pw.appendChild(pw_area);

            const input_area = document.createElement('div');
            input_area.appendChild(name_pw);
            input_area.appendChild(text_area);

            const preview = document.createElement('div');
            preview.className += ' kkoment-preview';
            preview.style.display = 'none';

            const preview_button = document.createElement('button');
            preview_button.innerHTML = '미리보기';
            preview_button.classList.add('kkoment-button');

            function get_http_request_(send_button: HTMLButtonElement): XMLHttpRequest {
                return get_http_request({
                    succeeded: function(_response_text: string): void {
                        text_area.value = '';
                        if (preview.style.display != 'none') {
                            preview.style.display = 'none';
                            input_area.style.display = '';
                        }
                        autosize.update(text_area);
                        normal_msg('전송됐습니다.');
                        refresh_comments(normal_msg, error_msg);
                        send_button.disabled = false;
                    },
                    failed: function(): void {
                        error_msg('전송 실패했습니다.');
                        send_button.disabled = false;
                    },
                    waiting: function(): void {
                        normal_msg('전송 중입니다...');
                    },
                });
            };

            send_button.onclick = function(): void {
                const name = name_area.value;
                const pw = pw_area.value;
                const text = text_area.value;

                if (!name) {
                    error_msg('이름이 비었어요.');
                    return
                }

                if (!pw) {
                    error_msg('비밀번호가 비었어요.');
                    return
                }

                if (!text) {
                    error_msg('댓글이 비었어요.');
                    return
                }

                send_button.disabled = true;

                const params = new FormData();
                params.append('domain_id', domain_id);
                params.append('thread_id', thread_id);
                params.append('name', name);
                params.append('pw', pw);
                params.append('text', text);

                const comment_php = kkoment_url;
                const http_request = get_http_request_(send_button);
                http_request.open('POST', comment_php);
                http_request.send(params);
            };

            function update_preview(): void {
                preview.innerHTML = '';
                const j: CommentNew = {
                    state: 'new',
                    name: name_area.value,
                    text: kkmarkdown.trans(text_area.value),
                    time: new Date(),
                };
                preview.appendChild(make_comment(j));
            };

            preview_button.onclick = function(): void {
                if (preview.style.display == 'none') {
                    update_preview();
                    input_area.style.display = 'none';
                    preview.style.display = '';
                } else {
                    preview.style.display = 'none';
                    input_area.style.display = '';
                    autosize.update(text_area);
                }
            };

            const emoji_button = document.createElement('button');
            emoji_button.innerHTML = '&#x1F353;';
            emoji_button.classList.add('kkoment-button');

            const buttons = document.createElement('p');
            buttons.appendChild(emoji_button);
            buttons.appendChild(make_space());
            buttons.appendChild(preview_button);
            buttons.appendChild(make_space());
            buttons.appendChild(send_button);
            buttons.appendChild(make_space());
            buttons.appendChild(msg_console);

            function make_emoji_button(emoji: string): HTMLSpanElement {
                const button = document.createElement('span');
                const emoji_html = `&#x${emoji};`;
                button.innerHTML = emoji_html;
                button.onclick = function(): void {
                    insert_at_cursor(text_area, emoji_html);
                    autosize.update(text_area);
                    if (preview.style.display != 'none') {
                        update_preview();
                    }
                };
                return button;
            };

            const emojis_area = document.createElement('div');
            emojis_area.style.display = 'none';
            emojis_area.className += ' kkoment-emojis-area';
            for (let i = 0; i < emojis.length; i++) {
                emojis_area.appendChild(make_emoji_button(emojis[i]));
                emojis_area.appendChild(document.createTextNode(' '));
            }

            emoji_button.onclick = function(): void {
                if (emojis_area.style.display == 'none') {
                    emojis_area.style.display = '';
                } else {
                    emojis_area.style.display = 'none';
                }
            };

            const input_form = document.createElement('div');
            input_form.appendChild(input_area);
            input_form.appendChild(preview);
            input_form.appendChild(buttons);
            input_form.appendChild(emojis_area);
            div.appendChild(input_form);
        }

        function load_css(): void {
            const css_id = 'kkoment.css';
            if (!document.getElementById(css_id)) {
                const head = document.getElementsByTagName('head')[0];
                const link = document.createElement('link');
                link.id = css_id;
                link.rel = 'stylesheet';
                link.type = 'text/css';
                link.href = `${kkoment_url}/kkoment.css`;
                head.appendChild(link);
            }
        }

        function add_notice(): void {
            const notice = document.createElement('p');
            notice.style.fontSize = 'small';
            notice.innerHTML =
                '&#x26A0; 비밀번호는 글쓴이를 구분하는 용도로만 사용됩니다.<br>' +
                '&#x26A0; 댓글은 <a href ="https://github.com/kkeundotnet/kkmarkdown/blob/master/syntax.md">다소 제한된 마크다운 문법</a>으로 쓸 수 있습니다.';
            div.appendChild(notice);
        }

        function initial_render(j: CommentRead[]): void {
            if (j.length == 0) {
                loading_msg.innerText = '아직 댓글이 없습니다.';
            } else {
                add_comments(j);
            }
            add_input_form();
            add_notice();
        }

        load_css();
        const http_request = get_http_request({
            succeeded: function(response_text: string): void {
                initial_render(parse_comments(response_text));
            },
            failed: function(): void {
                loading_msg.innerText = '꼬멘트 읽기에 실패했습니다.';
            },
            waiting: function(): void {
                loading_msg.innerText = '꼬멘트 읽는 중...';
            },
        });
        http_request.open('GET', thread_php);
        http_request.send();
    }

    function load_n(
        domain_id: string,
        num_cb: (num: kkoment_num) => string = function(num: kkoment_num): string {
            return num["n"].toString();
        },
        full_cb: () => void = id,
    ): void {
        function render(nums: { [key: string]: kkoment_num | undefined; }) {
            const kkoment_nums = document.getElementsByClassName('kkoment-num');
            for (let i = 0; i < kkoment_nums.length; i++) {
                const kkoment_num = kkoment_nums[i];
                if (kkoment_num instanceof HTMLElement && kkoment_num.dataset.kkomentThreadId) {
                    let num = nums[kkoment_num.dataset.kkomentThreadId];
                    if (!num) {
                        num = { "n": 0, "recent": false };
                    }
                    kkoment_num.innerHTML = num_cb(num);
                }
            }
        }

        const thread_php = `${kkoment_url}?domain_id=${encodeURI(domain_id)}&only_num=1`;
        const http_request = get_http_request({
            succeeded: function(response_text: string): void {
                render(JSON.parse(response_text));
                full_cb();
            },
            failed: id,
            waiting: id,
        });
        http_request.open('GET', thread_php);
        http_request.send();
    }

    return { load, load_n };
})();

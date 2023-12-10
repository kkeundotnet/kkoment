import * as React from 'react';
import * as ReactDOM from 'react-dom';
import TextareaAutosize from 'react-textarea-autosize';
import { kkoment_url } from './url';

declare namespace kkmarkdown {
    function trans(s: string): string;
}

// https://stackoverflow.com/questions/3583724/how-do-i-add-a-delay-in-a-javascript-loop
function timer(ms: number): Promise<void> {
    return new Promise(res => setTimeout(res, ms));
}

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
    http_request.onreadystatechange = () => {
        if (http_request.readyState === 4) {
            if (http_request.status === 200) {
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

function get_emojis(ranges: { start: string, end: string }[]): string[] {
    const emojis: string[] = [];
    ranges.forEach((range) => {
        const start = parseInt(range.start, 16);
        const end = parseInt(range.end, 16);
        for (let i = start; i <= end; i++) {
            emojis.push(i.toString(16));
        }
    });
    return emojis;
}

class NameHash extends React.Component<{
    name_hash: string,
    short_name_hash: boolean,
    toggle_short_name_hash: () => void,
}> {
    render() {
        let name_hash = this.props.name_hash;
        if (this.props.short_name_hash) {
            name_hash = name_hash.substring(0, 6);
        }
        return <span onClick={this.props.toggle_short_name_hash}>{name_hash}</span>;
    }
}

enum CommentState {
    Read,
    New,
}

type CommentRead = {
    state: CommentState.Read,
    id: number,
    name: string,
    name_hash: string,
    removed: number,
    text: string,
    time: string,
}

type CommentNew = {
    state: CommentState.New;
    name: string;
    text: string;
    time: Date;
};

class Comment extends React.Component<{
    comment: CommentRead | CommentNew,
    characters: string[],
    short_name_hash: boolean,
    toggle_short_name_hash: () => void,
}> {
    character_for_new() {
        return <span dangerouslySetInnerHTML={{ __html: '&#x263A;' }} />;
    }

    character_of(name_hash: string) {
        const n = parseInt(`0x${name_hash.substring(0, 6)}`);
        return <span dangerouslySetInnerHTML={{
            __html: `&#x${this.props.characters[n % this.props.characters.length]};`
        }} />;
    }

    render() {
        const comment = this.props.comment;

        const emoji = <td rowSpan={2} className='kkoment-emoji'>
            {comment.state === CommentState.Read && this.character_of(comment.name_hash)}
            {comment.state === CommentState.New && this.character_for_new()}
        </td>;

        const name = <td>
            {comment.name}
            {' '}
            <span className='kkoment-time'>
                {comment.state === CommentState.Read && (new Date(comment.time)).toLocaleString()}
                {comment.state === CommentState.New && comment.time.toLocaleString()}
            </span>
        </td>;

        const hash = <td className='kkoment-name-hash'>
            {comment.state === CommentState.Read && <span>
                <NameHash name_hash={comment.name_hash}
                    short_name_hash={this.props.short_name_hash}
                    toggle_short_name_hash={this.props.toggle_short_name_hash} />
                {' '}
                {comment.id}
            </span>}
            {comment.state === CommentState.New && '실제 사용될 이모티콘은 서버 측에서 계산됩니다.'}
        </td>;

        return <div>
            <table className='kkoment-info'><tbody>
                <tr>{emoji}{name}</tr>
                <tr>{hash}</tr>
            </tbody></table>
            <div className='kkoment-text' dangerouslySetInnerHTML={{ __html: comment.text }} />
            {comment.state === CommentState.Read && <hr className='kkoment-hr' />}
        </div>;
    }
}

type comments_body_props = { comments: CommentRead[], characters: string[] }

type comments_body_state = { short_name_hash: boolean }

class CommentsBody extends React.Component<comments_body_props, comments_body_state> {
    constructor(props: comments_body_props) {
        super(props);
        this.state = { short_name_hash: true };
        this.toggle_short_name_hash = this.toggle_short_name_hash.bind(this);
    }

    toggle_short_name_hash() {
        this.setState({ short_name_hash: !this.state.short_name_hash });
    }

    render() {
        return <div>{this.props.comments.map((comment) =>
            <Comment key={comment.id}
                comment={comment}
                characters={this.props.characters}
                short_name_hash={this.state.short_name_hash}
                toggle_short_name_hash={this.toggle_short_name_hash}
            />
        )}</div>;
    }
}

type input_form_props = {
    domain_id: string,
    thread_id: string,
    emojis: string[],
    thread_php: string,
    thread_php_succeed: (response_text: string) => void,
}

type input_form_state = {
    name: string,
    pw: string,
    text_area: string,
    preview: string,
    msg_console: string,
    msg_console_classname: string,
    emojis_area_display: boolean,
    send_button_disabled: boolean,
}

class InputForm extends React.Component<input_form_props, input_form_state> {
    need_update_preview: boolean = false;
    text_area_ref: React.RefObject<HTMLTextAreaElement>;

    constructor(props: input_form_props) {
        super(props);
        this.state = {
            name: '',
            pw: '',
            text_area: '',
            preview: '',
            msg_console: '',
            msg_console_classname: '',
            emojis_area_display: false,
            send_button_disabled: false,
        };
        this.handle_name_change = this.handle_name_change.bind(this);
        this.hangle_pw_change = this.hangle_pw_change.bind(this);
        this.handle_text_area_change = this.handle_text_area_change.bind(this);
        this.toggle_emojis_area = this.toggle_emojis_area.bind(this);
        this.insert_at_cursor = this.insert_at_cursor.bind(this);
        this.send = this.send.bind(this);
        this.text_area_ref = React.createRef();
    }

    handle_name_change(event: React.FormEvent<HTMLInputElement>) {
        this.setState({ name: event.currentTarget.value });
        this.need_update_preview = true;
    }

    hangle_pw_change(event: React.FormEvent<HTMLInputElement>) {
        this.setState({ pw: event.currentTarget.value });
    }

    handle_text_area_change(event: React.ChangeEvent<HTMLTextAreaElement>) {
        this.setState({ text_area: event.currentTarget.value });
        this.need_update_preview = true;
    }

    toggle_emojis_area() {
        this.setState({ emojis_area_display: !this.state.emojis_area_display });
    }

    insert_at_cursor(event: React.MouseEvent<HTMLSpanElement>) {
        const s = event.currentTarget.innerHTML;
        const text_area = this.text_area_ref.current;
        if (text_area === null) {
            return;
        }

        // https://stackoverflow.com/questions/11076975/insert-text-into-textarea-at-cursor-position-javascript
        if ((text_area.selectionStart || text_area.selectionStart === 0)) {
            const startPos = text_area.selectionStart;
            const endPos = text_area.selectionEnd;
            this.setState({
                text_area: text_area.value.substring(0, startPos)
                    + s
                    + text_area.value.substring(endPos, text_area.value.length)
            }, () => {
                const cursorPos = startPos + s.length;
                text_area.selectionStart = cursorPos;
                text_area.selectionEnd = cursorPos;
            });
        } else {
            this.setState({ text_area: text_area.value + s });
        }

        this.need_update_preview = true;
    }

    normal_msg(s: string): void {
        this.setState({ msg_console: s, msg_console_classname: '' });
    }

    error_msg(s: string): void {
        this.setState({ msg_console: s, msg_console_classname: 'kkoment-alert' });
    }

    refresh_comments(): void {
        const http_request = get_http_request({
            succeeded: (response_text: string) => {
                this.props.thread_php_succeed(response_text);
                this.normal_msg('');
            },
            failed: () => this.error_msg('꼬멘트 읽기 실패'),
            waiting: () => this.normal_msg('꼬멘트 읽는 중...'),
        });
        http_request.open('GET', this.props.thread_php);
        http_request.send();
    }

    send() {
        const name = this.state.name;
        const pw = this.state.pw;
        const text = this.state.text_area;

        if (name === '') {
            this.error_msg('이름이 비었습니다.');
            return
        }

        if (pw === '') {
            this.error_msg('비밀번호가 비었습니다.');
            return
        }

        if (text === '') {
            this.error_msg('댓글이 비었습니다.');
            return
        }

        this.setState({ send_button_disabled: true });

        const params = new FormData();
        params.append('domain_id', this.props.domain_id);
        params.append('thread_id', this.props.thread_id);
        params.append('name', name);
        params.append('pw', pw);
        params.append('text', text);

        const comment_php = kkoment_url;
        const http_request = get_http_request({
            succeeded: (_response_text: string) => {
                this.setState({
                    text_area: '',
                    preview: '',
                    send_button_disabled: false,
                });
                this.refresh_comments();
            },
            failed: () => {
                this.error_msg('전송 실패');
                this.setState({ send_button_disabled: false });
            },
            waiting: () => this.normal_msg('전송 중...'),
        });
        http_request.open('POST', comment_php);
        http_request.send(params);
    }

    componentDidMount() {
        (async () => {
            while (true) {
                if (this.need_update_preview) {
                    this.need_update_preview = false;
                    this.setState({
                        preview: this.state.text_area === ''
                            ? ''
                            : kkmarkdown.trans(this.state.text_area)
                    });
                }
                await timer(1000);
            }
        })();
    }

    componentWillUnmount() {
    }

    render() {
        const name = <p>
            <input type='text'
                placeholder='이름'
                className='kkoment-input'
                value={this.state.name}
                onChange={this.handle_name_change}
            />
            {' '}
            <input type='password'
                placeholder='비밀번호'
                className='kkoment-input'
                value={this.state.pw}
                onChange={this.hangle_pw_change}
            />
        </p>;

        const text_area = <TextareaAutosize placeholder='마크다운 문법으로 댓글을 써 봅니다.'
            className='kkoment-text-area'
            value={this.state.text_area}
            onChange={this.handle_text_area_change}
            minRows={2}
            ref={this.text_area_ref}
        />;

        const preview = this.state.preview !== '' && <div className='kkoment-preview'>
            <Comment comment={{
                state: CommentState.New,
                name: this.state.name,
                text: this.state.preview,
                time: new Date(),
            }}
                characters={[]}
                short_name_hash={true}
                toggle_short_name_hash={() => { }}
            />
        </div>;

        const buttons = <p>
            <button className='kkoment-button kkoment-emoji-button'
                dangerouslySetInnerHTML={{ __html: '&#x1F353;' }}
                onClick={this.toggle_emojis_area} />
            {' '}
            <button className='kkoment-button'
                onClick={this.send}
                disabled={this.state.send_button_disabled}>
                전송
            </button>
            {' '}
            <span className={this.state.msg_console_classname}>{this.state.msg_console}</span>
        </p>;

        const emojis = this.state.emojis_area_display && <div className='kkoment-emojis-area'>
            {this.props.emojis.map((emoji) => {
                return <span>
                    <span dangerouslySetInnerHTML={{ __html: `&#x${emoji};` }}
                        onClick={this.insert_at_cursor}
                    />
                    {' '}
                </span>
            })}
        </div>;

        return <div>
            {name}
            {text_area}
            {preview}
            {buttons}
            {emojis}
        </div>;
    }
}

class Notice extends React.Component {
    render() {
        return <p style={{ fontSize: 'small' }}>
            &#x26A0; 비밀번호는 글쓴이를 구분하는 용도로만 사용합니다.<br />
            &#x26A0; 댓글은 <a href='https://kkeundotnet.github.io/kkmarkdown/kkmarkdown/syntax.html'>다소 제한된 마크다운 문법</a>으로 쓸 수 있습니다.
        </p>;
    }
}

type load_props = { domain_id: string, thread_id: string }

type load_state = {
    loading_msg: string | null,
    initialized: boolean,
    comments: CommentRead[],
}

class Load extends React.Component<load_props, load_state> {
    characters = get_emojis([
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

    emojis = get_emojis([
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
    ]).concat(this.characters);

    thread_php: string;

    constructor(props: load_props) {
        super(props);
        this.state = { loading_msg: null, initialized: false, comments: [] };
        this.thread_php_succeed = this.thread_php_succeed.bind(this);
        const domain_id_bind = `domain_id=${encodeURI(props.domain_id)}`;
        const thread_id_bind = `thread_id=${encodeURI(props.thread_id)}`;
        this.thread_php = `${kkoment_url}?${domain_id_bind}&${thread_id_bind}`;
    }

    thread_php_succeed(response_text: string) {
        const comments = JSON.parse(response_text);
        for (const comment of comments) {
            comment.state = CommentState.Read;
        }
        this.setState({
            loading_msg: comments.length === 0 ? '아직 댓글이 없습니다.' : null,
            comments: comments,
            initialized: true,
        });
    }

    componentDidMount() {
        const http_request = get_http_request({
            succeeded: (response_text) => this.thread_php_succeed(response_text),
            failed: () => this.setState({ loading_msg: '꼬멘트 읽기 실패' }),
            waiting: () => this.setState({ loading_msg: '꼬멘트 읽는 중...' }),
        });
        http_request.open('GET', this.thread_php);
        http_request.send();
    }

    componentWillUnmount() { }

    render() {
        return <div>
            {this.state.loading_msg !== null && <p>{this.state.loading_msg}</p>}
            <CommentsBody comments={this.state.comments} characters={this.characters} />
            {this.state.initialized && <InputForm
                domain_id={this.props.domain_id}
                thread_id={this.props.thread_id}
                emojis={this.emojis}
                thread_php={this.thread_php}
                thread_php_succeed={this.thread_php_succeed}
            />}
            {this.state.initialized && <Notice />}
        </div>;
    }
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

export function load(
    div_id: string,
    domain_id: string,
    thread_id: string,
): void {
    const div = document.getElementById(div_id);
    if (!div) {
        alert(`꼬멘트: ${div_id}를 못 찾았습니다.`);
        return;
    }
    if (domain_id === '') {
        alert(`꼬멘트: domain_id가 비었습니다.`);
        return;
    }
    if (thread_id === '') {
        alert(`꼬멘트: thread_id가 비었습니다.`);
        return;
    }

    load_css();
    ReactDOM.render(<Load domain_id={domain_id} thread_id={thread_id} />, div);
}

type kkoment_num = {
    'n': number,
    'recent': boolean,
}

export function load_n(
    domain_id: string,
    num_cb = (num: kkoment_num) => num['n'].toString(),
    full_cb = () => { },
): void {
    function render(nums: { [key: string]: kkoment_num | undefined }) {
        const kkoment_nums = document.getElementsByClassName('kkoment-num');
        for (let i = 0; i < kkoment_nums.length; i++) {
            const kkoment_num = kkoment_nums[i];
            if (kkoment_num instanceof HTMLElement && kkoment_num.dataset.kkomentThreadId) {
                let num = nums[kkoment_num.dataset.kkomentThreadId];
                if (!num) {
                    num = { 'n': 0, 'recent': false };
                }
                kkoment_num.innerHTML = num_cb(num);
            }
        }
    }

    const http_request = get_http_request({
        succeeded: (response_text: string) => {
            render(JSON.parse(response_text));
            full_cb();
        },
        failed: () => { },
        waiting: () => { },
    });
    http_request.open('GET', `${kkoment_url}?domain_id=${encodeURI(domain_id)}&only_num=1`);
    http_request.send();
}

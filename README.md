꼬멘트
======

Disqus에서 [내 글이 자꾸 스팸 처리](https://blog.kkeun.net/computer/2018-01-24-spam-of-disqus) 되어
답답해서 울면서 만든 댓글 시스템.

![대화](/example4.png)

특징
------

### &#x1F46A; 로그인 없음

누구나 글을 쓸 수 있다.  로그인이 없다.  이름과 비밀번호를 넣기는 하는데 이것들은 댓글 쓴 익명의
사람들을 구분하는 용도로만 쓰인다.

### &#x1F361; 트리 아님

답글들은 리스트다.  트리가 아니다.

### &#x1F514; RSS

지원한다.

### &#x1F515; 이메일 알림 없음

없다.

### &#x2795; 마크다운 지원

마크다운으로 글을 쓸 수 있고, 이모지도 편하게 넣을 수 있다.  마크다운은 자체 제작 엔진
[Kkmarkdown](https://github.com/kkeundotnet/kkmarkdown)을 사용한다.

### &#x23F3; Proof-of-work (&#x1F6A7; 보류)

스팸과 쓰는 사람이 없어 보류한다.

### &#x1F480; 미지원 기능들

* 코멘트 수정/삭제
* 관리자 페이지, import, export 등등

사용법
------

자신의 서버에 직접 설치하려면 [INSTALL.md](INSTALL.md)을 참고하라.

### HTML 헤더에서 자바스크립트를 읽고,

```html
<script src="https://kkeun.net/kkmarkdown.js"></script>
<script src="https://kkoment.kkeun.net/kkoment.js"></script>
```

### HTML 바디에서 꼬멘트를 읽고.

```html
<div id="kkoment-div"></div>
<script>kkoment.load("kkoment-div", "my.domain.id", "my-thread-id");</script>
```

```typescript
kkoment.load(
    div_id: string,
    domain_id: string,
    thread_id: string,
): void
```

* `div_id`: 댓글이 들어갈 div의 id
* `domain_id`: 도메인 이름
* `thread_id`: 쓰레드 이름.  페이지 별로 구분되도록 사용자가 정한다.  단, RSS 이용자는 아래를
  참고하라.

### 댓글 개수

```html
<span class="kkoment-num" data-kkoment-thread-id="hello"></span>
<span class="kkoment-num" data-kkoment-thread-id="bye"></span>
...
<script>kkoment.load_n("kkoment.kkeun.net")</script>
```

```typescript
kkoment.load_n: (
    domain_id: string,
    num_cb?: (num: { "n": number, "recent": boolean }) => string,
    full_cb?: () => void,
) => void
```

*   `domain_id`: 도메인 이름

*   (선택) `num_cb`: 표현 형식용 콜백

    *   `(num: { "n": number, "recent": boolean }) => string`
    *   `n`: 댓글 개수
    *   `recent`: 최근 1주일 댓글 유무

*   (선택) `full_cb`: `kkoment.load_n` 종료 시 불릴 콜백

    *   `() => void`

예) 최근 댓글이 있으면 "recently replied"를, 댓글이 없으면 "no reply"를, 그렇지 않으면 "\[n\]"을
출력

```javascript
kkoment.load_n("kkoment.kkeun.net", function(num){
    if (num["recent"]) {
        return "recently replied";
    } else if(num["n"] === 0) {
        return "no reply";
    } else {
        return `[${num["n"]}]`;
    }
});
```

### RSS

```
https://kkoment.kkeun.net/feed.xml?domain_id=<domain_id>
```

예를 들어 도메인이 `blog.kkeun.net`이라면 RSS 주소는
`https://kkoment.kkeun.net/feed.xml?domain_id=blog.kkeun.net`이 된다.

RSS에 포함되는 주소는 도메인 이름(`<domain_id>`)과 쓰레드 이름(`<thread_id>`)으로 정해진다.

* 채널 주소: `https://<domain_id>/`
* 아이템 주소: `https://<domain_id>/<thread_id>`

단, `thread_id`가 `http://`나 `https://`로 시작하는 URL인 경우 `thread_id`가 아이템 주소로 사용된다.

라이선스
------

이 프로그램은 퍼블릭 도메인으로 공개한다.

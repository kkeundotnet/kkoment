꼬멘트
======

Disqus에서 [내 글이 자꾸 스팸 처리](https://blog.kkeun.net/computer/2018-01-24-spam-of-disqus) 되어
답답해서 울면서 만든 댓글 시스템.

![대화](/example3.png)

특징
------

### &#x1F46A; 로그인 없음

누구나 글을 쓸 수 있다.  로그인이 없다.  이름과 비밀번호를 넣기는 하는데 이것들은 댓글 쓴 익명의
사람들을 구분하는 용도로만 쓰인다.

### &#x1F361; 트리 아님

답글들은 단순한 리스트다.  트리가 아니다.  답글에 답글을 달 수 없다.  그런 종류의 답글을 지원하는
페이지가 많이 있지만 (페이스북, 레딧) 난 답글에 답글을 읽으면서 편안함을 느낀지 못했다.  아까 읽었던
게 뭐였는지 쉽게 까먹기 때문.

### &#x1F514; RSS 지원

업데이트된 꼬멘트를 알리는 RSS를 지원한다.

### &#x1F515; 이메일 알림 없음

메일 알림 기능만 없어도 스팸 걱정이 준다.  게시판에 스팸이 쌓이는 건 나에겐 작은 문제이지만 그게
메일로 날아와 메일함에 쌓이는 건 크고 성가신 문제가 될 수 있다.

### &#x2795; 마크다운 지원

마크다운으로 글을 쓸 수 있고, 이모지도 쉽게 글에 넣을 수 있다.  마크다운 엔진은
[Kkmarkdown](https://github.com/kkeundotnet/kkmarkdown)을 사용한다.  따라서 몇몇 마크다운 문법은 쓸
수가 없다.

### &#x23F3; Proof-of-work (&#x1F6A7; 보류)

스팸에 작게 나마 대항하기 위해 [Proof-of-work](https://en.wikipedia.org/wiki/Proof-of-work_system)에
기반해서 댓글 등록 비용을 조금 높이려 한다.  채굴을 시키는 것도 염두에 두고 있기는 한데
[Coinhive의 부작용](https://blog.malwarebytes.com/security-world/2017/10/why-is-malwarebytes-blocking-coinhive/)을
보니 고민이 조금 된다.

일단 보류 상태.  스팸이 얼마나 활발한지 먼저 보자.

*업데이트(2019/1/27) 스팸이 전혀 없다.  쓰는 사람이 나밖에 없으니 당연한 결과.*

### &#x1F480; 미지원 기능들

다음 기능은 제공되지 않고 있다.  (요청이 생기면 추후에 추가될지도)

* 코멘트 수정/삭제
* 관리자 페이지, import, export 등등

난 이대로도 충분히 좋다.  적어도 내가 댓글을 달면 댓글이 달린다.

사용법
------

자신의 서버에 직접 설치해서 사용할 분은 [INSTALL.md](INSTALL.md) 참고.

### HTML 헤더에서 자바스크립트를 읽어 오고,

```html
<script src="https://cdn.rawgit.com/jackmoore/autosize/4.0.2/dist/autosize.min.js"></script>
<script src="https://kkeun.net/kkmarkdown.js"></script>
<script src="https://kkoment.kkeun.net/kkoment.js"></script>
```

### HTML 바디에서 꼬멘트를 읽어 오면 끝.

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

아이디가 `kkoment-div`인 div에 댓글을 넣는다.

*   `div_id`: 댓글이 들어갈 div의 id

*   `domain_id`: 도메인 이름 (예, "blog.kkeun.net")

*   `thread_id`: 쓰레드 이름.  페이지 별로 구분되도록 사용자 마음대로 정하면 됨.  (단, RSS 이용자는
    아래를 참고)

### 댓글 개수를 읽어 올 수도 있고,

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

클래스가 `kkoment-num`인 span을 찾아 댓글 개수를 넣는다.

*   `domain_id`: 도메인 이름

*   (optional) `num_cb`: 표현 형식 변경용 콜백

    *   `(num: { "n": number, "recent": boolean }) => string`
    *   `n`: 댓글 개수
    *   `recent`: 최근 1주일 댓글 유무

*   (optional) `full_cb`: `kkoment.load_n` 종료 시 불릴 콜백

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

### RSS를 읽어 올 수도 있음.

```
https://kkoment.kkeun.net/feed.xml?domain_id=<domain_id>
```

예를 들어 도메인이 `blog.kkeun.net`이라면 RSS 주소는
`https://kkoment.kkeun.net/feed.xml?domain_id=blog.kkeun.net`이 된다.

RSS 안에 적힐 주소는 도메인 이름(`<domain_id>`)과 쓰레드 이름(`<thread_id>`)에 의해 정해진다.

* 채널 주소: `https://<domain_id>/`
* 아이템 주소: `https://<domain_id>/<thread_id>`

단, `thread_id`가 `http://`나 `https://`로 시작하는 URL인 경우 `thread_id`가 아이템 주소로 사용된다.

마무리
------

꼬멘트는 다음 외부 라이브러리들을 사용하고 있다.  감사합니다.  Thank you!

* [Autosize](http://www.jacklmoore.com/autosize/) by Jack Moore

내 블로그에 답글을 달아 주며 꿈과 용기를 준 [조상우](https://sangwoo-joh.github.io/) 님, Bloofer
님께도 감사를 드립니다.

라이선스
------

이 프로그램은 퍼블릭 도메인으로 공개됩니다.

직접 설치 방법
===

## PHP

버전 7.4

```
$ sudo apt-get install php7.4 php7.4-cli php7.4-common php7.4-fpm php7.4-json php7.4-mbstring \
                       php7.4-opcache php7.4-readline php7.4-sqlite3 php7.4-xml
```

## Typescript

버전 3.6.2

https://www.typescriptlang.org/download

## Dependencies

```
$ composer install
```

`vendor`에 필요한 PHP 라이브러리들이 설치된다.

그리고 [ㄲ마크다운](https://github.com/kkeundotnet/kkmarkdown)도 어딘가에 설치한다.

## 서버 설정

웹서버가 [www/index.php](www/index.php)를 읽도록 설정하자.

추가로 라우팅을 PHP에서 직접 하기 때문에 이를 위한 서버 설정이 필요하다.

*   Apache의 경우 [.htaccess](www/.htaccess)가 그일을 하니까 따로 건드릴 것이 없다.

*   Nginx의 경우, 서버 설정을 다음과 같이 바꾸어 준다.

    ```
    location / {
        try_files $uri /index.php?$args;
    }
    ```

## DB 파일 초기화

```
$ scripts/init_db.sh
```

`_db/kkoment.sqlite3` 파일이 생성된다.

## 자바스크립트 컴파일

```
$ make
```

`client/kkoment.js` 파일이 생성된다.

## `kkoment.json`

[kkoment.example.json](kkoment.example.json)을 참고하여 `kkoment.json` 파일을 생성한다.

*   (필수) url: 꼬멘트 서버로 사용할 도메인 주소.  
    예) `https://kkoment.yourdomain.net`

*   (필수) kkmarkdown.bin: ㄲ마크다운의 실행파일 경로.  
    예) `../kkmarkdown/_build/install/default/bin/kkmarkdown`

*   (필수) kkmarkdown.php: ㄲ마크다운의 PHP파일 경로.  
    예) `../kkmarkdown/php/kkmarkdown.php`,

*   (선택) db: DB 파일 경로.  
    기본값) `_db/kkoment.sqlite3`

*   (선택) vendor/autoload.php: PHP 외부 라이브러리를 읽기위한 `autoload.php` 경로.  
    기본값) `vendor/autoload.php`

이걸로 서버 설정은 끝이다.  [README.md](README.md)를 참고하여 자신의 블로그에서 꼬멘트를 사용해 보자!

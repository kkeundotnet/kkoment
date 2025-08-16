꼬멘트 직접 설치 방법
===

## PHP 설치

```
$ sudo apt install php{,-{cli,common,mbstring,opcache,readline,sqlite3,xml}}
```

## PHP 라이브러리 설치

```
$ cd server
server$ composer install
```

## ㄲ마크다운 설치

[ㄲ마크다운](https://github.com/kkeundotnet/kkmarkdown)도 어딘가에 받아 컴파일한다.

## 웹서버 설정

웹서버가 [www/index.php](www/index.php)를 읽도록 설정하자.

추가로 라우팅을 PHP에서 직접 하기 때문에 이를 위한 서버 설정이 필요하다.

*   Apache의 경우 [.htaccess](www/.htaccess)가 그 일을 한다.  `.htaccess` 파일을 활성화하기 위해
    `/etc/apache2/apache2.conf`에 적힌 `kkoment/www` 디렉토리 설정에 다음을 추가한다.

    ```
    AllowOverride All
    ```

*   Nginx의 경우, 서버 설정을 다음과 같이 바꾼다.

    ```
    location / {
        try_files $uri /index.php?$args;
    }
    ```

## DB 파일 초기화

```
$ db/init_db
```

## `kkoment.json` 작성

[kkoment.example.json](kkoment.example.json)을 참고하여 `kkoment.json` 파일을 만든다.

*   (필수) url: 꼬멘트 서버로 사용할 도메인 주소  
    예) `https://kkoment.yourdomain.net`

*   (필수) kkmarkdown.bin: ㄲ마크다운의 실행파일 경로  
    예) `../kkmarkdown/_build/install/default/bin/kkmarkdown`

*   (필수) kkmarkdown.php: ㄲ마크다운의 PHP파일 경로  
    예) `../kkmarkdown/php/kkmarkdown.php`,

*   (선택) db: DB 파일 경로  
    기본값) `db/kkoment.sqlite3`

*   (선택) vendor/autoload.php: PHP 라이브러리의 `autoload.php` 경로  
    기본값) `server/vendor/autoload.php`

## 자바스크립트 컴파일

```
$ cd client
client$ npm install
client$ make
```

이걸로 서버 설정은 끝이다.  사용법은 [README.md](README.md)를 참고한다.

<?php
declare(strict_types=1);

use Kkeundotnet\Kkrouter\KkRouter;
use Kkeundotnet\Kkrouter\KkString as KkRouterString;

namespace Kkeundotnet\Kkoment;

switch ($_SERVER['REQUEST_METHOD']) {

case 'GET':
    $router = new KkRouter(function () {
        (new Kkoment404Viewer)->view();
    });

    $router->add(
        [],
        function () {
            $domain_id = KkSafe::at($_GET, 'domain_id');
            $thread_id = KkSafe::at($_GET, 'thread_id');
            $only_num = KkSafe::at($_GET, 'only_num');
            if (is_null($domain_id) && is_null($thread_id)) {
                $viewer = new KkeundotnetMarkdownViewer(__DIR__.'/../kkoment.kkeun.net/index.md');
                $viewer->title = '꼬멘트';

                $viewer->css_list[] = KkExt::HLJS_CSS;

                $viewer->js_list[] = KkExt::AUTOSIZE;
                $viewer->js_list[] = KkExt::HLJS_JS;
                $viewer->js_list[] = KkExt::KKMARKDOWN;
                $viewer->js_list[] = KkExt::KKOMENT;
                $viewer->js_run .= "hljs.initHighlighting();";
                $viewer->js_run .= 'kkoment.load("kkoment-div", "kkoment.kkeun.net", "hello");';

                $viewer->rss_title = $viewer->title;
                $viewer->rss_link = 'https://kkoment.kkeun.net/feed.xml?domain_id=kkoment.kkeun.net';
                $viewer->view();
            } elseif (!is_null($domain_id) && !is_null($thread_id)) {
                header('Access-Control-Allow-Origin: *');
                (new Kkoment($domain_id, $thread_id))->load();
            } elseif (!is_null($domain_id) && $only_num == 1) {
                header('Access-Control-Allow-Origin: *');
                (new Kkoment($domain_id, null))->load_num();
            } else {
                (new Kkoment404Viewer)->view();
            }
        }
    );

    // "hello" is the name of kkoment thread in the page
    $router->add(
        [new KkRouterString('hello')],
        function () {
            header("Location: https://kkoment.kkeun.net/");
        }
    );

    $router->add(
        [new KkRouterString('feed.xml')],
        function () {
            $domain_id = KkSafe::at($_GET, 'domain_id');
            if (!is_null($domain_id)) {
                header('Access-Control-Allow-Origin: *');
                (new KkomentRssViewer($domain_id))->view();
            } else {
                (new Kkoment404Viewer)->view();
            }
        }
    );

    $router->run(KkSafe::at($_SERVER, 'REDIRECT_URL') ?? '');
    break;

case 'POST':
    $domain_id = KkSafe::at($_POST, 'domain_id');
    $thread_id = KkSafe::at($_POST, 'thread_id');
    $name = KkSafe::at($_POST, 'name');
    $pw = KkSafe::at($_POST, 'pw');
    $text = KkSafe::at($_POST, 'text');

    header('Access-Control-Allow-Origin: *');
    (new Kkoment($domain_id, $thread_id))->add($name, $pw, $text);
    break;

default:
    (new Kkoment404Viewer)->view();
    break;
}

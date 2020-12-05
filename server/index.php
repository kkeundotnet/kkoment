<?php
declare(strict_types=1);

namespace Kkeundotnet\Kkoment;

require_once(__DIR__.'/KkAutoload.php');

use Kkeundotnet\Kkrouter\KkRouter;
use Kkeundotnet\Kkrouter\KkString as KkRouterString;

switch ($_SERVER['REQUEST_METHOD']) {

case 'GET':
    $router = new KkRouter(function () {
        Kkoment404::die('Routing failed');
    });

    $router->add(
        [],
        function () {
            $domain_id = KkomentUtil::get_field_exn($_GET, 'domain_id');
            $thread_id = KkomentUtil::get_field_nullable($_GET, 'thread_id');
            $only_num = KkomentUtil::get_field_nullable($_GET, 'only_num');
            if (!is_null($thread_id)) {
                header('Access-Control-Allow-Origin: *');
                (new Kkoment($domain_id, $thread_id))->load();
            } elseif ($only_num == 1) {
                header('Access-Control-Allow-Origin: *');
                (new Kkoment($domain_id, null))->load_num();
            } else {
                Kkoment404::die('Either thread_id or only_num should be given');
            }
        }
    );

    $router->add(
        [new KkRouterString('feed.xml')],
        function () {
            $domain_id = KkomentUtil::get_field_exn($_GET, 'domain_id');
            header('Access-Control-Allow-Origin: *');
            (new KkomentRssViewer($domain_id))->view();
        }
    );

    $router->run(KkomentUtil::get_field_nullable($_SERVER, 'REDIRECT_URL') ?? '');
    break;

case 'POST':
    $domain_id = KkomentUtil::get_field_exn($_POST, 'domain_id');
    $thread_id = KkomentUtil::get_field_exn($_POST, 'thread_id');
    $name = KkomentUtil::get_field_exn($_POST, 'name');
    $pw = KkomentUtil::get_field_exn($_POST, 'pw');
    $text = KkomentUtil::get_field_exn($_POST, 'text');

    header('Access-Control-Allow-Origin: *');
    (new Kkoment($domain_id, $thread_id))->add($name, $pw, $text);
    break;

default:
    Kkoment404::die("Unknown request method: {$_SERVER['REQUEST_METHOD']}");
    break;
}

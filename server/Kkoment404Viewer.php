<?php
declare(strict_types=1);

use Kkeundotnet\Kkrouter\KkRouter;
use Kkeundotnet\Kkrouter\KkString as KkRouterString;

namespace Kkeundotnet\Kkoment;

class Kkoment404Viewer {
    public function view() : void
    {
        http_response_code(404);
        echo '<h1>404 Not Found</h1>';
        die();
    }
}

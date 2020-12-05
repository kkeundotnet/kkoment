<?php
declare(strict_types=1);

namespace Kkeundotnet\Kkoment;

class Kkoment404 {
    public static function die(string $log) : void
    {
        error_log($log);
        http_response_code(404);
        echo '<h1>404 Not Found</h1>';
        die();
    }
}

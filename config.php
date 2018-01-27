<?php
define("DB_FILE", '_db/kkoment.db');

function set_access_control($url) {
    if (preg_match('/\*/', $url) == 0) {
        header("Access-Control-Allow-Origin: ".$url);
        return true;
    }
    header("HTTP/1.0 404 Not Found");
    return false;
}

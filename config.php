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

function safe_array_lookup(&$target, $key, $array) {
    if (array_key_exists($key, $array)) {
        $target = $array[$key];
    } else {
        $target = null;
    }
}

function safe_array_lookup_must(&$target, $key, $array) {
    if (array_key_exists($key, $array)) {
        $target = $array[$key];
    } else {
        header("HTTP/1.0 404 Not Found");
        die();
    }
}

function safe_request(&$target, $key) {
    safe_array_lookup($target, $key, $_REQUEST);
}

function safe_request_must(&$target, $key) {
    safe_array_lookup_must($target, $key, $_REQUEST);
}

function safe_session(&$target, $key) {
    safe_array_lookup($target, $key, $_SESSION);
}

function safe_session_must(&$target, $key) {
    safe_array_lookup_must($target, $key, $_SESSION);
}

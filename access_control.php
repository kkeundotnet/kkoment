<?php
function set_access_control($url) {
    $pattern = '';
    if(preg_match('/\*/', $url) == 0) {
        header("Access-Control-Allow-Origin: ".$url);
        return true;
    }
    return false;
}

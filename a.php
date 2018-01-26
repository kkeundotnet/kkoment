<?php
require_once('access_control.php');

// TODO: return 400 for all php(and json)
if(!set_access_control($_REQUEST['url'])) {
    echo "0";
    die();
}

$url = $_REQUEST['url'];
$thread_id = $_REQUEST['thread_id'];
$only_num = $_REQUEST['only_num'];

$db = new SQLite3('_db/all.db');

function incr_all($thread_id, &$all) {
    if(array_key_exists($thread_id, $all)) {
        $all[$thread_id] += 1;
    } else {
        $all[$thread_id] = 1;
    }
};

if($only_num) {
    $stmt = $db->prepare('SELECT id, thread_id FROM comments WHERE url=:url');
    $stmt->bindParam(':url', $url);
    $result = $stmt->execute();

    $all = array();
    while($row = $result->fetchArray()) {
        incr_all($row['thread_id'], $all);
    }
    echo (json_encode($all));
} else {
    $stmt = $db->prepare(
        'SELECT id, name, time, hashed, text, removed FROM comments
         WHERE url=:url AND thread_id=:thread_id');
    $stmt->bindParam(':url', $url);
    $stmt->bindParam(':thread_id', $thread_id);
    $result = $stmt->execute();

    $all = array();
    while($row = $result->fetchArray()) {
        if($row['removed']) {
            $row['text'] = "<p style=\"color:red;\">관리자에 의해 삭제된 메세지입니다.</p>";
        }
        array_push($all, $row);
    }
    echo (json_encode($all));
}

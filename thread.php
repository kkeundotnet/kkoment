<?php
require_once('config.php');

if (!set_access_control($_REQUEST['url'])) {
    die();
}

$url = $_REQUEST['url'];
$thread_id = $_REQUEST['thread_id'];
$only_num = $_REQUEST['only_num'];

$db = new SQLite3(DB_FILE);

function incr_counts($thread_id, &$counts) {
    if (array_key_exists($thread_id, $counts)) {
        $counts[$thread_id] += 1;
    } else {
        $counts[$thread_id] = 1;
    }
};

if ($only_num) {
    $stmt = $db->prepare('SELECT id, thread_id FROM comments WHERE url=:url');
    $stmt->bindParam(':url', $url);
    $result = $stmt->execute();

    $counts = array();
    while ($row = $result->fetchArray()) {
        incr_counts($row['thread_id'], $counts);
    }
    echo (json_encode($counts));
} else {
    $removed_msg = "<p style=\"color:red;\">관리자에 의해 삭제된 메세지입니다.</p>";
    $stmt = $db->prepare(
        'SELECT id, name, time, hashed, text, removed FROM comments
         WHERE url=:url AND thread_id=:thread_id');
    $stmt->bindParam(':url', $url);
    $stmt->bindParam(':thread_id', $thread_id);
    $result = $stmt->execute();

    $all = array();
    while ($row = $result->fetchArray()) {
        if ($row['removed']) {
            $row['text'] = $removed_msg;
        }
        array_push($all, $row);
    }
    echo (json_encode($all));
}

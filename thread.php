<?php
require_once('config.php');

safe_request_must($url, 'url');

if (!set_access_control($url)) {
    die();
}

$db = new SQLite3(DB_FILE);
$one_week_before = strtotime("-1 week");

function is_recent($time) {
    global $one_week_before;
    return strtotime($time) > $one_week_before;
}

function incr_counts($thread_id, $time, &$counts) {
    if (array_key_exists($thread_id, $counts)) {
        $counts[$thread_id]["n"] += 1;
    } else {
        $counts[$thread_id] = array("n" => 1, "recent" => false);
    }
    if (is_recent($time)) {
        $counts[$thread_id]["recent"] = true;
    }
};

safe_request($only_num, 'only_num');
if ($only_num) {
    $stmt = $db->prepare('SELECT id, thread_id, time FROM comments WHERE url=:url');
    $stmt->bindParam(':url', $url);
    $result = $stmt->execute();

    $counts = array();
    while ($row = $result->fetchArray()) {
        incr_counts($row['thread_id'], $row['time'], $counts);
    }
    echo (json_encode($counts));
} else {
    safe_request_must($thread_id, 'thread_id');
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

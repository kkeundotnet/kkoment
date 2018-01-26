<?php
require_once('access_control.php');

if(!set_access_control($_REQUEST['url'])) {
    echo "0";
    die();
}

// TODO: remove after implementing proof-of-work
sleep(2);

$url = $_REQUEST['url'];
$thread_id = $_REQUEST['thread_id'];

// get data
$db = new SQLite3('_db/all');
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

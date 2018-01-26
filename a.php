<?php
header("Access-Control-Allow-Origin: ".$_REQUEST['url']);

// TODO: remove after implementing proof-of-work
sleep(2);

$url = $_REQUEST['url'];
$thread_id = $_REQUEST['thread_id'];

// get data
$db = new SQLite3('_db/all');
$stmt = $db->prepare(
'SELECT id, name, time, hashed, text FROM comments
 WHERE url=:url AND thread_id=:thread_id');
$stmt->bindParam(':url', $url);
$stmt->bindParam(':thread_id', $thread_id);
$result = $stmt->execute();

$all = array();
while($row = $result->fetchArray()) {
    array_push($all, $row);
}
echo (json_encode($all));

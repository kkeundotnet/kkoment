<?php
sleep(2);                       // TODO remove

$url = $_REQUEST['url'];
$thread_id = $_REQUEST['thread_id'];
$name = $_REQUEST['name'];
$time = $_REQUEST['time'];
$pw = $_REQUEST['pw'];
$hashed = hash("sha256", $name.$pw);
$text = $_REQUEST['text'];

// TODO proof-of-work check
// TODO text validity check

// add data
$db = new SQLite3('_db/all');
$stmt = $db->prepare(
'INSERT INTO comments (url, thread_id, name, time, hashed, text)
 VALUES (:url, :thread_id, :name, :time, :hashed, :text)');
$stmt->bindParam(':url', $url);
$stmt->bindParam(':thread_id', $thread_id);
$stmt->bindParam(':name', $name);
$stmt->bindParam(':time', $time);
$stmt->bindParam(':hashed', $hashed);
$stmt->bindParam(':text', $text);
$result = $stmt->execute();

if($result) {
    echo "1";
} else {
    echo "0";
}

<?php
$url = $_REQUEST['url'];
$thread_id = $_REQUEST['thread_id'];
$name = $_REQUEST['name'];
$time = $_REQUEST['time'];
$hashed = $_REQUEST['hashed'];
$text = $_REQUEST['text'];

// TODO hash check

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

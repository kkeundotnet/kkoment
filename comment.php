<?php
require_once('access_control.php');
require_once('simple_html_dom.php');

if(!set_access_control($_REQUEST['url'])) {
    die();
}

function is_safe_html($md) {
    $html = str_get_html($md);

    $block_tags = array('script', 'iframe', 'frame', 'img');
    foreach ($block_tags as $block_tag) {
        if(count($html->find($block_tag)) != 0) {
            return false;
        }
    }

    return true;
}

$url = $_REQUEST['url'];
$thread_id = $_REQUEST['thread_id'];
$name = $_REQUEST['name'];
$time = $_REQUEST['time'];
$pw = $_REQUEST['pw'];
$hashed = hash("sha256", $name.$pw);
$text = $_REQUEST['text'];

// TODO: check proof-of-work

if(empty($url) || empty($thread_id) || empty($name) || empty($time) ||
   empty($pw) || empty($text)) {
    header("HTTP/1.0 404 Not Found");
    die();
}

if(!is_safe_html($text)) {
    header("HTTP/1.0 404 Not Found");
    die();
}

// check duplication
$db = new SQLite3('_db/kkoment.db');
$stmt = $db->prepare(
'SELECT id FROM comments
 WHERE url=:url AND thread_id=:thread_id AND hashed=:hashed AND time=:time
 AND text=:text');
$stmt->bindParam(':url', $url);
$stmt->bindParam(':thread_id', $thread_id);
$stmt->bindParam(':hashed', $hashed);
$stmt->bindParam(':time', $time);
$stmt->bindParam(':text', $text);
$result = $stmt->execute();
if($result->fetchArray()) {
    header("HTTP/1.0 404 Not Found");
    die();
}

// add data
$db = new SQLite3('_db/kkoment.db');
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

if(!$result) {
    header("HTTP/1.0 404 Not Found");
    die();
}

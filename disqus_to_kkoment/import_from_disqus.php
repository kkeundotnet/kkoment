<?php

$disqus_file="disqus_exported.xml";
$url="https://your.domain.net";
$pw="defualt_pw";
$db_file = "../_db/kkoment.db";

function convert_removed($s) {
    if ($s == "true") {
        return 1;
    } else {
        return 0;
    }
}

$disqus_xml = simplexml_load_file($disqus_file) or die("Error: Cannot create object");

$disqus_id_map = array();
$posts = array();
$threads_num = 0;
$posts_num = 0;
foreach ($disqus_xml as $key => $value) {
    if ($key == "thread") {
        $thread_id_num = (string) $disqus_xml->thread[$threads_num]->attributes()->dsqid;
        $thread_id_string = (string) $value->id;
        $disqus_id_map[$thread_id_num] = $thread_id_string;
        $threads_num++;
    } else if ($key == "post") {
        $thread_id_num = (string) $value->thread->attributes()->dsqid;
        $name = (string) $value->author->name;
        $post = array(
            "thread_id" => $disqus_id_map[$thread_id_num],
            "name" => $name,
            "time" => (string) $value->createdAt,
            "hashed" => hash("sha256", $name . $pw),
            "text" => (string) $value->message,
            "removed" => convert_removed((string) $value->isDeleted)
        );
        array_push($posts, $post);
    }
}

$db = new SQLite3($db_file);
foreach ($posts as $post) {
    if ($post["removed"]) {
        continue;
    }

    $stmt = $db->prepare(
        'INSERT INTO comments (url, thread_id, name, time, hashed, text)
         VALUES (:url, :thread_id, :name, :time, :hashed, :text)');
    $stmt->bindParam(':url', $url);
    $stmt->bindParam(':thread_id', $post["thread_id"]);
    $stmt->bindParam(':name', $post["name"]);
    $stmt->bindParam(':time', $post["time"]);
    $stmt->bindParam(':hashed', $post["hashed"]);
    $stmt->bindParam(':text', $post["text"]);
    $stmt->execute();
}

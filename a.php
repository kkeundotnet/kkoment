<?php
header("Access-Control-Allow-Origin: ".$_REQUEST['url']);

// TODO: remove
sleep(2);

echo $_REQUEST['url'];
echo "&emsp;";
echo $_REQUEST['thread_id'];

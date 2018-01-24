<?php
function include_header()
{ ?>
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="stylesheet" href="a.css">
<script src="https://cdn.jsdelivr.net/npm/iframe-resizer@3.5.16/js/iframeResizer.contentWindow.min.js"></script>
</head>
<body>
<?php }

function include_footer()
{ ?>
</body>
</html>
<?php }

// main start

// TODO: remove
sleep(2);

include_header();
?>

<?php
echo $_REQUEST['url'];
echo "<br>";
echo $_REQUEST['thread_id'];
?>

<?php
include_footer();

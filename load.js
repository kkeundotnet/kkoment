function kkoment_load(div_id, url, thread_id) {
    var src = "https://kkoment.kkeun.net/a.php"
            + "?url=" + encodeURI(url)
            + "&thread_id=" + encodeURI(thread_id);
    var loading_msg_id = div_id+"-loading-msg";
    var iframe_id = div_id+"-iframe";

    var div = document.getElementById(div_id);
    div.style.margin="16px 0px";

    var loading_msg = document.createElement('p');
    loading_msg.id = loading_msg_id;
    loading_msg.innerText = "loading kkoments...";
    div.appendChild(loading_msg);

    var iframe = document.createElement('iframe');
    iframe.src = src;
    iframe.id = iframe_id;
    iframe.style.width = "100%";
    iframe.style.display = "none";
    iframe.style.border = "0";
    iframe.scrolling = "no";
    div.appendChild(iframe);
    iFrameResize({}, '#'+iframe_id);

    iframe.onload = function() {
        loading_msg.style.display = "none";
        iframe.style.display = "";
    };
}

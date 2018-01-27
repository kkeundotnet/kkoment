Importing comments from Disqus
======

(Note that it currently works only if you are running your own server
and install kkoment to the server.)

1.  Export comment data (an xml file) from
    [http://disqus.com/admin/discussions/export/](http://disqus.com/admin/discussions/export/).

2.  Change attribute names in the xml.  This is just because the php
    module we use to parse xmls seems not to understand the colon
    character (`:`) in attribute names.

    `$ sed -i -e 's/dsq:id/dsqid/g' disqus.xml`

3.  Configure some data and paths in `import_from_disqus.php`.  Open
    the file with an editor you want.

    * `$discus_file`: the Disqus xml file name.

    * `$url`: the domain name in which the kkoment will be placed.

    * `$pw`: an arbitrary string, which will be used when adding the
      previous comments.

    * `$db_file`: the DB file of kkoment system.  Note that the DB
      file should exist in advance, then `import_from_disqus.php` will
      add Disqus comments to it.

4.  Run the php file.

    `$ php import_from_disqus.php`

    **troubleshooting**: If you have a problem on running the php file
    with a message that says "`simplexml_load_file` is unknown", try
    the commands in
    [stackoverflow Q](https://stackoverflow.com/questions/31206186/call-to-undefined-function-simplexml-load-string).

Good luck!

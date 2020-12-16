<?php
declare(strict_types=1);

namespace Kkeundotnet\Kkoment;

require_once(__DIR__.'/KkomentAutoload.php');

use Kkeundotnet\Kkrss\KkItem as KkRssItem;
use Kkeundotnet\Kkrss\KkViewer as KkRssViewer;

class KkomentRssViewer extends KkRssViewer
{
    private string $domain_id;

    public function __construct($domain_id)
    {
        $this->domain_id = $domain_id;
        $this->title = "꼬멘트 - {$domain_id}";
        $this->link = "https://{$domain_id}/";
        $this->description = "{$this->title}의 지난 주 댓글";
        $this->is_perma_link_guid = false;
        $this->init_items();
    }

    private function item_of(array $row) : KkRssItem
    {
        $id = $row['id'];
        $name = '<p>'.htmlspecialchars($row['name']).'</p>';
        $text = $row['text'];
        $thread_id = $row['thread_id'];
        $time = $row['time'];
        return new KkRssItem(
            "{$this->domain_id}/{$thread_id}의 꼬멘트 ({$id} 번째)",
            "https://{$this->domain_id}/{$thread_id}",
            "{$name}<br>{$text}",
            "{$this->domain_id}/{$thread_id}/{$id}",
            strtotime($time)
        );
    }

    private function init_items() : void
    {
        global $kkoment_config;
        $db = KkomentUtil::get_db($kkoment_config->db_path);
        $stmt = $db->prepare(<<<'SQL'
            SELECT id, name, text, thread_id, time
            FROM comments
            WHERE domain_id = :domain_id AND removed = 0
            SQL);
        $stmt->bindParam(':domain_id', $this->domain_id);
        $result = $stmt->execute();

        $this->items = [];
        while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
            if (KkomentUtil::is_recent($row['time'])) {
                $this->items[] = $this->item_of($row);
            }
        }
        $stmt->close();
        $db->close();
    }
}

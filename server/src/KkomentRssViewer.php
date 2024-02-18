<?php

declare(strict_types=1);

namespace Kkeundotnet\Kkoment;

require_once(__DIR__.'/KkomentAutoload.php');

use Kkeundotnet\Kkrss\KkItem as KkRssItem;
use Kkeundotnet\Kkrss\KkViewer as KkRssViewer;

class KkomentRssViewer extends KkRssViewer
{
    public function __construct(string $domain_id)
    {
        global $kkoment_config;
        $title = "꼬멘트 - {$domain_id}";
        parent::__construct(
            title: $title,
            link: "https://{$domain_id}/",
            description: "{$title}의 지난 주 댓글",
            is_perma_link_guid: false,
            items: self::init_items($domain_id),
            feed_link: "{$kkoment_config->url}/feed.xml?domain_id={$domain_id}",
        );
    }

    private static function link_of(string $domain_id, string $thread_id): string
    {
        if (KkomentUtil::is_url($thread_id)) {
            return $thread_id;
        }
        $domain_id = trim($domain_id, '/');
        $thread_id = ltrim($thread_id, '/');
        return "https://{$domain_id}/{$thread_id}";
    }

    /**
     * @pararm array{
     *   id: int,
     *   thread_id: string,
     *   name: string,
     *   text: string,
     *   time: string,
     * } $row
     */
    private static function item_of(string $domain_id, array $row): KkRssItem
    {
        $id = $row['id'];
        $name = '<p>'.htmlspecialchars($row['name']).'</p>';
        $text = $row['text'];
        $thread_id = $row['thread_id'];
        $time = $row['time'];
        return new KkRssItem(
            title: "{$thread_id}의 꼬멘트 ({$id} 번째)",
            link: self::link_of($domain_id, $thread_id),
            html_description: "{$name}<br>{$text}",
            guid: "{$domain_id}/{$thread_id}/{$id}",
            pub_time: strtotime($time),
        );
    }

    /** @return KkRssItem[] */
    private static function init_items(string $domain_id): array
    {
        global $kkoment_config;
        $db = KkomentUtil::get_db($kkoment_config->db_path);
        $stmt = $db->prepare(<<<'SQL'
            SELECT id, name, text, thread_id, time
            FROM comments
            WHERE domain_id = :domain_id AND removed = 0
            SQL);
        $stmt->bindParam(':domain_id', $domain_id);
        $result = $stmt->execute();

        $items = [];
        while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
            if (KkomentUtil::is_recent($row['time'])) {
                $items[] = self::item_of($domain_id, $row);
            }
        }
        $stmt->close();
        $db->close();

        return $items;
    }
}

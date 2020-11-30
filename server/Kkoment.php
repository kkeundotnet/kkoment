<?php
declare(strict_types=1);

namespace Kkeundotnet\Kkoment;

class Kkoment
{
    private string $domain_id;
    private ?string $thread_id;
    private int $one_week_before;

    public function __construct(string $domain_id, ?string $thread_id)
    {
        $this->domain_id = $domain_id;
        $this->thread_id = $thread_id;
        $this->one_week_before = strtotime("-1 week");
    }

    public function load() : void
    {
        $db = new SQLite3(KkomentUtil::DB_FILE);
        $stmt = $db->prepare(<<<'SQL'
            SELECT id, name, name_hash, text, time, removed
            FROM comments
            WHERE domain_id = :domain_id AND thread_id = :thread_id
            SQL);
        $stmt->bindParam(':domain_id', $this->domain_id);
        $stmt->bindParam(':thread_id', $this->thread_id);
        $result = $stmt->execute();

        $removed_msg = "<p class=\"kkoment-alert\">관리자에 의해 삭제된 메세지입니다.</p>";
        $all = [];
        while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
            if ($row['removed']) {
                $row['text'] = $removed_msg;
            }
            $all[] = $row;
        }

        echo(json_encode($all));
    }

    private static function incr_counts(string $thread_id, string $time, array &$counts) : void
    {
        if (array_key_exists($thread_id, $counts)) {
            $counts[$thread_id]["n"] += 1;
        } else {
            $counts[$thread_id] = ["n" => 1, "recent" => false];
        }
        if (KkomentUtil::is_recent($time)) {
            $counts[$thread_id]["recent"] = true;
        }
    }

    public function load_num() : void
    {
        $db = new SQLite3(KkomentUtil::DB_FILE);
        $stmt = $db->prepare(<<<'SQL'
            SELECT id, thread_id, time
            FROM comments
            WHERE domain_id = :domain_id
            SQL);
        $stmt->bindParam(':domain_id', $this->domain_id);
        $result = $stmt->execute();

        $counts = [];
        while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
            self::incr_counts($row['thread_id'], $row['time'], $counts);
        }
        echo(json_encode($counts));
    }

    private function gen_new_salt(int $length = 100) : string
    {
        $chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $chars_leng = strlen($chars);
        $salt = '';
        for ($i = 0; $i < $length; $i++) {
            $salt .= $chars[rand(0, $chars_leng - 1)];
        }
        return $salt;
    }

    private function get_salt(SQLite3 $db, string $name) : string
    {
        $stmt = $db->prepare('SELECT salt FROM salts WHERE name = :name');
        $stmt->bindParam(':name', $name);
        $result = $stmt->execute();
        if ($row = $result->fetchArray(SQLITE3_ASSOC)) {
            $salt = $row['salt'];
        } else {
            $salt = $this->gen_new_salt();
            $stmt = $db->prepare('INSERT INTO salts (name, salt) VALUES (:name, :salt)');
            $stmt->bindParam(':name', $name);
            $stmt->bindParam(':salt', $salt);
            $result = $stmt->execute();
            if (!$result) {
                (new Kkoment404Viewer)->view();
            }
        }
        return $salt;
    }

    public function add(string $name, string $pw, string $text) : void
    {
        $text = (new Kkmarkdown)->transform($text);
        $time = date(DATE_ATOM, time());

        $db = new SQLite3(KkomentUtil::DB_FILE);

        $salt = $this->get_salt($db, $name);
        $name_hash = hash("sha256", $salt.$name.$pw);

        // check duplication
        $stmt = $db->prepare(<<<'SQL'
            SELECT id
            FROM comments
            WHERE domain_id = :domain_id AND thread_id = :thread_id AND name_hash = :name_hash
              AND text = :text AND time = :time
            SQL);
        $stmt->bindParam(':domain_id', $this->domain_id);
        $stmt->bindParam(':thread_id', $this->thread_id);
        $stmt->bindParam(':name_hash', $name_hash);
        $stmt->bindParam(':text', $text);
        $stmt->bindParam(':time', $time);
        $result = $stmt->execute();
        if ($result->fetchArray(SQLITE3_ASSOC)) {
            (new Kkoment404Viewer)->view();
        }
        
        // insert data
        $stmt = $db->prepare(<<<'SQL'
            INSERT INTO comments (domain_id, thread_id, name, name_hash, text, time, removed)
            VALUES (:domain_id, :thread_id, :name, :name_hash, :text, :time, :removed)
            SQL);
        $removed = 0;
        $stmt->bindParam(':domain_id', $this->domain_id);
        $stmt->bindParam(':thread_id', $this->thread_id);
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':name_hash', $name_hash);
        $stmt->bindParam(':text', $text);
        $stmt->bindParam(':time', $time);
        $stmt->bindParam(':removed', $removed);
        $result = $stmt->execute();
        if (!$result) {
            (new Kkoment404Viewer)->view();
        }
    }
}

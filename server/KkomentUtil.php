<?php
declare(strict_types=1);

namespace Kkeundotnet\Kkoment;

class KkomentUtil
{
    // TODO read db file path from kkoment.json
    const DB_FILE = __DIR__.'/../kkoment_db/kkoment.sqlite3';

    public static function is_recent(string $time) : bool
    {
        return strtotime('-1 week') <= strtotime($time);
    }
}

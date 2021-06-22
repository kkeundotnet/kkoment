<?php
declare(strict_types=1);

namespace Kkeundotnet\Kkoment;

class KkomentUtil
{
    /* Set it as true for debugging temporarily */
    const DEBUG = false;

    public static function assert_file_exists(string $path) : void
    {
        if (!file_exists($path)) {
            self::die404("File not found: {$path}");
        }
    }

    public static function die404_quiet() : void
    {
        http_response_code(404);
        echo('<h1>404 Not Found</h1>');
        die();
    }

    public static function die404(string $log) : void
    {
        error_log($log);
        self::die404_quiet();
    }

    public static function file_get_contents_exn(string $path) : string
    {
        self::assert_file_exists($path);
        return file_get_contents($path);
    }

    public static function get_db(string $db_path) : \SQLite3
    {
        $db = new \SQLite3($db_path);
        /* NOTE: While this may help to avoid db failure, there is no guarantee. */
        $db->busyTimeout(1000);
        return $db;
    }

    private static function get_field_common(array $arr, string $key, callable $callback)
    {
        if (!array_key_exists($key, $arr)) {
            return $callback();
        }
        return $arr[$key];
    }

    public static function get_field_nullable(array $arr, string $key)
    {
        return self::get_field_common($arr, $key, function () {
            return null;
        });
    }

    public static function get_field_exn(array $arr, string $key, $default=null)
    {
        return self::get_field_common($arr, $key, function () use ($default, $key) {
            if (is_null($default)) {
                if (self::DEBUG) {
                    self::die404("Field not found: {$key}");
                } else {
                    self::die404_quiet();
                }
            }
            return $default;
        });
    }

    public static function echo_json(array $arr)
    {
        header('Content-Type: application/json');
        echo(json_encode($arr));
    }

    public static function is_prefix(string $s, string $prefix) : bool
    {
        $prefix_len = strlen($prefix);
        return strlen($s) >= $prefix_len && substr($s, 0, $prefix_len) === $prefix;
    }

    public static function is_recent(string $time) : bool
    {
        return strtotime('-1 week') <= strtotime($time);
    }

    public static function is_url(string $s) : bool
    {
        return self::is_prefix($s, 'http://') || self::is_prefix($s, 'https://');
    }

    public static function make_absolute_path(string $base, string $path) : string
    {
        if (strlen($path) >= 1 && $path[0] === '/') {
            return $path;
        } else {
            return "{$base}/{$path}";
        }
    }
}

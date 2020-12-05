<?php
declare(strict_types=1);

namespace Kkeundotnet\Kkoment;

require_once(__DIR__.'/Kkoment404.php');

class KkomentConfig {
    public string $db_path;
    public string $kkmarkdown_path;
    public string $vendor_autoload_path;

    private static function make_absolute_path(string $base, string $path) : string {
        if (strlen($path) >= 1 && $path[0] == '/') {
            return $path;
        } else {
            return "{$base}/{$path}";
        }
    }

    private static function assert_file_exists(string $path) : void {
        if (!file_exists($path)) {
            Kkoment404::die("File not found: {$path}");
        }
    }

    private static function file_get_contents(string $path) : string {
        self::assert_file_exists($path);
        return file_get_contents($path);
    }

    private static function get_field(array $config, string $key, $default=null) {
        if (!array_key_exists($key, $config)) {
            if (is_null($default)) {
                Kkoment404::die("Field not found in config: {$key}");
            } else {
                return $default;
            }
        }
        return $config[$key];
    }

    private static function get_field_path(array $config, string $key, ?string $default=null) : string {
        $path = self::get_field($config, $key, $default);
        $path = self::make_absolute_path(__DIR__.'/..', $path);
        self::assert_file_exists($path);
        return $path;
    }

    private static function is_prefix(string $s, string $prefix) : bool {
        $prefix_len = strlen($prefix);
        return strlen($s) >= $prefix_len && substr($s, 0, $prefix_len) == $prefix;
    }

    private static function is_url(string $s) : bool {
        return self::is_prefix($s, 'http://') || self::is_prefix($s, 'https://');
    }

    public function __construct() {
        $json = self::file_get_contents(__DIR__.'/../kkoment.json');
        $config = json_decode($json, true);
        
        $this->kkmarkdown_path = self::get_field_path($config, 'kkmarkdown');
        $this->db_path = self::get_field_path($config, 'db', '_db/kkoment.sqlite3');
        $this->vendor_autoload_path = self::get_field_path($config, 'vendor/autoload.php', 'vendor/autoload.php');
    }
}

$kkoment_config = new KkomentConfig;

<?php
declare(strict_types=1);

namespace Kkeundotnet\Kkoment;

require_once(__DIR__.'/KkomentUtil.php');

class KkomentConfig
{
    public string $db_path;
    public string $kkmarkdown_bin_path;
    public string $kkmarkdown_php_path;
    public string $vendor_autoload_path;

    private static function get_field_path(array $config, string $key, ?string $default=null) : string
    {
        $path = KkomentUtil::get_field_exn($config, $key, $default);
        $path = KkomentUtil::make_absolute_path(__DIR__.'/..', $path);
        KkomentUtil::assert_file_exists($path);
        return $path;
    }

    public function __construct()
    {
        $json = KkomentUtil::file_get_contents_exn(__DIR__.'/../kkoment.json');
        $config = json_decode($json, true);
        
        /* Paths to kkmarkdown MUST be given in the config. */
        $this->kkmarkdown_bin_path = self::get_field_path($config, 'kkmarkdown.bin');
        $this->kkmarkdown_php_path = self::get_field_path($config, 'kkmarkdown.php');

        /* Paths to the DB file and composer's autoload.php may be given in the config. */
        $this->db_path = self::get_field_path($config, 'db', '_db/kkoment.sqlite3');
        $this->vendor_autoload_path = self::get_field_path($config, 'vendor/autoload.php', 'vendor/autoload.php');
    }
}

$kkoment_config = new KkomentConfig;

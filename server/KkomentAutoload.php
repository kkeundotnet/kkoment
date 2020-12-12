<?php
declare(strict_types=1);

namespace Kkeundotnet\Kkoment;

require_once(__DIR__.'/KkomentConfig.php');
require_once(__DIR__.'/KkomentUtil.php');
require_once($kkoment_config->vendor_autoload_path);

spl_autoload_register(function (string $class_name) : void {
    global $kkoment_config;
    if ($class_name === 'Kkeundotnet\Kkmarkdown\Kkmarkdown') {
        require_once($kkoment_config->kkmarkdown_php_path);
    }

    if (KkomentUtil::is_prefix($class_name, __NAMESPACE__.'\\')) {
        $class_name = substr($class_name, strlen(__NAMESPACE__.'\\'));
        require_once(__DIR__."/{$class_name}.php");
    }
});

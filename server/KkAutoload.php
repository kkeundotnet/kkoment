<?php
declare(strict_types=1);

namespace Kkeundotnet\Kkoment;

require_once(__DIR__.'/KkomentConfig.php');
require_once($kkoment_config->vendor_autoload_path);

spl_autoload_register(function (string $class_name) : void {
    require_once(__DIR__."/{$class_name}.php");
});

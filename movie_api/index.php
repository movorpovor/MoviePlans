<?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: access");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Allow-Credentials: true");
    header('Content-Type: application/json');

    $keys = explode("/", key($_GET));
    switch(array_shift($keys)) {
        case "movie":
            include_once 'controllers/movie_controller.php';
            $mc = new MovieController();
            $mc->route($keys);
        break;
        default:
            echo 'there is no such controller';
        break;
    }
?>
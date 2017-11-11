<?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: access");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Allow-Credentials: true");
    header('Content-Type: application/json; charset= utf-8');

    $keys = explode("/", key($_GET));
    include_once 'config/answer.php';
    $answer = new Answer();

    switch(array_shift($keys)) {
        case "movie":
            include_once 'controllers/movie_controller.php';
            $mc = new MovieController();
            $mc->route($keys, $answer);
        break;
        case "user":
            include_once 'controllers/user_controller.php';
            $uc = new UserController();
            $uc->route($keys, $answer);
        break;
        case "base":
            include_once 'controllers/base_controller.php';
            $bc = new BaseController();
            $bc->route($keys, $answer);
        break;
        default:
            $answer->setError('there is no such controller');
        break;
    }

    print_r(json_encode($answer));
?>
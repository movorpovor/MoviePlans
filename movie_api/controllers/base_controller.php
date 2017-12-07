<?php   
    class BaseController{

        private $db;

        public function __construct(){
            include_once 'config/database.php';
            include_once 'objects/movie.php';
            include_once 'objects/user.php';
            $this->db = new Database();
        }

        private function getInitState($answer){
            $movies = $this->getAllMovies();
            $users = $this->getAllUsers();

            $allInfo = array(
                "movies" => $movies,
                "users" => $users
            );

            $answer->setResponse($allInfo);
        }

        private function getAllUsers(){
            $stmt = $this->db->readAllUsers();

            $num = $stmt->rowCount();
            if ($num>0) {
                $users_arr=array();

                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
                    extract($row);
            
                    $user_item=array(
                        "id" => $id,
                        "nickname" => $nickname
                    );
            
                    array_push($users_arr, $user_item);
                }
            }

            return $users_arr;
        }

        private function getAllMovies(){
            $stmt = $this->db->readAllMovies($_GET['user_id']);
            $num = $stmt->rowCount();
            if ($num>0) {
                include_once('config/dbParser.php');
                $movies_arr = DbParser::parseSingleMovie($stmt);
            }

            return $movies_arr;
        }

        function route($keys, $answer){
            if (count($keys) == 1) {
                switch($keys[0]) {
                    case 'get_init_state':
                        $this->getInitState($answer);
                    break;
                    default:
                        $answer->setError('no such method');
                    break;
                }
            } else {
                $answer->setError('wrong controller');
            }
        }
    }
?>
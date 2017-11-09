<?php
    class MovieController {

        private $db;

        public function __construct(){
            include_once 'config/database.php';
            include_once 'objects/movie.php';
            $this->db = new Database();
        }

        private function createMovie($answer){            
            $movie = new Movie($this->db);
            
            $data = json_decode(file_get_contents("php://input"));
            $movie->name = $data->name;
            $movie->kp_ref = $data->kp_ref;
        
            if($movie->create($data->nickname)){
                $answer->setResponse($movie);
            }
            else{
                $answer->setError('Unable create the movie');
            }
        }

        private function getAll($answer){
            $movie = new Movie($this->db);
            
            $userId = $_GET['user_id'];

            $stmt = $movie->readAll($userId);
            $num = $stmt->rowCount();
            if ($num>0) {
                $movies_arr=array();

                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
                    extract($row);
            
                    $movie_item=array(
                        "id" => $id,
                        "name" => $name,
                        "kp_ref" => $kp_ref
                    );
            
                    array_push($movies_arr, $movie_item);
                }
            
                $answer->setResponse($movies_arr);
            }
            else {
                $answer->setError('No movies found.');
            }
        }

        private function getOne($answer){
            $movie = new Movie($this->db);
            $movie->id = $_GET['id'];
            $movie->readOne();

            $movie_arr = array(
                "id" =>  $movie->id,
                "name" => $movie->name,
                "kp_ref" => $movie->kp_ref,
            );
            
            $answer->setResponse($movie_arr);
        }

        function route($keys, $answer){
            if (count($keys) == 1) {
                switch($keys[0]) {
                    case 'create':
                        $this->createMovie($answer);
                    break;
                    case 'get_all':
                        $this->getAll($answer);
                    break;
                    case 'get_one':
                        $this->getOne($answer);
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
<?php   
    class MovieController {

        private $db;

        public function __construct(){
            include_once 'config/database.php';
            include_once 'objects/movie.php';
            $this->db = new Database();
        }

        private function createMovie($answer){            
            $data = json_decode(file_get_contents("php://input"));

            if (!$this->db->movieExists($data->km_ref, $answer))
            {
                $movie = $this->grabInfoFromKM($data->km_ref, $movie);
            
                if($movie->create($data->nickname)){
                    $answer->setResponse($movie);
                }
                else{
                    $answer->setError('Unable create the movie');
                }
            }
        }

        private function updateMovieState($answer){
            $movie = json_decode(file_get_contents("php://input"));
            if ($this->db->updateMovieState($movie))
                $answer->setResponse("movie was updated");
        }

        private function grabInfoFromKM($ref){
            $movie = new Movie($this->db);
            $movie->km_ref = $ref;

            include_once('config/simple_html_dom.php');
            $page = file_get_html($movie->km_ref);
            $movie->cover = $page->find('.image-cover', 0)->src;
            $movie->title = $page->find('.pagetitle', 0)->plaintext;
            $movie->original_title = $page->find('.name__page', 0)->plaintext;
            $movie->description = html_entity_decode($page->find('.list-post-item-content', 0)->plaintext);
            
            return $movie;
        }

        private function get($answer){
            if (array_key_exists('movie_id', $_GET)){
                $this->getOne($answer);
            } else {
                $this->getAll($answer);
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
                        "id" => $movie_id,
                        "title" => $title,
                        "original_title" => $original_title,
                        "km_ref" => $km_ref,
                        "description" => $description,
                        "cover" => $cover,
                        "user_id" => $user_id,
                        "state_id" => $state_id
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
            $movie->id = $_GET['movie_id'];
            $movie->readOne();

            $movie_arr = array(
                "id" =>  $movie->id,
                "title" => $movie->title,
                "km_ref" => $movie->km_ref
            );

            $answer->setResponse($movie_arr);
        }

        function route($keys, $answer){
            if (count($keys) == 1) {
                switch($keys[0]) {
                    case 'create':
                        $this->createMovie($answer);
                    break;
                    case 'get':
                        $this->get($answer);
                    break;
                    case 'update_state':
                        $this->updateMovieState($answer);
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
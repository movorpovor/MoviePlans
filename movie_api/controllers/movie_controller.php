<?php
    class MovieController {

        private $db;

        public function __construct(){
            include_once 'config/database.php';
            include_once 'objects/movie.php';
            $this->db = new Database();
        }

        private function createMovie(){            
            $movie = new Movie($this->db);
            
            // get posted data
            $data = json_decode(file_get_contents("php://input"));
            // set movie property values
            $movie->name = $data->name;
            $movie->kp_ref = $data->kp_ref;
        
            // create the movie
            if($movie->create()){
                echo '{';
                    echo '"ok": "true",';
                    // make it json format
                    echo '"movie": ';
                    echo json_encode($movie);
                echo '}';
            }
            // if unable to create the movie, tell the user
            else{
                echo '{';
                    echo '"ok": "false"';
                echo '}';
            }
        }

        private function getAll(){
            $movie = new Movie($this->db);
            
            $stmt = $movie->readAll();
            $num = $stmt->rowCount();
            if ($num>0) {
                $movies_arr=array();
                $movies_arr["records"]=array();

                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
                    extract($row);
            
                    $movie_item=array(
                        "id" => $id,
                        "name" => $name,
                        "kp_ref" => $kp_ref
                    );
            
                    array_push($movies_arr["records"], $movie_item);
                }
            
                echo json_encode($movies_arr);
            }
            else {
                echo json_encode(
                    array("message" => "No movies found.")
                );
            }
        }

        private function getOne(){
            $movie = new Movie($this->db);
            $movie->id = $_GET['id'];
            $movie->readOne();

            $movie_arr = array(
                "id" =>  $movie->id,
                "name" => $movie->name,
                "kp_ref" => $movie->kp_ref,
            );
            
            print_r(json_encode($movie_arr));
        }

        function route($keys){
            if (count($keys) == 1) {
                switch($keys[0]) {
                    case 'create':
                        $this->createMovie();
                    break;
                    case 'get_all':
                        $this->getAll();
                    break;
                    case 'get_one':
                        $this->getOne();
                    break;
                    default:
                        echo 'no such method';
                    break;
                }
            } else {
                echo 'wrong controller';
            }
        }
    }
?>
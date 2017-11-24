<?php
    class Database{
        private $dbInfo;
        public $conn;

        public function __construct(){
            $this->conn = null;
            include_once 'databaseInfo.php';
            $this->dbInfo = new DatabaseInfo();

            try{
                $this->conn = new PDO("mysql:host=" . $this->dbInfo->host . ";dbname=" . $this->dbInfo->db_name, 
                    $this->dbInfo->username, 
                    $this->dbInfo->password);
                $this->conn->exec("set names utf8");
            } catch(PDOException $exception) {
                echo "Connection error: " . $exception->getMessage();
            }
        }

        //movies
        public function createMovie($movie, $nickname){
            $query = "
                INSERT INTO movies
                SET
                    title=:title, original_title=:original_title, km_ref=:km_ref, description=:description, cover=:cover";
            
            $stmt = $this->conn->prepare($query);

            $stmt->bindParam(":title", $movie->title);
            $stmt->bindParam(":original_title", $movie->original_title);
            $stmt->bindParam(":km_ref", $movie->km_ref);
            $stmt->bindParam(":description", $movie->description);
            $stmt->bindParam(":cover", $movie->cover);
            
            if ($stmt->execute()) {
                $movie->id=$this->conn->lastInsertId();
                $movie->user_id = $this->getUserId($nickname);
                $this->setState($movie->id, 1);
                $this->registerOffer($movie->id, $movie->user_id);
                return true;
            } else {
                return false;
            }
        }

        public function updateMovieState($movie){
            $query = "
                UPDATE movie_state
                SET
                    state_id=:state_id
                WHERE
                    movie_id=:movie_id";
        
            $stmt = $this->conn->prepare($query);

            $stmt->bindParam(":state_id", $movie->state_id);
            $stmt->bindParam(":movie_id", $movie->movie_id);
            
            if ($stmt->execute()) {
                return true;
            } else {
                return false;
            }
        }

        public function movieExists($km_ref, $answer){
            $query = "
                SELECT id
                FROM movies
                WHERE km_ref=:km_ref";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":km_ref", $km_ref);
            $stmt->execute();

            if ($stmt->rowCount() == 0)
                return false;
            else
            {
                $answer->setError('Movie already exists');
                $answer->message = $stmt->fetch(PDO::FETCH_ASSOC);
                return true;
            }
        }

        private function registerOffer($movieId, $userId){
            $query = "
                INSERT INTO offers
                SET
                    movie_id=:movie, user_id=:user";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":movie", $movieId);
            $stmt->bindParam(":user", $userId);

            if ($stmt->execute()) {
                return true;
            } else {
                return false;
            }
        }

        private function setState($movieId, $stateId){
            $query = "
                INSERT INTO movie_state
                SET
                    movie_id=:movie, state_id=:state";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":movie", $movieId);
            $stmt->bindParam(":state", $stateId);

            if ($stmt->execute()) {
                return true;
            } else {
                return false;
            }
        }

        public function readAllMovies($userId){
            $query = "
                SELECT
                    offerInfo.title,
                    offerInfo.original_title,
                    offerInfo.km_ref,
                    offerInfo.user_id,
                    offerInfo.description,
                    offerInfo.cover,
                    offerInfo.movie_id,
                    movie_state.state_id
                FROM
                (
                    SELECT
                        movies.title,
                        movies.original_title,
                        movies.km_ref,
                        movies.description,
                        movies.cover,
                        movies.id AS movie_id,
                        offers.user_id
                    FROM
                        movies
                    LEFT JOIN offers ON movies.id = offers.movie_id
                ) AS offerInfo
                LEFT JOIN movie_state ON offerInfo.movie_id = movie_state.movie_id ";
            
            if ($userId != null)
            {
                $query = $query . "WHERE offerInfo.user_id = ?";
                $stmt = $this->conn->prepare($query);
                $stmt->bindParam(1, $userId);
            }
            else
                $stmt = $this->conn->prepare($query);
                
            $stmt->execute();
            return $stmt;
        }

        public function readOneMovie($id){
            $query = "
                SELECT 
                    movies.id, 
                    movies.title,
                    movies.original_title, 
                    movies.description,
                    movies.cover,
                    movies.km_ref,
                    users.id as user_id
                FROM movies LEFT JOIN offers ON movies.id = offers.movie_id
                WHERE
                    movies.id = ?";
    
            $stmt = $this->conn->prepare( $query );
            $stmt->bindParam(1, $id);
            $stmt->execute();
            
            return $stmt->fetch(PDO::FETCH_ASSOC);
        }

        //users
        public function readAllUsers(){
            $query = "
                SELECT *
                FROM users";
            
            $stmt = $this->conn->prepare($query);
            $stmt->execute();

            return $stmt;
        }

        public function getUserId($nickname){
            $query = "
                SELECT id
                FROM users
                WHERE nickname=?";
        
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(1, $nickname);
            $stmt->execute();

            return $stmt->fetch(PDO::FETCH_ASSOC)['id'];
        }
    }
?>
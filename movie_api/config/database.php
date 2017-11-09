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
                    name=:name, kp_ref=:kp_ref";
            
            $stmt = $this->conn->prepare($query);

            $stmt->bindParam(":name", $movie->name);
            $stmt->bindParam(":kp_ref", $movie->kp_ref);
            if ($stmt->execute()) {
                $movie->id=$this->conn->lastInsertId();
                $user_id = $this->getUserId($nickname);
                $this->setState($movie->id, 1);
                $this->registerOffer($movie->id, $user_id);
                return true;
            } else {
                return false;
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
                    offerInfo.name,
                    offerInfo.kp_ref,
                    offerInfo.user_id,
                    movie_state.state_id
                FROM
                (
                    SELECT
                        movies.name,
                        movies.kp_ref,
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
                SELECT *
                FROM movies
                WHERE
                    id = ?";
    
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
<?php
    class Database{
        private $dbInfo;
        public $conn;

        public function __construct(){
            $this->conn = null;
            include_once 'databaseInfo.php';
            $this->dbInfo = new DatabaseInfo();

            try{
                $this->conn = new PDO("mysql:host=" . $this->dbInfo->host . ";dbname=" . $this->dbInfo->db_name, $this->dbInfo->username, $this->dbInfo->password);
                $this->conn->exec("set names utf8");
            } catch(PDOException $exception) {
                echo "Connection error: " . $exception->getMessage();
            }
        }

        public function createMovie($movie){
            $query = "
                INSERT INTO movies
                SET
                    name=:name, kp_ref=:kp_ref";
            
            $stmt = $this->conn->prepare($query);

            $stmt->bindParam(":name", $movie->name);
            $stmt->bindParam(":kp_ref", $movie->kp_ref);

            if ($stmt->execute()) {
                $movie->id=$this->conn->lastInsertId();
                $this->setState($movie->id, 1);
                $this->registerOffer($movie->id, 1);
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

        public function readAllMovies(){
            $query = "
                SELECT *
                FROM movies";
            
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
    }
?>
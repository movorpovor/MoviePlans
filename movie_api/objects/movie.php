<?php
    class Movie {
        private $conn;
        private $table_name = "movies";

        public $id;
        public $title;
        public $original_title;
        public $km_ref;
        public $description;
        public $cover;
        public $user_id;

        public function __construct($db) {
            $this->conn = $db;
        }

        // read movies
        function readAll($userId){ 
            return $this->conn->readAllMovies($userId);
        }

        function create($nickname) {                        
            return $this->conn->createMovie($this, $nickname);
        }

        function readOne(){
            $row = $this->conn->readOneMovie($this->id);            
            $this->title = $row['title'];
            $this->km_ref = $row['km_ref'];
        }
    }
?>
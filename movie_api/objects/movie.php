<?php
    class Movie {
        private $conn;
        private $table_name = "movies";

        public $id;
        public $name;
        public $kp_ref;

        public function __construct($db) {
            $this->conn = $db;
        }

        // read movies
        function readAll(){ 
            return $this->conn->readAllMovies();
        }

        function create() {            
            $this->name=htmlspecialchars(strip_tags($this->name));
            $this->kp_ref=htmlspecialchars(strip_tags($this->kp_ref));
            return $this->conn->createMovie($this);
        }

        function readOne(){
            $row = $this->conn->readOneMovie($this->id);            
            $this->name = $row['name'];
            $this->kp_ref = $row['kp_ref'];
        }
    }
?>
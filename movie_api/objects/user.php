<?php
    class User {
        private $conn;
        private $table_name = "users";

        public $id;
        public $nickname;

        public function __construct($db) {
            $this->conn = $db;
        }

        function readAll(){ 
            return $this->conn->readAllUsers();
        }
    }
?>
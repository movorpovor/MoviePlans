<?php
    class UserController {
        public function __construct(){
            include_once 'config/database.php';
            include_once 'objects/user.php';
            $this->db = new Database();
        }

        private function getAll(){
            $user = new User($this->db);
            
            $stmt = $user->readAll();
            $num = $stmt->rowCount();
            if ($num>0) {
                $users_arr=array();
                $users_arr["records"]=array();

                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
                    extract($row);
            
                    $user_item=array(
                        "id" => $id,
                        "nickname" => $nickname
                    );
            
                    array_push($users_arr["records"], $user_item);
                }
            
                echo json_encode($users_arr);
            }
            else {
                echo json_encode(
                    array("message" => "No users found.")
                );
            }
        }

        function route($keys){
            if (count($keys) == 1) {
                switch($keys[0]) {

                    case 'get_all':
                        $this->getAll();
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
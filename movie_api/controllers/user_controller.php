<?php
    class UserController {
        public function __construct(){
            include_once 'config/database.php';
            include_once 'objects/user.php';
            $this->db = new Database();
        }

        private function getAll($answer){
            $user = new User($this->db);
            
            $stmt = $user->readAll();
            $num = $stmt->rowCount();
            if ($num>0) {
                $users_arr=array();

                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
                    extract($row);
            
                    $user_item=array(
                        "id" => $id,
                        "nickname" => $nickname
                    );
            
                    array_push($users_arr, $user_item);
                }
            
                $answer->setResponse($users_arr);
            }
            else {
                $answer->setError("No users found.");
            }
        }

        function route($keys, $answer){
            if (count($keys) == 1) {
                switch($keys[0]) {

                    case 'get_all':
                        $this->getAll($answer);
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
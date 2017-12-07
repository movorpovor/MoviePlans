<?php
    class DbParser{
        public static function parseSingleMovie($stmt) {
            $movies_arr = array();
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

            return $movies_arr;
        }
    }
?>
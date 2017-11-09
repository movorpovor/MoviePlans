<?php
    class Answer{
        public function setError($message){
            $this->status = 'error';
            $this->message = $message;
        }

        public function setResponse($response){
            $this->status = 'ok';
            $this->response = json_encode($response);
        }

        public $status;
        public $message;
        public $response;
    }
?>
<?php namespace Controllers;

class NotesController {
    protected $request;

    public function __construct($request) {
        $this->request = $request;
    }

    public function form() {
        return 'derp';
    }
}

<?php
use Planner\Note\Parser;
use Klein\Klein;

require_once 'vendor/autoload.php';

$app = new Klein;

$app->respond('GET', '/', function($request, $response, $service) {
    $service->render('app/Views/form.php');
});

$app->respond('POST', '/parse', function($request, $response, $service) {
    $Parser = new Parser;
    $notes = $Parser->takeNotes($request->notes, 1);    
    return $notes->toJSON();
});

$app->respond('POST', '/save', function($request, $response, $service) {
    $Parser = new Parser;
    $notes = $Parser->takeNotes($request->notes, 1);    
    file_put_contents('storage.json', $notes->toJSON());
});

$app->dispatch();

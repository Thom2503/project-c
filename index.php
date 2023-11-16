<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
// headers voor CORS zodat we het ook kunnen benaderen via react
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Content-Type: application/json');

spl_autoload_register(function($class) {
	include __DIR__.'/api/'.$class.'.php';
});

require_once 'util_functions.php';
require_once 'api/Router.php';

// router class om de routing te regelen
$router = new Router();

/*{ Accoutns Routing }*/
$router->get('/accounts', 'AccountsController@index');
$router->get('/accounts/{integer}', 'AccountsController@show');
$router->get('/accounts/{string}', 'AccountsController@showEmail');

$router->get('/rooms', 'RoomsController@index');
// TODO: implementeer deze, dit moet dan ook in Router.php gebeuren
/* router->post('/accounts', 'UserController@store'); */
/* $router->put('/accounts/{id}', 'UserController@update'); */
/* $router->delete('/accounts/{id}', 'UserController@destroy'); */
/*{ Agenda Routing }*/
$router->get('/agendaitems', 'AgendaController@index');
$router->get('/agendaitems/{integer}', 'AgendaController@show');
$router->post('/agendaitems', 'AgendaController@store');
/*{ Supplies Routing }*/
$router->get('/supplies', 'SupplyController@index');
$router->get('/supplies/{integer}', 'SupplyController@show');
$router->post('/supplies', 'SupplyController@store');
$router->put('/supplies/{integer}', 'SupplyController@update');
$router->delete('/supplies/{integer}', 'SupplyController@destroy');
/*{ Notifications }*/
$router->get('/notifications', 'NotificationController@index');
$router->get('/notifications/{integer}', 'NotificationController@show');
$router->post('/mailnotification', "NotificationController@sendMailToUser");
$router->post('/notifications', "NotificationController@store");

$router->dispatch(); // Handle the request

?>
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

/*{ Accounts Routing }*/
$router->get('/accounts', 'AccountsController@index');
$router->get('/accounts/{integer}', 'AccountsController@show');
$router->get('/accounts/{string}', 'AccountsController@showEmail');
$router->post('/accounts', 'AccountsController@store');
$router->post('/accounts/{string}', 'AccountsController@verify');
$router->put('/accounts/{integer}/{string}', 'AccountsController@update');
$router->delete('/accounts/{integer}/{string}', 'AccountsController@destroy');

/*{ Agenda Routing }*/
$router->get('/agendaitems', 'AgendaController@index');
$router->get('/agendaitems/{integer}', 'AgendaController@show');
$router->get('/useritems/{integer}', 'AgendaController@showUser');
$router->get('/useritems/{integer}/{integer}/{integer}', 'AgendaController@showUserBeginEnd');
$router->post('/agendaitems', 'AgendaController@store');
$router->put('/agendaitems/{integer}', 'AgendaController@update');
$router->delete('/agendaitems/{integer}', 'AgendaController@destroy');
/*{ Supplies Routing }*/
$router->get('/supplies', 'SupplyController@index');
$router->get('/supplies/{integer}', 'SupplyController@show');
$router->post('/supplies', 'SupplyController@store');
$router->put('/supplies/{integer}', 'SupplyController@update');
$router->delete('/supplies/{integer}', 'SupplyController@destroy');
$router->get('/usersupplies/{integer}', 'SupplyController@showUser');
$router->get('/usersupplies/{string}', 'SupplyController@showDay');
$router->post('/usersupplies', 'SupplyController@setSupplies');
$router->delete('/usersupplies', 'SupplyController@deleteUserSupplies');
/*{ Notifications }*/
$router->get('/usernotifications', 'NotificationController@index');
$router->get('/usernotifications/{integer}', 'NotificationController@show');
$router->post('/mailnotification', "NotificationController@sendMailToUser");
$router->post('/usernotifications', "NotificationController@store");
$router->put('/usernotifications/{integer}', "NotificationController@update");
$router->get('/notifications', 'NotificationController@showNotifications');
$router->post('/notifications', "NotificationController@storeNotification");
/*{ Key routing }*/
$router->get('/keys/{string}', 'KeyController@showKeyCode');
/*{ Rooms }*/
$router->get('/rooms', 'RoomsController@index');
$router->get('/room/{integer}', 'RoomsController@show');
$router->get('/rooms/{integer}', 'RoomsController@showUsers');
$router->get('/rooms/{string}', 'RoomsController@showEvents');
$router->post('/rooms', 'RoomsController@store');
$router->put('/rooms/{integer}', 'RoomsController@update');
$router->delete('/rooms/{integer}', 'RoomsController@destroy');
/*{ News }*/
$router->get('/news', 'NewsController@index');
$router->get('/news/{integer}', 'NewsController@show');
$router->post('/news', 'NewsController@store');
$router->put('/news/{integer}', 'NewsController@update');
$router->delete('/news/{integer}', 'NewsController@destroy');

$router->get('/events', 'EventsController@index');
$router->post('/events', 'EventsController@store');
$router->delete('/eventdelete/{integer}', 'EventsController@destroy');
$router->get('/events/{integer}', 'EventsController@eventById');
// $router->put('/events/{integer}', 'EventsController@update');
$router->get('/eventsusers/{integer}', 'EventsController@showUsers');
$router->get('/eventvoters/{integer}', 'EventsController@showVoters');
$router->post('/eventjoin/{integer}', 'EventsController@joinEvent');
$router->delete('/eventleave/{integer}', 'EventsController@unjoinEvent');
$router->post('/eventvote/{integer}', 'EventsController@voteEvent');
$router->get('/eventcomments/{integer}', 'EventsController@getComments');
$router->post('/eventcomments/{integer}', 'EventsController@addComment');
$router->put('/updateevent/{integer}', 'EventsController@update');
$router->get('/accountevents/{integer}', 'EventsController@getAccountEvents');
$router->put('/accountevents/{integer}', 'EventsController@updateAccountEvents');
$router->get('/confirmed/{integer}', 'EventsController@getConfirmedEvents');
$router->dispatch(); // Handle the request

?>
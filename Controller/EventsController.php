<?php
require_once 'model/Events.php';

class EventsController {
    private Events $eventsModel;

    public function __construct() {
        $this->eventsModel = new Events();
    }

    public function index(): void {
        header('Content-Type: application/json');
        $events = $this->eventsModel->getAllEvents();
        if (count($events) > 0) {
            echo json_encode($events);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'There were no events found']);
        }
    }

    public function show(int $id): void {
        header('Content-Type: application/json');
        $event = $this->eventsModel->getEventByID($id);
        if (count($event) > 0) {
            echo json_encode($event);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Event not found']);
        }
    }

    public function store(): void {
        $data = json_decode(file_get_contents("php://input"), true);
        $eventId = $this->eventsModel->createEvent($data);
        header('Content-Type: application/json');
        echo json_encode(['id' => $eventId]);
    }

    public function joinEvent(): void {
        $data = json_decode(file_get_contents("php://input"), true);
        $accountid = $data['accountid'];
        $eventid = $data['eventid'];
        $eventId = $this->eventsModel->joinEvent($accountid, $eventid);
        header('Content-Type: application/json');
        echo json_encode(['id' => $eventId]);
    }


    public function showUsers(int $id): void {
        header('Content-Type: application/json');
        $users = $this->eventsModel->getUsersInEvent($id);
        if (count($users) > 0) {
            echo json_encode($users);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Users not found in event room with id ' . $id]);
        }
    }
}
?>
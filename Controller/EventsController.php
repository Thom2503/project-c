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

    public function update(): void {
        $data = json_decode(file_get_contents("php://input"), true);
        $this->eventsModel->updateEvent($data);
        header('Content-Type: application/json');
        echo json_encode($this);
    }

    public function getConfirmedEvents(): void {
    
        header('Content-Type: application/json');
        $events = $this->eventsModel->getConfirmedEvents();
        if (count($events) > 0) {
            echo json_encode($events);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'There were no events found']);
        }
    }

    public function updateAccountEvents(): void {
        $data = json_decode(file_get_contents("php://input"), true);
        $this->eventsModel->updateAccountEvents($data);
        header('Content-Type: application/json');
        echo json_encode($this);
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

    public function showVoters(int $id): void {
        header('Content-Type: application/json');
        $users = $this->eventsModel->getVotersInEvent($id);
        if (count($users) > 0) {
            echo json_encode($users);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Voters not found in event room with id ' . $id]);
        }
    }

    public function getAccountEvents(int $id): void {
        header('Content-Type: application/json');
        $events = $this->eventsModel->getAccountEvents($id);

        if (count($events) > 0) {
            echo json_encode($events);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Data not found in event room with id ' . $id]);
        }
    }


    public function destroy(int $id): void {
        $this->eventsModel->deleteEvent($id);
        header('Content-Type: application/json');
        echo json_encode(['id' => $id]);
    }

    public function eventById(int $id): void {
        header('Content-Type: application/json');
        $event = $this->eventsModel->getEventByID($id);
        if (count($event) > 0) {
            echo json_encode($event);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Event not found']);
        }
    }

    public function voteEvent(): void {
        $data = json_decode(file_get_contents("php://input"), true);
        $eventId = $this->eventsModel->voteEvent($data);
        header('Content-Type: application/json');
        echo json_encode(['id' => $eventId]);
    }

    public function resetVote(): void {
        $data = json_decode(file_get_contents("php://input"), true);
        $eventId = $this->eventsModel->resetVote($data);
        header('Content-Type: application/json');
        echo json_encode(['id' => $eventId]);
    }

    public function unjoinEvent(): void {
        $data = json_decode(file_get_contents("php://input"), true);

        if (isset($data['accountid']) && isset($data['eventid'])) {
            $accountid = $data['accountid'];
            $eventid = $data['eventid'];
            $eventId = $this->eventsModel->unjoinEvent($accountid, $eventid);
            header('Content-Type: application/json');
            echo json_encode(['id' => $eventId]);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'accountid and eventid are required']);
        }

    }

    public function addComment(): void {
        $data = json_decode(file_get_contents("php://input"), true);
        $eventId = $this->eventsModel->createComment($data);
        header('Content-Type: application/json');
        echo json_encode(['id' => $eventId]);
    }

    public function getComments(int $id): void {
        $data = json_decode(file_get_contents("php://input"), true);
        $eventId = $this->eventsModel->returnComments($id);
        header('Content-Type: application/json');
        echo json_encode($eventId);
    }


}
?>
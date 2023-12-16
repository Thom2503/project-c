<?php
require_once 'model/Rooms.php';

class RoomsController {
    private Rooms $roomsModel;

    public function __construct() {
        $this->roomsModel = new Rooms();
    }

    public function index(): void {
        header('Content-Type: application/json');
        $rooms = $this->roomsModel->getAllRooms();
        if (count($rooms) > 0) {
            echo json_encode($rooms);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'There were no rooms found']);
        }
    }

    public function show(int $id): void {
        header('Content-Type: application/json');
        $room = $this->roomsModel->getRoomByID($id);
        if (count($room) > 0) {
            echo json_encode($room);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'user not found']);
        }
    }

	public function showUsers(int $id): void {
		header('Content-Type: application/json');
		$users = $this->roomsModel->getUsersInRoom($id);
		if (count($users) > 0) {
			echo json_encode($users);
		} else {
			http_response_code(404);
			echo json_encode(['error' => 'Users not found in room']);
		}
	}

	public function showEvents(string $name): void {
		header('Content-Type: application/json');
		$events = $this->roomsModel->getEventsInRoom($name);
		if (count($events) > 0) {
			echo json_encode($events);
		} else {
			http_response_code(404);
			echo json_encode(['error' => 'Events not found in room']);
		}
	}

    public function store(): void {
		$errors = [];
		$data = json_decode(file_get_contents("php://input"), true);
		
        if (!isset($data['Name']) || (isset($data['Name']) && (trim($data['Name']) == "" && $data['Name'] == null))) {
			$errors['Name'] = "Name is either null or empty or doesn't exist";
		}
        if (!isset($data['Capacity']) || (isset($data['Capacity']) && ($data['Capacity'] <= 0 && $data['Capacity'] == null))) {
			$errors['Capacity'] = "Capacity is either null or empty or doesn't exist";
		}

		header('Content-Type: application/json');
		// zijn er errors? stuur die dan terug
		if (count($errors) > 0) {
			echo json_encode($errors);
		} else {
			$roomID = $this->roomsModel->createRoom($data);
			echo json_encode(['id' => $roomID]);
		}
    }

    public function update($id) {
		$errors = [];
        $data = json_decode(file_get_contents("php://input"), true);

		if (!isset($data['Name']) || (isset($data['Name']) && (trim($data['Name']) == "" && $data['Name'] == null))) {
			$errors['Name'] = "Name is either null or empty or doesn't exist";
		}
        if (!isset($data['Capacity']) || (isset($data['Capacity']) && ($data['Capacity'] <= 0 && $data['Capacity'] == null))) {
			$errors['Capacity'] = "Capacity is either null or empty or doesn't exist";
		}

		header('Content-Type: application/json');
		if (count($errors) > 0) {
			echo json_encode($errors);
		} else {
			$success = $this->roomsModel->updateRoom($id, $data);
			if ($success == true) {
				echo json_encode(['success' => true]);
			} else {
				http_response_code(404);
				echo json_encode(['success' => 'false']);
			}
		}
    }

    public function destroy($id) {
        $errors = [];
		$data = json_decode(file_get_contents("php://input"), true);
		if (count($data) <= 0) {
			$errors['data'] = "Data is empty";	
		}

		header('Content-Type: application/json');
		if (count($errors) > 0) {
			echo json_encode($errors);
		} else {
			$success = $this->roomsModel->deleteRoom($id);
			if ($success == true) {
				echo json_encode(['success' => true]);
			} else {
				http_response_code(404);
				echo json_encode(['error' => 'Supply not deleted']);
			}
		}
    }
}

?>

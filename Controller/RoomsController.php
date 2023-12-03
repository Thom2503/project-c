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
}

?>

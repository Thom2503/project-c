<?php
require_once 'model/Notification.php';

class NotificationController {
	private Notification $notification;

	public function __construct() {
		$this->notification = new Notification();
	}
	
	public function index(): void {
		header('Content-Type: application/json');
		$users = $this->notification->getSubscribers();
		echo json_encode($users);
    }

    public function show(int $id): void {
		header('Content-Type: application/json');
		$user = $this->notification->getSubscriberByID($id);
		if ($user != false && count($user) > 0) {
			echo json_encode($user);
		} else {
			http_response_code(404);
			echo json_encode(['error' => 'subscriber not found']);
		}
    }

    public function store() {
        // Implement logic to store a new user
    }

    public function update($id) {
        // Implement logic to update user by ID
    }

    public function destroy($id) {
        // Implement logic to delete user by ID
    }
}

?>


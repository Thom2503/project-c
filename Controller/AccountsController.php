<?php
require_once 'model/Account.php';

class AccountsController {
	private Account $userModel;

	public function __construct() {
		$this->userModel = new Account();
	}
	
	public function index(): void {
		header('Content-Type: application/json');
		$users = $this->userModel->getAllAccounts();
		echo json_encode($users);
    }

    public function show(int $id): void {
		header('Content-Type: application/json');
		$user = $this->userModel->getAccountByID($id);
		if ($user != false && count($user) > 0) {
			echo json_encode($user);
		} else {
			http_response_code(404);
			echo json_encode(['error' => 'user not found']);
		}
    }

	public function showEmail(string $email): void {
		header('Content-Type: application/json');
		$user = $this->userModel->getAccountByEmail($email);
		if (count($user) > 0) {
			echo json_encode($user);
		} else {
			http_response_code(404);
			echo json_encode(['error' => 'user not found']);
		}
	}

    public function store(): void {
		$data = json_decode(file_get_contents("php://input"), true);
        $userID = $this->userModel->createUserAccount($data);
		$password = password_hash($data['Password'], PASSWORD_BCRYPT);
		$data['secure_pass'] = $password;
        header('Content-Type: application/json');
        echo json_encode(['id' => $userID]);
    }

    public function update($id) {
        // Implement logic to update user by ID
    }

    public function destroy($id) {
        // Implement logic to delete user by ID
    }
}

?>


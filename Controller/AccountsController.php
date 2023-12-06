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
		$password = password_hash($data['Password'], PASSWORD_BCRYPT);
		$data['secure_pass'] = $password;
        $userID = $this->userModel->createUserAccount($data);
        header('Content-Type: application/json');
        echo json_encode(['id' => $userID]);
    }

	public function verify(string $email): void {
		$data = json_decode(file_get_contents("php://input"), true);
		$password = null;
		if ($data != null && count($data) > 0) {
			$password = $data['password'];
		}
		header('Content-Type: application/json');
		$user = $this->userModel->getAccountByEmail($email);
		if (count($user) > 0) {
			$verified = false;
			if ($password != null) $verified = password_verify($password, $user['Password']);
			$user['verified'] = $verified;	
			echo json_encode($user);
		} else {
			http_response_code(404);
			echo json_encode(['error' => 'user not found']);
		}
	
	}

    public function update($id) {
        $data = json_decode(file_get_contents("php://input"), true);
        $success = $this->userModel->updateAccount($id, $data);
        header('Content-Type: application/json');
		if ($success == true) {
        	echo json_encode(['success' => true]);
		} else {
			http_response_code(404);
			echo json_encode(['success' => 'false']);
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
			$success = $this->userModel->deleteAccount($id);
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


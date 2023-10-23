<?php
require_once 'model/Supply.php';

class SupplyController {
	private Supply $supplyModel;

	public function __construct() {
		$this->supplyModel = new Account();
	}
	
	public function index(): void {
		header('Content-Type: application/json');
		$supplies = $this->supplyModel->getAllSupplies();
		if (count($supplies) > 0) {
			echo json_encode($supplies);
		} else {
			http_response_code(404);
			echo json_encode(['error' => 'user not found']);
		}
    }

    public function show(int $id): void {
		header('Content-Type: application/json');
		$supply = $this->supplyModel->getSupplyByID($id);
		if (count($supply) > 0) {
			echo json_encode($supply);
		} else {
			http_response_code(404);
			echo json_encode(['error' => 'user not found']);
		}
    }

    public function store(): void {
		$errors = [];
		$data = json_decode(file_get_contents("php://input"), true);
		if (!isset($data['name']) || (isset($data['name']) && (trim($data['name']) == "" && $data['name'] == null))) {
			$errors['name'] = "Name is either null or empty or doesn't exist";
		}
		if (!isset($data['total']) || (isset($data['total']) && ($data['total'] <= 0 && $data['total'] == null))) {
			$errors['total'] = "Total is either null or empty or doesn't exist";
		}

		header('Content-Type: application/json');
		if (count($errors) > 0) {
			echo json_encode($errors);
		} else {
			$supplyID = $this->supplyModel->createSupply($data);
			echo json_encode(['id' => $supplyID]);
		}
    }

    public function update($id) {
        // Implement logic to update user by ID
    }

    public function destroy($id) {
        // Implement logic to delete user by ID
    }
}

?>


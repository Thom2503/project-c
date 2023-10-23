<?php
require_once 'model/Supply.php';

class SupplyController {
	private Supply $supplyModel;

	public function __construct() {
		$this->supplyModel = new Supply();
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
		// als je geen naam van de voorziening hebt ingevuld moet het niet door gaan.
		if (!isset($data['name']) || (isset($data['name']) && (trim($data['name']) == "" && $data['name'] == null))) {
			$errors['name'] = "Name is either null or empty or doesn't exist";
		}
		// als het totaal nul is heeft het geen nut om de voorziening toe te voegen
		if (!isset($data['total']) || (isset($data['total']) && ($data['total'] <= 0 && $data['total'] == null))) {
			$errors['total'] = "Total is either null or empty or doesn't exist";
		}

		header('Content-Type: application/json');
		// zijn er errors? stuur die dan terug
		if (count($errors) > 0) {
			echo json_encode($errors);
		} else {
			$supplyID = $this->supplyModel->createSupply($data);
			echo json_encode(['id' => $supplyID]);
		}
    }

    public function update(int $id): void {
		$errors = [];
		$data = json_decode(file_get_contents("php://input"), true);
		// als je geen naam van de voorziening hebt ingevuld moet het niet door gaan.
		if (!isset($data['name']) || (isset($data['name']) && (trim($data['name']) == "" && $data['name'] == null))) {
			$errors['name'] = "Name is either null or empty or doesn't exist";
		}
		// als het totaal nul is heeft het geen nut om de voorziening toe te voegen
		if (!isset($data['total']) || (isset($data['total']) && ($data['total'] <= 0 && $data['total'] == null))) {
			$errors['total'] = "Total is either null or empty or doesn't exist";
		}

		header('Content-Type: application/json');
		// zijn er errors? stuur die dan terug
		if (count($errors) > 0) {
			echo json_encode($errors);
		} else {
			$success = $this->supplyModel->updateSupply($id, $data);
			if ($success == true) {
				echo json_encode(['success' => true]);
			} else {
				http_response_code(404);
				echo json_encode(['error' => 'Supply not found']);
			}
		}
    }

    public function destroy($id) {
        // Implement logic to delete user by ID
    }
}

?>


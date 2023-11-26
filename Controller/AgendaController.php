<?php
require_once 'model/Agenda.php';

class AgendaController {
	private Agenda $agendaModel;

	public function __construct() {
		$this->agendaModel = new Agenda();
	}
	
	public function index(): void {
		header('Content-Type: application/json');
		$agendaItem = $this->agendaModel->getAllAgendaItems();
		echo json_encode($agendaItem);
    }

    public function show(int $id): void {
		header('Content-Type: application/json');
		$agendaItem = $this->agendaModel->getAgendaItemByID($id);
		if ($agendaItem != false && count($agendaItem) > 0) {
			echo json_encode($agendaItem);
		} else {
			http_response_code(404);
			echo json_encode(['error' => 'agenda item not found']);
		}
    }

    public function showUser(int $id): void {
		header('Content-Type: application/json');
		$agendaItem = $this->agendaModel->getAgendaItemByUserID($id);
		if ($agendaItem != false && count($agendaItem) > 0) {
			echo json_encode($agendaItem);
		} else {
			http_response_code(404);
			echo json_encode(['error' => 'agenda item not found']);
		}
    }

    public function store(): void {
		$data = json_decode(file_get_contents("php://input"), true);
        $agendaItemID = $this->agendaModel->createAgendaItem($data);
        header('Content-Type: application/json');
        echo json_encode(['id' => $agendaItemID]);
    }

    public function update($id) {
		$data = json_decode(file_get_contents("php://input"), true);
		$id = $data['accountsid'];
		$ts = $data['date'];
        $success = $this->agendaModel->updateAgendaItem($id, $ts, $data);
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
			$success = $this->agendaModel->deleteAgendaItem($id);
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
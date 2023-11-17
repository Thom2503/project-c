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

	public function showAgendaItemsByUserID(int $userid): void {
		header('Content-Type: application/json');
		$userAgendaItems = $this->agendaModel->getAgendaItemByUserID($userid);
		if ($userAgendaItems != false && count($userAgendaItems) > 0) {
			echo json_encode($userAgendaItems);
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
        
    }

    public function destroy($id) {
        
    }
}

?>
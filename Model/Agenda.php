<?php

class Agenda extends Database {
	protected PDO $db;

	public function __construct() {
		$this->db = parent::getDBConnection();
	}

	public function getAllAgendaItems(): array {
		$query = "SELECT * FROM `AgendaItems`";
		return $this->db->query($query)->fetchAll(PDO::FETCH_ASSOC);
	}

	public function getAgendaItemByID(int $id): array {
		$query = "SELECT * FROM `AgendaItems` WHERE `AgendaItemsID` = :id";
		$stmt = $this->db->prepare($query);
		$stmt->bindParam(":id", $id, PDO::PARAM_INT);
		$stmt->execute();
		return $stmt->fetch(PDO::FETCH_ASSOC);
	}

	public function getAgendaItemByUserID(int $accountsid): array {
		$query = "SELECT * FROM `AgendaItems` WHERE `AccountsId` = :accountsid";
		$stmt = $this->db->prepare($query);
		$stmt->bindParam(":accountsid", $accountsid, PDO::PARAM_STR);
		$stmt->execute();
		return $stmt->fetch(PDO::FETCH_ASSOC);
	}

    public function createAgendaItem(array $data): int {
		$query = "INSERT INTO `AgendaItems` (`Title`, `Note`, `StartDate`, `EndDate`, `Location`, `AccountsId`, `Status`)".
		         "VALUES (:title, :note, :startdate, :enddate, :location, :accountsid, :status)";	
		$stmt = $this->db->prepare($query);
		$stmt->bindParam(":title", $data['title']);
		$stmt->bindParam(":note", $data['note']);
		$stmt->bindParam(":startdate", $data['startdate']);
		$stmt->bindParam(":enddate", $data['enddate']);
		$stmt->bindParam(":location", $data['location']);
		$stmt->bindParam(":accountsid", $data['accountsid']);
		$stmt->bindParam(":status", $data['status']);
		$stmt->execute();
		return $this->db->lastInsertId();
	}

	public function updateAgendaItem(int $id, array $data): bool {
		$query = "UPDATE `AgendaItems` SET `Title` = :title, `Note` = :note, `Location` = :location, `Status` = `status` WHERE `AgendaItemsID` = :sid";
		$stmt = $this->db->prepare($query);
        $stmt->bindParam(":title", $data['title'], PDO::PARAM_STR);
		$stmt->bindParam(":note", $data['note'], PDO::PARAM_STR);
        $stmt->bindParam(":location", $data['location'], PDO::PARAM_STR);
        $stmt->bindParam(":status", $data['status']);
		$stmt->bindParam(":sid", $id, PDO::PARAM_INT);
		return $stmt->execute();
	}

	public function deleteAgendaItem(int $id): bool {
		$query = "DELETE FROM `AgendaItems` WHERE `AgendaItemsID` = :sid";
		$stmt = $this->db->prepare($query);
		$stmt->bindParam(":sid", $id, PDO::PARAM_INT);
		return $stmt->execute();
	}

	public function getAllRooms(): array {
        $query = "SELECT * FROM `Rooms`";
        return $this->db->query($query)->fetchAll(PDO::FETCH_ASSOC);
    }

}

?>
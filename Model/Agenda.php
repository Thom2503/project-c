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

	public function getAgendaItemByID(int $id): array|bool {
		$query = "SELECT * FROM `AgendaItems` WHERE `ID` = :id";
		$stmt = $this->db->prepare($query);
		$stmt->bindParam(":id", $id, PDO::PARAM_INT);
		$stmt->execute();
		return $stmt->fetch(PDO::FETCH_ASSOC);
	}

	public function getAgendaItemByUserID(int $accountsid, ?int $begin = null, ?int $end = null): array|bool {
		if ((isset($begin) && $begin != null) && (isset($end) && $end != null)) {
			$query = "SELECT * FROM `AgendaItems` WHERE `AccountsId` = :accountsid AND `Date` BETWEEN :begin AND :end";
			$stmt = $this->db->prepare($query);
			$stmt->bindParam(":accountsid", $accountsid, PDO::PARAM_STR);
			$stmt->bindParam(":begin", $begin, PDO::PARAM_INT);
			$stmt->bindParam(":end", $end, PDO::PARAM_INT);
		} else {
			$query = "SELECT * FROM `AgendaItems` WHERE `AccountsId` = :accountsid";
			$stmt = $this->db->prepare($query);
			$stmt->bindParam(":accountsid", $accountsid, PDO::PARAM_STR);
		}
		$stmt->execute();
		return $stmt->fetchAll(PDO::FETCH_ASSOC);
	}

    public function createAgendaItem(array $data): int {
		$query = "INSERT INTO `AgendaItems` (`Title`, `Note`, `Date`, `RoomID`, `AccountsId`, `Status`)".
		         "VALUES (:title, :note, :date, :roomID, :accountsid, :status)";
		$stmt = $this->db->prepare($query);
		$stmt->bindParam(":title", $data['title']);
		$stmt->bindParam(":note", $data['note']);
		$stmt->bindParam(":date", $data['date']);
		$stmt->bindParam(":roomID", $data['roomID']);
		$stmt->bindParam(":accountsid", $data['accountsid']);
		$stmt->bindParam(":status", $data['status']);
		$stmt->execute();
		return $this->db->lastInsertId();
	}

	public function updateAgendaItem(int $id, int $ts, array $data): bool {
		$query = "UPDATE `AgendaItems`".
		         " SET `Title` = :title, `Note` = :note, `RoomID` = :roomID, `Status` = :status, `AccountsId` = :sid, `Date` = :date".
		         " WHERE `AccountsId` = :sid AND `Date` = :date";
		$stmt = $this->db->prepare($query);
        $stmt->bindParam(":title", $data['title'], PDO::PARAM_STR);
		$stmt->bindParam(":note", $data['note'], PDO::PARAM_STR);
        $stmt->bindParam(":roomID", $data['roomID'], PDO::PARAM_STR);
        $stmt->bindParam(":status", $data['status']);
		$stmt->bindParam(":sid", $id, PDO::PARAM_INT);
		$stmt->bindParam(":date", $ts, PDO::PARAM_INT);
		return $stmt->execute();
	}

	public function deleteAgendaItem(int $id): bool {
		$query = "DELETE FROM `AgendaItems` WHERE `ID` = :sid";
		$stmt = $this->db->prepare($query);
		$stmt->bindParam(":sid", $id, PDO::PARAM_INT);
		return $stmt->execute();
	}
}

?>
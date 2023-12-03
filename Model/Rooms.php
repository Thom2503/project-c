<?php

class Rooms extends Database {
    protected PDO $db;

    public function __construct() {
        $this->db = parent::getDBConnection();
    }

    public function getAllRooms(): array {
        $query = "SELECT * FROM `Rooms`";
        return $this->db->query($query)->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getRoomByID(int $id): array {
        $query = "SELECT * FROM `Rooms` WHERE `RoomsID` = :id";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(":id", $id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

	public function getUsersInRoom(int $roomID): array {
		$query = "SELECT `Accounts`.`AccountsID`, `FirstName`, `Function`, `LastName` FROM `AgendaItems`".
		         "  LEFT JOIN `Accounts` ON `Accounts`.`AccountsID` = `AgendaItems`.`AccountsID`".
		         "  WHERE `RoomID` = :rid".
		         "    AND DATETIME(`Date` / 1000, 'unixepoch', 'localtime')".
		         "    BETWEEN DATETIME('now', 'start of day') AND DATETIME('now', 'start of day', '+1 day')";
		$stmt = $this->db->prepare($query);
		$stmt->bindParam(":rid", $roomID, PDO::PARAM_INT);
		$stmt->execute();
		return $stmt->fetchAll(PDO::FETCH_ASSOC);
	}

}

?>


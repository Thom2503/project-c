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

	public function getEventsInRoom(string $roomName): array {
		// SElECT * FROM `Events` WHERE `Location` = "test" AND DATETIME(`Date` / 1000, 'unixepoch', 'localtime') BETWEEN DATETIME('now', 'start of day') AND DATETIME('now', 'start of day', '+1 day');
		$query = "SELECT * FROM `Events`".
		         "  WHERE `Location` = :rname".
		         "    AND STRFTIME('%Y-%m-%d', SUBSTR(Date, 7, 4) || '-' || SUBSTR(Date, 4, 2) || '-' || SUBSTR(Date, 1, 2))".
		         "      = STRFTIME('%Y-%m-%d', 'now', 'localtime')";
		$stmt = $this->db->prepare($query);
		$stmt->bindParam(":rname", $roomName, PDO::PARAM_STR);
		$stmt->execute();
		return $stmt->fetchAll(PDO::FETCH_ASSOC);
	}

	public function createRoom(array $data): int {
		$query = "INSERT INTO `Rooms` (`Name`, `Capacity`)".
		         "VALUES (:name, :capacity)";	
		$stmt = $this->db->prepare($query);
		$stmt->bindParam(":name", $data['Name']);
		$stmt->bindParam(":capacity", $data['Capacity']);
		$stmt->execute();
		return $this->db->lastInsertId();
	}

    public function updateRoom(int $id, array $data): bool {
		$query = "UPDATE `Rooms`".
		         " SET `Name` = :name, `Capacity` = :capacity".
		         " WHERE `RoomsID` = :sid ";
		$stmt = $this->db->prepare($query);
		$stmt->bindParam(":name", $data['Name'], PDO::PARAM_STR);
		$stmt->bindParam(":capacity", $data['Capacity'], PDO::PARAM_INT);
		$stmt->bindParam(":sid", $id, PDO::PARAM_INT);
		return $stmt->execute();
	}

	public function deleteRoom(int $id): bool {
		$query = "DELETE FROM `Rooms` WHERE `RoomsID` = :sid";
		$stmt = $this->db->prepare($query);
		$stmt->bindParam(":sid", $id, PDO::PARAM_INT);
		return $stmt->execute();
	}

}

?>


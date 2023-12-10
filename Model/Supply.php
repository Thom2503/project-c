<?php

class Supply extends Database {
	protected PDO $db;

	public function __construct() {
		$this->db = parent::getDBConnection();
	}

	public function getAllSupplies(): array {
		$query = "SELECT * FROM `Supplies`";
		return $this->db->query($query)->fetchAll(PDO::FETCH_ASSOC);
	}

	public function getSupplyByID(int $id): array {
		$query = "SELECT * FROM `Supplies` WHERE `SuppliesID` = :id";
		$stmt = $this->db->prepare($query);
		$stmt->bindParam(":id", $id, PDO::PARAM_INT);
		$stmt->execute();
		return $stmt->fetch(PDO::FETCH_ASSOC);
	}

	public function createSupply(array $data): int {
		$query = "INSERT INTO `Supplies` (`Name`, `Total`)".
		         "VALUES (:name, :total)";	
		$stmt = $this->db->prepare($query);
		$stmt->bindParam(":name", $data['name']);
		$stmt->bindParam(":total", $data['total']);
		$stmt->execute();
		return $this->db->lastInsertId();
	}

	public function updateSupply(int $id, array $data): bool {
		$query = "UPDATE `Supplies` SET `Name` = :name, `Total` = :total WHERE `SuppliesID` = :sid";
		$stmt = $this->db->prepare($query);
		$stmt->bindParam(":name", $data['name'], PDO::PARAM_STR);
		$stmt->bindParam(":total", $data['total'], PDO::PARAM_INT);
		$stmt->bindParam(":sid", $id, PDO::PARAM_INT);
		return $stmt->execute();
	}

	public function deleteSupply(int $id): bool {
		$query = "DELETE FROM `Supplies` WHERE `SuppliesID` = :sid";
		$stmt = $this->db->prepare($query);
		$stmt->bindParam(":sid", $id, PDO::PARAM_INT);
		return $stmt->execute();
	}

	public function setUserSupplies(array $data): int|bool {
		$query = "INSERT INTO `UserSupplies` (`AgendaItemID`, `SupplyID`, `Date`)".
		         " SELECT :uid, :sid, :date".
		         " WHERE NOT EXISTS (".
		         "     SELECT 1 FROM `UserSupplies`".
		         "     WHERE `AgendaItemID` = :uid AND `SupplyID` = :sid AND `Date` = :date".
		         " )";
		$stmt = $this->db->prepare($query);
		foreach ($data['supplies'] as $supply) {
			$stmt->bindParam(":uid", $data['itemid']);
			$stmt->bindParam(":sid", $supply);
			$stmt->bindParam(":date", $data['date']);
			$stmt->execute();
		}
		return $this->db->lastInsertId();
	}

	public function getUserSupplies(int $id): array {
		$query = "SELECT `SupplyID` FROM `UserSupplies` WHERE `AgendaItemID` = :aid";
		$stmt = $this->db->prepare($query);
		$stmt->bindParam(":aid", $id);
		$stmt->execute();
		return $stmt->fetchAll(PDO::FETCH_COLUMN);
	}

	public function deleteUserSupplies(int $supplyID, int $itemID): int|bool {
		$query = "DELETE FROM `UserSupplies` WHERE `SupplyID` = :sid AND `AgendaItemID` = :aid";
		$stmt = $this->db->prepare($query);
		$stmt->bindParam(":aid", $itemID);
		$stmt->bindParam(":sid", $supplyID);
		return $stmt->execute();
	}

	public function getTodaySupplies(string|int $date): array {
		$query = "SELECT `SupplyID`, COUNT(*) AS `C` FROM `UserSupplies`".
		         " WHERE `Date` = :date GROUP BY `SupplyID`";
		$stmt = $this->db->prepare($query);
		$stmt->bindParam(":date", $date, PDO::PARAM_STR);
		$stmt->execute();
		return $stmt->fetchAll(PDO::FETCH_ASSOC);
	}
}

?>


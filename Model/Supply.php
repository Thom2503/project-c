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
		$stmt->bindParam(":name", $data['name']);
		$stmt->bindParam(":total", $data['total']);
		$stmt->bindParam(":sid", $id);
		return $stmt->execute();
	}
}

?>


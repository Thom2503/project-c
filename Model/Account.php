<?php

class Account extends Database {
	protected PDO $db;

	public function __construct() {
		$this->db = parent::getDBConnection();
	}

	public function getAllAccounts(): array {
		$query = "SELECT * FROM `Accounts`";
		return $this->db->query($query)->fetchAll(PDO::FETCH_ASSOC);
	}

	public function getAccountByID(int $id): array {
		$query = "SELECT * FROM `Accounts` WHERE `AccountsID` = :id";
		$stmt = $this->db->prepare($query);
		$stmt->bindParam(":id", $id, PDO::PARAM_INT);
		$stmt->execute();
		return $stmt->fetch(PDO::FETCH_ASSOC);
	}

	public function getAccountByEmail(string $email): array {
		$query = "SELECT * FROM `Accounts` WHERE `Email` = :email";
		$stmt = $this->db->prepare($query);
		$stmt->bindParam(":email", $email, PDO::PARAM_STR);
		$stmt->execute();
		return $stmt->fetch(PDO::FETCH_ASSOC);
	}
	
}

?>


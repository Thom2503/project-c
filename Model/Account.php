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

	public function getAccountByID(int $id): array|bool {
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
	
	public function createUserAccount(array $data): int {
		$query = "INSERT INTO `Accounts`".
		         "(`FirstName`, `LastName`, `Function`, `IsAdmin`, `Email`, `Password`)".
		         "VALUES (:first, :last, :function, :admin, :email, :password)";
		$stmt = $this->db->prepare($query);
		$stmt->bindParam(":first", $data['FirstName'], PDO::PARAM_STR);
		$stmt->bindParam(":last", $data['LastName'], PDO::PARAM_STR);
		$stmt->bindParam(":function", $data['Function'], PDO::PARAM_STR);
		$stmt->bindParam(":admin", $data['IsAdmin'], PDO::PARAM_BOOL);
		$stmt->bindParam(":email", $data['Email'], PDO::PARAM_STR);
		$stmt->bindParam(":password", $data['secure_pass'], PDO::PARAM_STR);
		$stmt->execute();
		return $this->db->lastInsertId();
	}

	public function updateAccount(int $id, array $data): bool {
		$query = "UPDATE `Accounts`".
		         " SET `FirstName` = :first, `LastName` = :last, `IsAdmin` = :admin, `Email` = :email, `Function` = :function".
		         " WHERE `AccountsId` = :sid ";
		$stmt = $this->db->prepare($query);
		$stmt->bindParam(":first", $data['FirstName'], PDO::PARAM_STR);
		$stmt->bindParam(":last", $data['LastName'], PDO::PARAM_STR);
		$stmt->bindParam(":function", $data['Function'], PDO::PARAM_STR);
		$stmt->bindParam(":admin", $data['IsAdmin'], PDO::PARAM_BOOL);
		$stmt->bindParam(":email", $data['Email'], PDO::PARAM_STR);
		$stmt->bindParam(":sid", $id, PDO::PARAM_INT);
		return $stmt->execute();
	}

	public function updateAccountPassword(int $id, array $data): bool {
		$query = "UPDATE `Accounts`".
		         " SET `Password` = :password".
		         " WHERE `AccountsId` = :sid ";
		$stmt = $this->db->prepare($query);
		$stmt->bindParam(":password", $data['secure_pass'], PDO::PARAM_STR);
		$stmt->bindParam(":sid", $id, PDO::PARAM_INT);
		return $stmt->execute();
	}

	public function deleteAccount(int $id): bool {
		$query = "DELETE FROM `Accounts` WHERE `AccountsID` = :sid";
		$stmt = $this->db->prepare($query);
		$stmt->bindParam(":sid", $id, PDO::PARAM_INT);
		return $stmt->execute();
	}
}

?>


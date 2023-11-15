<?php

class Notification extends Database {
	protected PDO $db;

	public function __construct() {
		$this->db = parent::getDBConnection();
	}

	public function getSubscribers(): array {
		$query = "SELECT * FROM `Subscriptions`";
		return $this->db->query($query)->fetchAll(PDO::FETCH_ASSOC);
	}

	public function getSubscriberByID(int $id): array|bool {
		$query = "SELECT * FROM `Subscriptions` WHERE `GebruikerID` = :id";
		$stmt = $this->db->prepare($query);
		$stmt->bindParam(":id", $id, PDO::PARAM_INT);
		$stmt->execute();
		return $stmt->fetch(PDO::FETCH_ASSOC);
	}
	
}

?>


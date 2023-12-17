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
	
	public function setUserSubscription(array $data): int {
		// maak de column naam op basis wat het type is wat geupdatet moet worden
		$sqSubscriptionType = $data['type'] == "mail" ? "`WantsMail`" : "`WantsPush`";
		// een upsert query, waar je of insert of als er al een gebruiker is gevonden word die
		// geupdatet.
		$query = "INSERT INTO `Subscriptions` (`GebruikerID`, ".$sqSubscriptionType.")".
		         "VALUES (:uid, :wants)".
		         "ON CONFLICT(`GebruikerID`)".
		         "DO UPDATE SET ".$sqSubscriptionType."=excluded.".$sqSubscriptionType;
		$stmt = $this->db->prepare($query);
		$stmt->bindParam(":uid", $data['userid']);
		$stmt->bindParam(":wants", $data['wants']);
		$stmt->execute();
		return $this->db->lastInsertId();
	}

	public function getUserNotification(): array {
		$query = "SELECT * FROM `Notifications`".
		         " WHERE `Timestamp` BETWEEN STRFTIME('%s', 'now', '-1 month') AND STRFTIME('%s', 'now')".
		         " ORDER BY `Timestamp` DESC";
		return $this->db->query($query)->fetchAll(PDO::FETCH_ASSOC);
	}

	public function addNotificationContent(array $data): int {
		// update alle subscribers dat ze hun notificaties niet hebben gelezen.
		$this->db->query("UPDATE `Subscriptions` SET `HasRead` = 0")->execute();
		$query = "INSERT INTO `Notifications` (`Content`, `Timestamp`) VALUES (:content, :ts)";
		$stmt = $this->db->prepare($query);
		$stmt->bindParam(":content", $data['content']);
		$stmt->bindParam(":ts", time());
		$stmt->execute();
		return $this->db->lastInsertId();
	}

	public function updateUserNotification(int $id, array $data): bool {
		$query = "UPDATE `Subscriptions` SET `HasRead` = :read WHERE `GebruikerID` = :uid";
		$stmt = $this->db->prepare($query);
		$stmt->bindParam(":read", $data['hasRead'], PDO::PARAM_BOOL);
		$stmt->bindParam(":uid", $id, PDO::PARAM_INT);
		return $stmt->execute();
	}
}

?>


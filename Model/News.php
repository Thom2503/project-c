<?php

class News extends Database {
	protected PDO $db;

	public function __construct() {
		$this->db = parent::getDBConnection();
	}

    public function getAllNewsItems(): array {
		$query = "SELECT * FROM `News`";
		return $this->db->query($query)->fetchAll(PDO::FETCH_ASSOC);
	}

	public function getNewsByID(int $id): array {
		$query = "SELECT * FROM `News` WHERE `NewsID` = :id";
		$stmt = $this->db->prepare($query);
		$stmt->bindParam(":id", $id, PDO::PARAM_INT);
		$stmt->execute();
		return $stmt->fetch(PDO::FETCH_ASSOC);
	}


	public function createNewsItem(array $data): int {
		$query = "INSERT INTO `News` (`Title`, `Description`, `Image`, `PostTime`, `AccountsId`, `Status`)".
		         "VALUES (:title, :description, :image, :posttime, :accountsid, :status)";
		$stmt = $this->db->prepare($query);
		$stmt->bindParam(":title", $data['title']);
		$stmt->bindParam(":description", $data['description']);
		$stmt->bindParam(":image", $data['image']);
		$stmt->bindParam(":posttime", $data['posttime']);
		$stmt->bindParam(":accountsid", $data['accountsid']);
		$stmt->bindParam(":status", $data['status']);
		$stmt->execute();
		return $this->db->lastInsertId();
	}
}
?>
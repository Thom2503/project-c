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
		$query = "INSERT INTO `News` (`Title`, `Description`, `Image`, `PostTime`, `AccountsId`)".
		         "VALUES (:title, :description, :image, :posttime, :accountsid)";
		$stmt = $this->db->prepare($query);
		$stmt->bindParam(":title", $data['title']);
		$stmt->bindParam(":description", $data['description']);
		$stmt->bindParam(":image", $data['image']);
		$stmt->bindParam(":posttime", $data['posttime']);
		$stmt->bindParam(":accountsid", $data['accountsid']);
		$stmt->execute();
		return $this->db->lastInsertId();
	}

	public function updateNews(int $id, array $data): bool {
        $query = "UPDATE `News`".
                 " SET `Title` = :title, `Description` = :description, `Image` = :image, `PostTime` = :posttime".
                 " WHERE `NewsId` = :id";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(":title", $data['title'], PDO::PARAM_STR);
        $stmt->bindParam(":description", $data['description'], PDO::PARAM_STR);
        $stmt->bindParam(":image", $data['image'], PDO::PARAM_STR);
        $stmt->bindParam(":posttime", $data['posttime']);
        $stmt->bindParam(":id", $id, PDO::PARAM_INT);
        return $stmt->execute();
    }

	public function deleteNews(int $id): bool {
		$query = "DELETE FROM `News` WHERE `NewsId` = :id";
		$stmt = $this->db->prepare($query);
		$stmt->bindParam(":id", $id, PDO::PARAM_INT);
		return $stmt->execute();
	}
}
?>
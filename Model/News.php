<?php

class News extends Database {
	protected PDO $db;

	public function __construct() {
		$this->db = parent::getDBConnection();
	}

    public function getAllNewsItems(): array {
		$query = "SELECT * FROM `News`";
		$newsItems = $this->db->query($query)->fetchAll(PDO::FETCH_ASSOC);
	
		// Iterate through each news item and convert the image BLOB to base64
		foreach ($newsItems as &$newsItem) {
			$newsItem['Image'] = base64_encode($newsItem['Image']);
		}
		return $newsItems;
	}

	public function getNewsByID(int $id): array {
		$query = "SELECT * FROM `News` WHERE `NewsID` = :id";
		
		$stmt = $this->db->prepare($query);
		$stmt->bindParam(":id", $id, PDO::PARAM_INT);
		$stmt->execute();
		$newsItem = $stmt->fetch(PDO::FETCH_ASSOC);
		$newsItem['Image'] = base64_encode($newsItem['Image']);
		return $newsItem;
	}


	public function createNewsItem(array $data): int {
        $query = "INSERT INTO `News` (`Title`, `Description`, `Image`, `PostTime`, `AccountsId`)".
                 "VALUES (:title, :description, :image, :posttime, :accountsid)";
		$imageData = isset($data['image']) ? base64_decode($data['image']) : null;
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(":title", $data['title']);
        $stmt->bindParam(":description", $data['description']);
        $stmt->bindValue(":image", $imageData, PDO::PARAM_LOB);
        $stmt->bindParam(":posttime", $data['posttime']);
        $stmt->bindParam(":accountsid", $data['accountsid']);
        $stmt->execute();
        return $this->db->lastInsertId();
    }

	public function updateNews(int $id, array $data): bool {
		$query = "UPDATE `News`".
				 " SET `Title` = :title, `Description` = :description, `Image` = :image, `PostTime` = :posttime".
				 " WHERE `NewsId` = :id";
		$imageData = base64_decode($data['image']);  // Corrected variable name
		$stmt = $this->db->prepare($query);
		$stmt->bindParam(":title", $data['title'], PDO::PARAM_STR);
		$stmt->bindParam(":description", $data['description'], PDO::PARAM_STR);
		$stmt->bindValue(":image", $imageData, PDO::PARAM_LOB);
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
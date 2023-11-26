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
}
?>
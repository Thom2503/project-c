<?php

class Database {
	private string $dbPath = "db/project.db";
	protected PDO $db;

	public function __construct() {
		$this->db = $this->getDBConnection();
	}

	protected function getDBConnection(): PDO {
		$db = new PDO("sqlite:".$this->dbPath);
		$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		return $db;	
	}

}

?>

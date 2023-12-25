<?php

class Key extends Database {
	protected PDO $db;

	public function __construct() {
		$this->db = parent::getDBConnection();
	}

	public function getKeyByName(string $name): array|bool {
		$query = "SELECT * FROM `TempKeys` WHERE `KeyName` = :keyname";
		$stmt = $this->db->prepare($query);
		$stmt->bindParam(":keyname", $name, PDO::PARAM_STR);
		$stmt->execute();
		return $stmt->fetch(PDO::FETCH_ASSOC);
	}
	
	public function createKey(array $data) : int {
        $query = "INSERT INTO `TempKeys` (`KeyName`, `KeyCode`, `KeyDate`)".
		         "VALUES (:keyname, :keycode, :keydate)";
		$stmt = $this->db->prepare($query);
		$stmt->bindParam(":keyname", $data['keyname'], PDO::PARAM_STR);
		$stmt->bindParam(":keycode", $data['keycode'], PDO::PARAM_STR);
		$stmt->bindParam(":keydate", $data['keydate'], PDO::PARAM_STR);
		$stmt->execute();
		return $this->db->lastInsertId();
    }

    public function updateKey(int $id, array $data) : bool {
        $query = "UPDATE `TempKeys`".
		         " SET `KeyName` = :keyname, `KeyCode` = :keycode, `KeyDate` = :keydate".
		         " WHERE `KeyID` = :sid";
		$stmt = $this->db->prepare($query);
		$stmt->bindParam(":keyname", $data['keyname'], PDO::PARAM_STR);
		$stmt->bindParam(":keycode", $data['keycode'], PDO::PARAM_STR);
		$stmt->bindParam(":keydate", $data['keydate'], PDO::PARAM_STR);
		$stmt->bindParam(":sid", $id, PDO::PARAM_INT);
		return $stmt->execute();
    }
}

?>


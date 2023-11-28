<?php

class Events extends Database {
    protected PDO $db;

    public function __construct() {
        $this->db = parent::getDBConnection();
    }

    public function getAllEvents(): array {
        $query = "SELECT * FROM `Events`";
        return $this->db->query($query)->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getEventByID(int $id): array {
        $query = "SELECT * FROM `Events` WHERE `EventsID` = :id";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(":id", $id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

}

?>


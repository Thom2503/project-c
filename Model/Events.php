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

    public function getEventByDate(string $date): array {
        $query = "SELECT * FROM `Events` WHERE `Date` = :date";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(":date", $date, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function getUsersInEvent(int $eventID): array {
        $query = "SELECT `account_id` FROM `AccountEvents` WHERE `event_id` = :eventid";
    
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(":eventid", $eventID);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
        // Extract the account IDs from the result and return them as an array of integers.
        $accountIds = array_map(function($item) {
            return (int)$item['account_id'];
        }, $result);
    
        return $accountIds;
    }

    public function joinEvent(int $accountid, int $eventid): int {
        $query = "INSERT INTO `AccountEvents` (`account_id`, `event_id`, `hasVoted`) VALUES (:accountid, :eventid, 0)";

        $stmt = $this->db->prepare($query);
        $stmt->bindParam(":accountid", $accountid); // Use $eventID instead of $data['eventid']
        $stmt->bindParam(":eventid", $eventid); // Use $eventID instead of $data['eventid']
        $stmt->execute();
        return $this->db->lastInsertId();
    }

    public function unjoinEvent(int $accountid, int $eventid): int {
        $query = "DELETE FROM `AccountEvents` WHERE `account_id` = :accountid AND `event_id` = :eventid";

        $stmt = $this->db->prepare($query);
        $stmt->bindParam(":accountid", $accountid); // Use $eventID instead of $data['eventid']
        $stmt->bindParam(":eventid", $eventid); // Use $eventID instead of $data['eventid']
        $stmt->execute();
        return $this->db->lastInsertId();
    }

    public function deleteEvent(int $id): void {
        // Delete from Events table
        $queryEvents = "DELETE FROM `Events` WHERE `EventsID` = :id";
        $stmtEvents = $this->db->prepare($queryEvents);
        $stmtEvents->bindParam(":id", $id, PDO::PARAM_INT);
        $stmtEvents->execute();
    
        // Delete from AccountEvents table
        $queryAccountEvents = "DELETE FROM `AccountEvents` WHERE `event_id` = :id";
        $stmtAccountEvents = $this->db->prepare($queryAccountEvents);
        $stmtAccountEvents->bindParam(":id", $id, PDO::PARAM_INT);
        $stmtAccountEvents->execute();
    }

    public function hasVotedForEvent(int $accountid, int $eventid): bool {
        $query = "SELECT * FROM `AccountEvents` WHERE `account_id` = :accountid AND `event_id` = :eventid";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(":accountid", $accountid);
        $stmt->bindParam(":eventid", $eventid);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result['hasVoted'] == 1 ? true : false;
    }

    public function updateEvent($id, array $data): bool {

        $query = "UPDATE `Events` SET 
        `Title` = :title, 
        `Description` = :description, 
        `Location` = :location, 
        `IsTentative` = :isTentative, 
        `TentativeTime` = :tentativeTime, 
        `DeclineTime` = :declineTime, 
        `IsExternal` = :isExternal, 
        `AccountsId` = :accountsId, 
        `Status` = :status, 
        `Date` = :date, 
        `startTime` = :startTime, 
        `endTime` = :endTime 
    WHERE `EventsID` = :eventId";

        $stmt = $this->db->prepare($query);
        $stmt->bindParam(":title", $data['title']); // Use 'Title' instead of 'title'
        $stmt->bindParam(":description", $data['description']); // Use 'Description' instead of 'description'
        $stmt->bindParam(":location", $data['location']); // Use 'Location' instead of 'location'
        $stmt->bindParam(":isTentative", $data['istentative']); // Use 'isTentative' instead of 'isTentative'
        $stmt->bindParam(":tentativeTime", $data['tentativetime']); // Use 'TentativeTime' instead of 'tentativeTime'
        $stmt->bindParam(":declineTime", $data['declinetime']); // Use 'DeclineTime' instead of 'declineTime'
        $stmt->bindParam(":isExternal", $data['isexternal']); // Use 'IsExternal' instead of 'isExternal'
        $stmt->bindParam(":accountsId", $data['accountsid']); // Use 'AccountsId' instead of 'accountsId'
        $stmt->bindParam(":status", $data['status']); // Use 'Status' instead of 'status'
        $stmt->bindParam(":date", $data['date']); // Use 'Date' instead of 'date'
        $stmt->bindParam(":startTime", $data['starttime']); // Use 'Date' instead of 'date'
        $stmt->bindParam(":endTime", $data['endtime']); // Use 'Date' instead of 'date'
        $stmt->bindParam(":eventId", $id); // Use 'Date' instead of 'date'


        

        return $stmt->execute();

    }
    

    public function createEvent(array $data): int {
        $query = "INSERT INTO `Events` 
          (`Title`, `Description`, `Location`, `IsTentative`, 
           `TentativeTime`, `DeclineTime`, `IsExternal`, `AccountsId`, 
           `Status`, `Date`, `startTime`, `endTime`)
          VALUES 
            (:title, :description, :location, :isTentative, 
             :tentativeTime, :declineTime, :isExternal, :accountsId, 
             :status, :date, :startTime, :endTime)";

        $stmt = $this->db->prepare($query);
        $stmt->bindParam(":title", $data['title']); // Use 'Title' instead of 'title'
        $stmt->bindParam(":description", $data['description']); // Use 'Description' instead of 'description'
        $stmt->bindParam(":location", $data['location']); // Use 'Location' instead of 'location'
        $stmt->bindParam(":isTentative", $data['istentative']); // Use 'isTentative' instead of 'isTentative'
        $stmt->bindParam(":tentativeTime", $data['tentativetime']); // Use 'TentativeTime' instead of 'tentativeTime'
        $stmt->bindParam(":declineTime", $data['declinetime']); // Use 'DeclineTime' instead of 'declineTime'
        $stmt->bindParam(":isExternal", $data['isexternal']); // Use 'IsExternal' instead of 'isExternal'
        $stmt->bindParam(":accountsId", $data['accountsid']); // Use 'AccountsId' instead of 'accountsId'
        $stmt->bindParam(":status", $data['status']); // Use 'Status' instead of 'status'
        $stmt->bindParam(":date", $data['date']); // Use 'Date' instead of 'date'
        $stmt->bindParam(":startTime", $data['starttime']); // Use 'Date' instead of 'date'
        $stmt->bindParam(":endTime", $data['endtime']); // Use 'Date' instead of 'date'


        $stmt->execute();

        return $this->db->lastInsertId();
    }

}

?>

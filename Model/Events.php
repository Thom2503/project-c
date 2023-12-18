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

    public function getAccountEvents(int $id): array {
        $query = "SELECT account_id, confirmed FROM `AccountEvents` WHERE `event_id` = :eventid";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(":eventid", $id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getEventByDate(string $date): array {
        $query = "SELECT * FROM `Events` WHERE `Date` = :date";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(":date", $date, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function resetVote(array $data): array {
       
        $selectQuery = "SELECT `hasVoted` FROM `AccountEvents` WHERE `account_id` = :accountid AND `event_id` = :eventid";
        $stmt = $this->db->prepare($selectQuery);
        $stmt->bindParam(":accountid", $data['accountid']);
        $stmt->bindParam(":eventid", $data['eventid']);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        $votedInt = $result['hasVoted'];

        $updateQuery = "UPDATE `AccountEvents` SET `hasVoted` = 0 WHERE `account_id` = :accountid AND `event_id` = :eventid";
        $stmt = $this->db->prepare($updateQuery);
        $stmt->bindParam(":eventid", $data['eventid']);
        $stmt->bindParam(":accountid", $data['accountid']);
        $stmt->execute();

        $eventID = $data['eventid'];
        if ($votedInt == 1) {
            $query = "UPDATE `Events` SET `like` = `like` - 1 WHERE `EventsID` = :eventid";
        } else {
            $query = "UPDATE `Events` SET `dislike` = `dislike` - 1 WHERE `EventsID` = :eventid";
        }

        $stmt = $this->db->prepare($query);
        $stmt->bindParam(":eventid", $eventID);
        $stmt->execute();

        return ['status' => 'success'];
    }



    public function getUsersInEvent(int $eventID): array {
        $query = "SELECT `account_id` FROM `AccountEvents` WHERE `event_id` = :eventid";


        $stmt = $this->db->prepare($query);
        $stmt->bindParam(":eventid", $eventID);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $accountIds = array_map(function($item) {
            return (int)$item['account_id'];
        }, $result);
    
        return $accountIds;
    }

    public function getVotersInEvent(int $eventID): array {
        $query = "SELECT `account_id` FROM `AccountEvents` WHERE `event_id` = :eventid AND `hasVoted` != 0";


        $stmt = $this->db->prepare($query);
        $stmt->bindParam(":eventid", $eventID);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $accountIds = array_map(function($item) {
            return (int)$item['account_id'];
        }, $result);

        return $accountIds;
    }

    public function joinEvent(int $accountid, int $eventid): int {
        $query = "INSERT INTO `AccountEvents` (`account_id`, `event_id`, `hasVoted`) VALUES (:accountid, :eventid, 0)";

        $stmt = $this->db->prepare($query);
        $stmt->bindParam(":accountid", $accountid);
        $stmt->bindParam(":eventid", $eventid);
        $stmt->execute();
        return $this->db->lastInsertId();
    }

    public function unjoinEvent(int $accountid, int $eventid): int {
        $query = "DELETE FROM `AccountEvents` WHERE `account_id` = :accountid AND `event_id` = :eventid";

        $stmt = $this->db->prepare($query);
        $stmt->bindParam(":accountid", $accountid);
        $stmt->bindParam(":eventid", $eventid);
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

    public function updateAccountEvents(array $data) {
        $query = "UPDATE `AccountEvents` SET `confirmed` = :confirmed WHERE `account_id` = :accountid AND `event_id` = :eventid";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(":confirmed", $data['confirmed']);
        $stmt->bindParam(":accountid", $data['accountid']);
        $stmt->bindParam(":eventid", $data['eventid']);
        $stmt->execute();
    }

    public function updateEvent(array $data): bool {

        $query = "UPDATE `Events` SET 
        `Title` = :title, 
        `Description` = :description, 
        `Location` = :location, 
        `IsTentative` = :isTentative, 
        `TentativeTime` = :tentativeTime, 
        `DeclineTime` = :declineTime, 
        `IsExternal` = :isExternal, 
        `Host` = :host,
        `Status` = :status, 
        `Date` = :date, 
        `startTime` = :startTime, 
        `endTime` = :endTime,
        `Timestamp` = :unixTimestamp,
        `requestRating` = :requestRating,
        `requestFeedback` = :requestFeedback
    WHERE `EventsID` = :eventId";

        $stmt = $this->db->prepare($query);
        $stmt->bindParam(":title", $data['title']);
        $stmt->bindParam(":description", $data['description']);
        $stmt->bindParam(":location", $data['location']);
        $stmt->bindParam(":isTentative", $data['istentative']);
        $stmt->bindParam(":tentativeTime", $data['tentativetime']);
        $stmt->bindParam(":declineTime", $data['declinetime']);
        $stmt->bindParam(":isExternal", $data['isexternal']);
        $stmt->bindParam(":host", $data['host']);
        $stmt->bindParam(":status", $data['status']);
        $stmt->bindParam(":date", $data['date']);
        $stmt->bindParam(":startTime", $data['starttime']);
        $stmt->bindParam(":endTime", $data['endtime']);
        $stmt->bindParam(":eventId", $data['eventid']);
        $stmt->bindParam(":unixTimestamp", $data['epochint']);
                $stmt->bindParam(":requestRating", $data['requestRating']);
                $stmt->bindParam(":requestFeedback", $data['requestFeedback']);

        return $stmt->execute();

    }
    

    public function createEvent(array $data): int {
        $query = "INSERT INTO `Events` 
          (`Title`, `Description`, `Location`, `IsTentative`, 
           `TentativeTime`, `DeclineTime`, `IsExternal`, `Host`,
           `Status`, `Date`, `startTime`, `endTime`, `Timestamp`, `requestRating`, `requestFeedback`)
          VALUES 
            (:title, :description, :location, :isTentative, 
             :tentativeTime, :declineTime, :isExternal, :accountsId, 
             :status, :date, :startTime, :endTime, :unixTimestamp, :requestRating, :requestFeedback)";

        $stmt = $this->db->prepare($query);
        $stmt->bindParam(":title", $data['title']);
        $stmt->bindParam(":description", $data['description']);
        $stmt->bindParam(":location", $data['location']);
        $stmt->bindParam(":isTentative", $data['istentative']);
        $stmt->bindParam(":tentativeTime", $data['tentativetime']);
        $stmt->bindParam(":declineTime", $data['declinetime']);
        $stmt->bindParam(":isExternal", $data['isexternal']);
        $stmt->bindParam(":accountsId", $data['host']);
        $stmt->bindParam(":status", $data['status']);
        $stmt->bindParam(":date", $data['date']);
        $stmt->bindParam(":startTime", $data['starttime']);
        $stmt->bindParam(":endTime", $data['endtime']);
        $stmt->bindParam(":unixTimestamp", $data['epochint']);
        $stmt->bindParam(":requestRating", $data['requestRating']);
        $stmt->bindParam(":requestFeedback", $data['requestFeedback']);




        $stmt->execute();

        return $this->db->lastInsertId();
    }

    public function voteEvent(array $data): void {
        $accountid = $data['accountid'];
        $eventid = $data['eventid'];
        $vote = $data['vote'];

        $query = "SELECT `hasVoted` FROM `AccountEvents` WHERE `account_id` = :accountid AND `event_id` = :eventid";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(":accountid", $accountid);
        $stmt->bindParam(":eventid", $eventid);
        $stmt->execute();

        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        $hasvoted = $result['hasVoted'];

        if ($hasvoted == 0) {
            if ($vote == 1) {
                $query = "UPDATE `Events` SET `like` = `like` + 1 WHERE `EventsID` = :eventid";
                $queryAccountEvents = "UPDATE `AccountEvents` SET `hasVoted` = 1 WHERE `account_id` = :accountid AND `event_id` = :eventid";

                $stmt = $this->db->prepare($query);
                $stmt->bindParam(":eventid", $eventid);
                $stmt->execute();
        
                $stmtAccountEvents = $this->db->prepare($queryAccountEvents);
                $stmtAccountEvents->bindParam(":accountid", $accountid);
                $stmtAccountEvents->bindParam(":eventid", $eventid);
                $stmtAccountEvents->execute();
            } elseif ($vote == 2) {
                $query = "UPDATE `Events` SET `dislike` = `dislike` + 1 WHERE `EventsID` = :eventid";
                $queryAccountEvents = "UPDATE `AccountEvents` SET `hasVoted` = 2 WHERE `account_id` = :accountid AND `event_id` = :eventid";

                $stmt = $this->db->prepare($query);
                $stmt->bindParam(":eventid", $eventid);
                $stmt->execute();
        
                $stmtAccountEvents = $this->db->prepare($queryAccountEvents);
                $stmtAccountEvents->bindParam(":accountid", $accountid);
                $stmtAccountEvents->bindParam(":eventid", $eventid);
                $stmtAccountEvents->execute();
            }
        } else {
            if ($hasvoted == 2 && $vote == 1) {
                $query = "UPDATE `Events` SET `like` = `like` + 1, `dislike` = `dislike` - 1 WHERE `EventsID` = :eventid";
                $queryAccountEvents = "UPDATE `AccountEvents` SET `hasVoted` = 1 WHERE `account_id` = :accountid AND `event_id` = :eventid";

                $stmt = $this->db->prepare($query);
                $stmt->bindParam(":eventid", $eventid);
                $stmt->execute();
        
                $stmtAccountEvents = $this->db->prepare($queryAccountEvents);
                $stmtAccountEvents->bindParam(":accountid", $accountid);
                $stmtAccountEvents->bindParam(":eventid", $eventid);
                $stmtAccountEvents->execute();
            } elseif ($hasvoted == 1 && $vote == 2) {
                $query = "UPDATE `Events` SET `dislike` = `dislike` + 1, `like` = `like` - 1 WHERE `EventsID` = :eventid";
                $queryAccountEvents = "UPDATE `AccountEvents` SET `hasVoted` = 2 WHERE `account_id` = :accountid AND `event_id` = :eventid";

                $stmt = $this->db->prepare($query);
                $stmt->bindParam(":eventid", $eventid);
                $stmt->execute();
        
                $stmtAccountEvents = $this->db->prepare($queryAccountEvents);
                $stmtAccountEvents->bindParam(":accountid", $accountid);
                $stmtAccountEvents->bindParam(":eventid", $eventid);
                $stmtAccountEvents->execute();
            }
        }
    }



    public function returnComments(int $eventID): array {
        $query = "SELECT `account_id`, `comment` FROM `Comments` WHERE `event_id` = :eventid";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(":eventid", $eventID);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function createComment(array $data): int {
        $query = "INSERT INTO `Comments` (`account_id`, `event_id`, `comment`) VALUES (:accountid, :eventid, :comment)";

        $stmt = $this->db->prepare($query);
        $stmt->bindParam(":accountid", $data['accountid']);
        $stmt->bindParam(":eventid", $data['eventid']);
        $stmt->bindParam(":comment", $data['comment']);
        $stmt->execute();
        return $this->db->lastInsertId();
    }



}

?>
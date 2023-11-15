<?php
define("TEMPLATE_ASSOC", [1 => Templates::Event, 2 => Templates::News]);

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'include/PHPMailer/src/Exception.php';
require 'include/PHPMailer/src/PHPMailer.php';
require 'include/PHPMailer/src/SMTP.php';
require_once 'model/Notification.php';
require_once 'model/Account.php';

abstract class Templates {
	const Event = 1;
	const News  = 2;
}

class NotificationController {
	private Notification $notification;
	private Account $userModel;

	public function __construct() {
		$this->notification = new Notification();
		$this->userModel = new Account();
	}
	
	public function index(): void {
		header('Content-Type: application/json');
		$users = $this->notification->getSubscribers();
		echo json_encode($users);
    }

    public function show(int $id): void {
		header('Content-Type: application/json');
		$user = $this->notification->getSubscriberByID($id);
		if ($user != false && count($user) > 0) {
			echo json_encode($user);
		} else {
			http_response_code(404);
			echo json_encode(['error' => 'subscriber not found']);
		}
    }

	public function sendMailToUser(): void {
		$errors = [];
		$data = json_decode(file_get_contents("php://input"), true);
		$userID = (int)$data['user'];
		$templateID = (int)$data['template'];
		// check of de template voor komt in de defined array met templates
		if (!in_array($templateID, array_keys(TEMPLATE_ASSOC))) {
			$errors['template'] = "Template id not found in TEMPLATE_ASSOC";
		}

		$mailContent = $this->getTemplateBody(TEMPLATE_ASSOC[$templateID]);
		$userData = $this->userModel->getAccountByID($userID);

		$htMailOut = "<html>";
		$htMailOut .= "<head>";
		$htMailOut .= "<title>Automatische mail Cavero planner</title>";
		$htMailOut .= "</head>";
		$htMailOut .= "</body>";
		$htMailOut .= "<p>Beste ".$userData['FirstName'].",</p>";
		$htMailOut .= $mailContent;
		$htMailOut .= "</body>";
		$htMailOut .= "</html>";

		header('Content-Type: application/json');
		// zijn er errors? stuur die dan terug
		if (count($errors) > 0) {
			echo json_encode($errors);
		} else {
			echo json_encode(['success' => 'mail was sent!']);
		}
	}

    public function store() {
        // Implement logic to store a new user
    }

    public function update($id) {
        // Implement logic to update user by ID
    }

    public function destroy($id) {
        // Implement logic to delete user by ID
    }

	private function getTemplateBody(Templates $template): string|bool {
		$htOut = match ($template) {
			Templates::Event => "<h2>Leuk er is een nieuw evenement toegevoegd!<h2>\n".
			                    "<p>Kijk bij <a href='localhost/evenementen'>de evenementen</a> voor meer informatie</p>",
			Templates::News  => "<h2>Iets nieuws is er!<h2>\n".
			                    "<p>Kijk bij <a href='localhost/nieuws'>het nieuws</a> overzicht voor het nieuwe nieuws bericht.</p>",
			default => false,
		};
		return $htOut;	
	}
}

?>


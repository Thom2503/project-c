<?php
define("TEMPLATE_ASSOC", [1 => Templates::Event, 2 => Templates::News]);
define("SEND_MAIL", "socialekalenderteam4@gmail.com");
define("SEND_PASSWORD", "hgev lxeu iqzg mibp");

use PHPMailer\PHPMailer\PHPMailer;

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

	public function showNotifications(): void {
		header('Content-Type: application/json');
		$notifications = $this->notification->getUserNotification();
		if (count($notifications) > 0) {
			echo json_encode($notifications);
		} else {
			http_response_code(404);
			echo json_encode(['error' => 'no notifications found']);
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
		$mailSubject = $this->getTemplateSubject(TEMPLATE_ASSOC[$templateID]);
		$userData = $this->userModel->getAccountByID($userID);

		// de content van de mail
		$htMailOut = "<html>";
		$htMailOut .= "<head>";
		$htMailOut .= "<title>Automatische mail Cavero planner</title>";
		$htMailOut .= "</head>";
		$htMailOut .= "</body>";
		$htMailOut .= "<p>Beste ".$userData['FirstName'].",</p>";
		$htMailOut .= $mailContent;
		$htMailOut .= "</body>";
		$htMailOut .= "</html>";

		// probeer een mail te sturen na het maken zo niet geef errors door
		try {
			$mail = $this->configureMailSettings($userData['Email'], $mailSubject, $htMailOut);

			if (!$mail->send()) {
				$errors['PHPMailer'] = "Mail error: ".$mail->ErrorInfo;
			}
		} catch(phpmailerException $e) {
			header('Content-Type: application/json');
			echo json_encode(['mailerror' => "Mail kon niet goed verzonden worden, probeer het later opnieuw"]);
		}

		header('Content-Type: application/json');
		// zijn er errors? stuur die dan terug
		if (count($errors) > 0) {
			echo json_encode($errors);
		} else {
			echo json_encode(['success' => true]);
		}
	}

    public function store() {
		$errors = [];
		$data = json_decode(file_get_contents("php://input"), true);
		// check of de type voor komt in de types die mogelijk zijn
		if (!in_array($data['type'], ['mail', 'push'])) {
			$errors['type'] = "type not found in ['mail', 'push']";
		}

		header('Content-Type: application/json');
		// zijn er errors? stuur die dan terug
		if (count($errors) > 0) {
			echo json_encode($errors);
		} else {
			$subscriptionID = $this->notification->setUserSubscription($data);
			echo json_encode(['id' => $subscriptionID]);
		}
    }

    public function storeNotification() {
		//XXX: op iets checken of het wel veilig is.
		$data = json_decode(file_get_contents("php://input"), true);
		header('Content-Type: application/json');
		$notificationID = $this->notification->addNotificationContent($data);
		echo json_encode(['id' => $notificationID]);
    }

	/**
	 * Private method om de content van de mail te maken, om naar de gebruiker te sturen.
	 *
	 * @param int $template - welke template er gebruikt moet worden
	 *
	 * @param string $htOut - de body van de mail
	 */
	private function getTemplateBody(int $template): string|bool {
		$htOut = match ($template) {
			Templates::Event => "<h2>Leuk er is een nieuw evenement toegevoegd!<h2>\n".
			                    "<p>Kijk bij <a href='localhost/evenementen'>de evenementen</a> voor meer informatie</p>",
			Templates::News  => "<h2>Iets nieuws is er!<h2>\n".
			                    "<p>Kijk bij <a href='localhost/nieuws'>het nieuws</a> overzicht voor het nieuwe nieuws bericht.</p>",
			default => false,
		};
		return $htOut;	
	}

	/**
	 * Private method om de subject van de mail te maken, om naar de gebruiker te sturen.
	 *
	 * @param int $template - welke template er gebruikt moet worden
	 *
	 * @param string $htOut - de subject van de mail
	 */
	private function getTemplateSubject(int $template): string|bool {
		$htOut = match ($template) {
			Templates::Event => "Updates over een evenement!",
			Templates::News  => "Updates over een nieuws artikel",
			default => false,
		};
		return $htOut;
	}

	/**
	 * Method om de mail to configureren om naar de gebruiker te sturen. Hier worden de mail adressen toe
	 * gevoegd, de subject gezet, de body etc.
	 *
	 * @param string $recipient - wie de mail ontvangt
	 * @param string $subject   - wat er in de mail titel moet staan
	 * @param string $body      - wat er in de mail daadwerkelijk staat
	 *
	 * @return PHPMailer $mail - mail object waar je de mail mee verstuurd
	 */
	private function configureMailSettings(string $recipient, string $subject, string $body): PHPMailer {
		$mail = new PHPMailer;
		$mail->isSMTP();
		$mail->Host = "smtp.gmail.com";
		$mail->SMTPAuth = true;
		$mail->Username = SEND_MAIL;
		$mail->Password = SEND_PASSWORD;
		$mail->Port = 587;

		$mail->setFrom(SEND_MAIL, "Cavero - Project Clubhuis");
		$mail->addReplyTo(SEND_MAIL, "Cavero - Project Clubhuis");
		$mail->addAddress($recipient);
		$mail->isHTML(true);
		$mail->Subject = $subject;
		$mail->Body = $body;
		return $mail;
	}

	public function update(int $id): void {
		$data = json_decode(file_get_contents("php://input"), true);
		header('Content-Type: application/json');
		// zijn er errors? stuur die dan terug
		$success = $this->notification->updateUserNotification($id, $data);
		if ($success == true) {
			echo json_encode(['success' => true]);
		} else {
			http_response_code(404);
			echo json_encode(['error' => 'Subscription not updated']);
		}
	}
}

?>


<?php
require_once 'model/Key.php';

class KeyController {
	private Key $keyModel;

	public function __construct() {
		$this->keyModel = new Key();
	}

	function generateValidationCode(int $length) {
		$characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
		$code = '';
	
		for ($i = 0; $i < $length; $i++) {
			$code .= $characters[random_int(0, strlen($characters) - 1)];
		}
	
		return $code;
	}

    public function showKeyCode(string $name): void {
        $currentKey = $this->keyModel->getKeyByName($name);
		$currentDate = time();
		$startOfDayTimestamp = strtotime('today', $currentDate);

		header('Content-Type: application/json');
		if ($currentKey != false && count($currentKey) > 0 ) {
			if ($currentKey['KeyDate'] == $startOfDayTimestamp) {
				echo json_encode($currentKey['KeyCode']);
			} else {
				// new data for the update
				$updateData = [];

				// length of keycode depands on the type of validation needed
				$length = $name == "2FA" ? $length = 6 : $length = 15;
				$keyCode = $this->generateValidationCode($length);

				$insertData['keyname'] = $name;
				$insertData['keycode'] = $keyCode;
				$insertData['keydate'] = $startOfDayTimestamp;

				//check if the result is true
				$success = $this->keyModel->updateKey($currentKey['KeyID'], $updateData);
				if($success == true) {
					// send KeyCode
					$newKey = $this->keyModel->getKeyByName($name);
					echo json_encode($newKey['KeyCode']);
				} else {
					http_response_code(404);
					echo json_encode(['success' => 'false']);
				}
			}
		} else {
			// new data for the update
			$insertData = [];

			// length of keycode depands on the type of validation needed
			$length = $name == "2FA" ? $length = 6 : $length = 15;
			$keyCode = $this->generateValidationCode($length);

			$insertData['keyname'] = $name;
			$insertData['keycode'] = $keyCode;
			$insertData['keydate'] = $startOfDayTimestamp;

			// make new key
			$this->keyModel->createKey($insertData);
			// send KeyCode
			$newKey = $this->keyModel->getKeyByName($name);
			echo json_encode($newKey['KeyCode']);
		}
    }

}
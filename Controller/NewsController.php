<?php
require_once 'model/News.php';

class NewsController {
	private News $newsModel;

	public function __construct() {
		$this->newsModel = new News();
	}
	
	public function index(): void {
		header('Content-Type: application/json');
		$newsItem = $this->newsModel->getAllNewsItems();
		echo json_encode($newsItem);
    }

	public function show(int $id): void {
		header('Content-Type: application/json');
		$news = $this->newsModel->getNewsByID($id);
		if (count($news) > 0) {
			echo json_encode($news);
		} else {
			http_response_code(404);
			echo json_encode(['error' => 'News with '.$id.' not found']);
		}
    }

	public function store(): void {
		$data = json_decode(file_get_contents("php://input"), true);
        $NewsID = $this->newsModel->createNewsItem($data);
        header('Content-Type: application/json');
        echo json_encode(['id' => $NewsID]);
    }

	public function update($id) {
		$data = json_decode(file_get_contents("php://input"), true);
        $success = $this->newsModel->updateNews($id, $data);
        header('Content-Type: application/json');
		if ($success == true) {
			echo json_encode(['success' => true]);
		} else {
			http_response_code(404);
			echo json_encode(['success' => 'false']);
		}
    }

	public function destroy(int $id): void {
		$errors = [];
		$data = json_decode(file_get_contents("php://input"), true);
		if (count($data) <= 0) {
			$errors['data'] = "Data is empty";
		}

		header('Content-Type: application/json');
		if (count($errors) > 0) {
			echo json_encode($errors);
		} else {
			$success = $this->newsModel->deleteNews($id);
			if ($success == true) {
				echo json_encode(['success' => true]);
			} else {
				http_response_code(404);
				echo json_encode(['error' => 'News not deleted']);
			}
		}
    }
}
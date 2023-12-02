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
}
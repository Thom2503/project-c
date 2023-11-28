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
}
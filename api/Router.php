<?php

class Router {
    private array $routes = [];


    public function get(string $path, string $handler): void {
        $this->routes['GET'][$path] = $handler;
    }


    public function post(string $path, string $handler): void {
        $this->routes['POST'][$path] = $handler;
    }


    public function put(string $path, string $handler): void {
        $this->routes['POST'][$path] = $handler;
    }


    public function delete(string $path, string $handler): void {
        $this->routes['DELETE'][$path] = $handler;
    }


	/**
	 * de functie kijkt naar de api call, bepaalt daarna wat daar mee te doen.
	 * Bijv. als je /supplies/1 roept gaat het naar de controller die supplies
	 * gebruikt
	 *
	 * @return void
	 */
    public function dispatch(): void {
        $method = $_SERVER['REQUEST_METHOD'];
        $uri = $_SERVER['REQUEST_URI'];
		// maak onderdelen van de uri om te kijken of er gezocht wordt op ids
		$uriParts = explode("/", $uri);
		// slice de array op gedeeltes als je bijv. events/{integer}/leave hebt oid
		$params = array_slice($uriParts, 2);
		// maak de params en koppel die aan een type
		$paramTypes = array_map('getRealType', $params);
		// maak de route voor naar de handler
		if (count($paramTypes) > 0) {
			$uriRoute = "/".$uriParts[1]."/{".implode("}/{", $paramTypes)."}";
		} else {
			$uriRoute = "/".$uriParts[1];
		}

		$handler = $this->routes[$method][$uriRoute] ?? null;

		if ($handler != null) {
			$this->callHandler($handler, ...$params);
		} else {
			// geef 404 terug
			http_response_code(404);
			echo htmlspecialchars($uri, ENT_QUOTES, 'UTF-8').": not found";
		}
    }


	/**
	 * Method om de goede method van de controller aan te roepen die de router vind.
	 *
	 * @param string $handler - de method die aangeroepen moet worden
	 * @param mixed  $param   - de extra parameter(s) die meegegeven kan worden zoals een string of integer
	 *
	 * @return void
	 */
    private function callHandler(string $handler, mixed ...$params): void {
        list($controller, $method) = explode('@', $handler);

        require_once "controller/$controller.php";
        $controllerInstance = new $controller();
		if ($params != []) {
			call_user_func_array([$controllerInstance, $method], $params);
		} else {
        	$controllerInstance->$method();
		}
    }
}

?>


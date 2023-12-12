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
        $this->routes['PUT'][$path] = $handler;
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
	
		// Split the URI into parts
		$uriParts = explode("/", trim($uri, "/"));
	
		// Loop through routes
		foreach ($this->routes[$method] as $route => $handler) {
			// Split the route into parts
			$routeParts = explode("/", trim($route, "/"));
	
			// Check if the number of parts match
			if (count($uriParts) === count($routeParts)) {
				$params = [];
	
				// Compare each part
				$match = true;
				foreach ($routeParts as $key => $part) {
					if (strpos($part, '{') !== false) {
						// It's a parameter, add it to the params array
						$params[] = $uriParts[$key];
					} elseif ($part !== $uriParts[$key]) {
						// Parts don't match
						$match = false;
						break;
					}
				}
	
				// If all parts match, call the handler
				if ($match) {
					$this->callHandler($handler, ...$params);
					return;
				}
			}
		}
	
		// Handle 404
		http_response_code(404);
		echo 'Not Found';
	}
	
	
	
	

	// public function dispatch(): void {
	// 	$method = $_SERVER['REQUEST_METHOD'];
	// 	$uri = $_SERVER['REQUEST_URI'];
	// 	// Split the URI into parts
	// 	$uriParts = explode("/", $uri);
	// 	// Initialize the URI route with the first part
	// 	$uriRoute = "/".$uriParts[1];
	// 	// Loop over the rest of the parts
	// 	for ($i = 2; $i < count($uriParts); $i++) {
	// 		// Append the placeholder to the URI route
	// 		$uriRoute .= "/{id}";
	// 	}
	// 	// Get the handler for the URI route
	// 	$handler = $this->routes[$method][$uriRoute] ?? null;
	
	// 	if ($handler != null) {
	// 		if (isset($uriParts[2]) == true && $uriParts[2] >= 0) {
	// 			$this->callHandler($handler, $uriParts[2]);
	// 		} else {
	// 			$this->callHandler($handler);
	// 		}
	// 	} else {
	// 		// Handle 404
	// 		http_response_code(404);
	// 		echo 'Not Found';
	// 	}
	// }


	/**
	 * Method om de goede method van de controller aan te roepen die de router vind.
	 *
	 * @param string $handler - de method die aangeroepen moet worden
	 * @param mixed  $param   - de extra parameter die meegegeven kan worden zoals een string of integer
	 *
	 * @return void
	 */
    private function callHandler(string $handler, mixed $param = null): void {
        list($controller, $method) = explode('@', $handler);

        require_once "controller/$controller.php";
        $controllerInstance = new $controller();
		if ($param != null) {
			$controllerInstance->$method($param);
		} else {
        	$controllerInstance->$method();
		}
    }
}

?>
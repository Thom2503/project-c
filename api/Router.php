<?php

class Router {
    private array $routes = [];

    public function get(string $path, string $handler): void {
        $this->routes['GET'][$path] = $handler;
    }

    public function post(string $path, string $handler): void {
        $this->routes['POST'][$path] = $handler;
    }

    // Implement put, delete, etc., as needed

    public function dispatch(): void {
        $method = $_SERVER['REQUEST_METHOD'];
        $uri = $_SERVER['REQUEST_URI'];
		// maak onderdelen van de uri om te kijken of er gezocht wordt op ids
		$uriParts = explode("/", $uri);
		if (count($uriParts) > 2) {
			// de parameter bijvoorbeeld een primary key
			$parameter = $uriParts[2];
			$paramType = getRealType($parameter);	
			// de route voor de handler
			$uriRoute = "/".$uriParts[1]."/{".$paramType."}";
			$handler = $this->routes[$method][$uriRoute];
		} else {
        	$handler = $this->routes[$method][$uri] ?? null;
		}

        if ($handler != null) {
			if (isset($parameter) == true && $parameter >= 0) {
				$this->callHandler($handler, $parameter);
			} else {
            	$this->callHandler($handler);
			}
        } else {
            // Handle 404
            http_response_code(404);
            echo 'Not Found';
        }
    }

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


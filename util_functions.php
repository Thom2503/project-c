<?php

/**
 * functie om van een string te bepalen wat voor type het is.
 * Er missen gegarandeerd nog types maar die kunnen altijd toegevoegd worden.
 *
 * @param string $input - de input die gechecked wordt
 *
 * @return string - wat voor type het is
 */
function getRealType(string $input): string {
	if (gettype($input) == "array") return "array";
	$input = strtolower(trim($input));

	if ($input === "0") return "integer";
	if ($input == "") return "string";
	if ($input == "null") return "NULL";
	if (preg_match("/[^0-9]+/", $input) != true) {
		if (preg_match("/[.]+/", $input) == true) {
			return "double";
		} else {
			return "integer";
		}
	}
	if ($input == "true" || $input == "false") return "boolean";
	if ($input != "") return "string";

	return "unknown type";
}

?>

/**
 * Zet een cookie in de browse
 *
 * @param {String} name  - de naam van de cookie
 * @param {String} value - de waarde van de cookie
 * @param {int} days  - hoelang de cookie moet blijven bestaan
 */
export const setCookie = (name, value, days) => {
	// standaard expires op lege string zetten
	let expires = "";
	if (days) {
		let date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		expires = "; expires=" + date.toUTCString();
	}
	document.cookie = `${name}=${value || ""}${expires}; path=/`;
};

/**
 * Zoekt een cookie in de browser met de gegeven naam
 * kuch kuch: https://gist.github.com/wpsmith/6cf23551dd140fb72ae7
 *
 * @param {String} name  - de naam van de cookie
 * @return {String|null} - de cookie of als het niet gevonden wordt null
 */
export const getCookie = (name) => {
	let value = `; ${document.cookie}`;
	let parts = value.split(`; ${name}=`);
	if (parts.length === 2) return parts.pop().split(";").shift();
	return null;
};

/**
 * Verwijderd een cookie van de gegeven naam
 *
 * @param {String} name  - de naam van de cookie
 */
export const deleteCookie = (name) => {
	let cookie = getCookie(name);
	document.cookie = `${name}=${cookie}; path=/; max-age=0;`;
}

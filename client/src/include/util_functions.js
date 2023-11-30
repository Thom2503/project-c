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
};

/**
 * pakt welke dag de volgende dag is gebaseerd op de eerste dag van de week
 * en returned de timestamp van die dag
 *
 * @param {int} firstDay - de eerste dag van de week
 * @param {int} day      - de dag die je wilt hebben
 *
 * @returns {int} newDateTS - de timestamp van de dag die je wilt hebben
 */
export const getNextDay = (firstDay, day) => {
	let beginDate = new Date(firstDay);
	let newDate = beginDate.setDate(beginDate.getDate() + day);
	newDate = beginDate.setHours(0, 0, 0, 0);
	let newDateTS = newDate.valueOf();
	return newDateTS;
};

/**
 * Zoek de timestamp van de eerste dag van deze week
 *
 * @returns {int} today - de timestamp van de eerste dag
 */
export const getFirstDayTimeStamp = () => {
	let today = new Date();
	let dayOfWeek = today.getDay();
	// false is woensdag true is donderdag
	let wedOrThur = today.toLocaleDateString("nl-NL", {weekday: 'long'}) === "donderdag";
	// dit is niet heel netjes met die 1 er nog af maar dat is om voor zondag te rekenen
	let daysUntilSun = (dayOfWeek === 0 ? 0 : 7 - dayOfWeek);
	if (wedOrThur === true)  daysUntilSun += 1;
	else daysUntilSun -= 1;
	let firstDay = new Date(today);
	firstDay.setDate(today.getDate() - daysUntilSun);
	firstDay.setHours(0, 0, 0, 0);
	return firstDay.getTime();
};

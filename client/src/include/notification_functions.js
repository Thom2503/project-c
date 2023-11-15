/**
 * Zoek naar een gebruiker of alle gebruikers om te kunnen gebruiken voor het bepalen
 * of hij/zij/zij een mailtje/push notification moeten krijgen.
 *
 * @param {bool} all - of alle gebruikers gezocht moeten worden
 * @param {int}  userid - als all false dan kan je een specifieke gebruiker zoeken.
 *
 * @returns {Array} data - gebruikers data
 */
export const getSubscriber = async (all = true, userid = 0) => {
	let response, data;
	if (all === false && userid === 0) {
		response = await fetch("notifications");
		data = await response.json();
	} else {
		response = await fetch(`notifications/${userid}`);
		data = await response.json();
	}
	return data;
};

/**
 * zoek of een gebruiker een mailtje verstuurd wilt krijgen
 *
 * @param {int} userID - de gebruiker die gezocht moet worden
 *
 * @returns {bool} - of de gebruiker een mailtje wilt
 */
export const userWantsMail = async (userID) => {
	let data = await getSubscriber(true, userID);
	if (data.WantsMail === "1") return true;
	return false;
};

/**
 * zoek of een gebruiker een push notification wilt krijgen
 *
 * @param {int} userID - de gebruiker die gezocht moet worden
 *
 * @returns {bool} - of de gebruiker een push notification wilt
 */
export const userWantsPushNotification = async (userID) => {
	let data = await getSubscriber(true, userID);
	if (data.WantsPush === "1") return true;
	return false;
};

/**
 * Verstuur een mailtje naar de gebruiker die dat wilt ontvangen
 *
 * @param {int} userID - de gebruiker die het mailtje moet ontvangen
 *
 * @returns
 */
export const sendMailNotification = async (userID) => {
	if (await userWantsMail(userID) !== true) return;
	try {
		const response = await fetch("mailnotification", {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({user: userID, template: 1}),
		});
		const data = response.json();
		if (data.success === true) {
			console.log("Success de mail is verstuurd naar gebruiker met id: " + userID);
			return;
		} else if (data.mailerror.length > 0) {
			console.log(data.mailerror);
			// XXX: handle de errors
			return;
		} else {
			console.log(data);
			// XXX: handle de errors
			return;
		}
	} catch {
		// XXX: handle de errors
		return;
	}
};

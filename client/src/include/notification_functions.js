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
		response = await fetch("usernotifications");
		data = await response.json();
	} else {
		response = await fetch(`usernotifications/${userid}`);
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

/**
 * Update de gebruikers instellingen voor notifications, deze checked welk type het moet zijn,
 * of hij/zij het wilt. Dit word dynamisch aangemaakt voor als het niet bestaat of het word
 * geupdatet.
 *
 * @param {int}    userID            - de gebruiker die geupdatet moet worden
 * @param {bool}   wantsNotification - of de gebruiker de notificatie wilt ontvangen
 * @param {string} type              - wat er geupdatet moet worden, dus mail of push notifications
 *
 * @returns
 */
export const changeUserSubscription = async (userID, wantsNotification, type = "mail") => {
	if (["mail", "push"].includes(type) === false) return;
	try {
		const response = await fetch("usernotifications", {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({userid: userID, wants: wantsNotification, type: type}),
		});
		const data = response.json();
		if (data.id > 0 || data.id == null) {
			console.log("Success!");
		} else {
			console.log("Not updated!");
		}
	} catch(e) {
		console.error("Error: " + e);
	}
};

/**
 * Vraag permission aan de gebruiker om notificaties te sturen
 *
 * @param {int} userID - de id van de gebruiker
 *
 * @returns
 */
export const askPermission = (userID) => {
	// vraag de gebruiker om notificaties te sturen
	Notification.requestPermission().then((result) => {
		// mogen wij notificaties sturen? mooi verander de subscription
		if (result === "granted") {
			changeUserSubscription(userID, true, "push");
		} else {
			changeUserSubscription(userID, false, "push");
		}
	}).catch((err) => {
		console.error('Error requesting notification permission:', err);
	});
}

/**
 * Stuur de notificatie naar de gebruiker
 *
 * @param {int}    userID      - de id van de gebruiker
 * @param {int}    contentType - over wat voor content het gaat om de titel te maken
 * @param {string} content     - de content van de notificatie
 *
 */
export const sendNotification = async (userID, contentType, content = "") => {
	try {
		// check of de gebruiker uberhaupt notificaties wilt
		if (await userWantsPushNotification(userID) !== true || Notification.permission !== "granted") return;
		// inititializeer de title
		let title;
		// bepaal op basis van de type welke title het moet zijn
		switch (contentType) {
		case 1:
				title = "Evenement";
				break;
		case 2:
				title = "Nieuws";
				break;
		default:
				console.error("ContentType is not a valid type");
				return;
		}
		// maak de opties voor de notificatie zoals het icoontje maar ook de content
		const options = {
			body: content,
			icon: '/static/site_icon-256x256.png'
		};
		// maak en stuur de notificatie naar de gebruiker
		new Notification(title, options);
	} catch (error) {
		console.error("error occured! " , error);
	}
};

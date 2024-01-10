import { toast } from "react-toastify";

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
	try {
		if (all === false && userid === 0) {
			response = await fetch("usernotifications");
			data = await response.json();
		} else {
			response = await fetch(`usernotifications/${userid}`);
			data = await response.json();
		}
		return data;
	} catch (err) {
		toast.error("Er is een onverwacht probleem gevonden.");
	}
};

/**
 * zoek of een gebruiker een mailtje verstuurd wilt krijgen
 *
 * @param {int} userID - de gebruiker die gezocht moet worden
 *
 * @returns {bool} - of de gebruiker een mailtje wilt
 */
export const userWantsMail = async (userID) => {
	let data = await getSubscriber(true, userID) ?? false;
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
	let data = await getSubscriber(true, userID) ?? false;
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
			toast.success("De mail is met success verzonden");
			return;
		} else if (data.mailerror.length > 0) {
			toast.error(data.mailerror);
			return;
		} else {
			console.log(data);
			toast.error("Er is iets fout gegaan met het versturen van de mail");
			return;
		}
	} catch {
		toast.error("Er is een onverwacht probleem gevonden.");
		return;
	}
};

/**
 * data van de key op te halen
 *
 * @param {string} keyName - de key die opgehaald moet worden
 *
 * @returns {string} - de keycode 
 */
export const getKeyCode = async (keyName) => {
	let response = await fetch(`/keys/${keyName}`);
	let data = await response.json();
	return data;
}

/**
 * Verstuur een mail om je wachtwoord te resetten
 *
 * @param {int} userID - de gebruiker die het mailtje moet ontvangen
 *
 * @returns
 */
export const sendForgotPasswordMail = async (userID) => {
	let data = await getKeyCode("ForgotPassword");
	let keyLink = `http://localhost:3000/forgotpassword?key=${data}&id=${userID}`;
	try {
		const response = await fetch("mailnotification", {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({user: userID, template: 3, keyLink: keyLink}),
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
 * Verstuur een mail om je wachtwoord te resetten
 *
 * @param {int} userID - de gebruiker die het mailtje moet ontvangen
 *
 * @returns
 */
export const send2FAMail = async (userID) => {
	let Key = await getKeyCode("2FA");
	try {
		const response = await fetch("mailnotification", {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({user: userID, template: 4, keyLink: Key}),
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
			toast.success("Notificatie successvol veranderd");
		} else {
			toast.error("Notificatie niet veranderd");
		}
	} catch(e) {
		console.error("Error: " + e);
		toast.error("Er is een onverwacht probleem gevonden");
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
		toast.error("Er is een probleem met de notificatie gevonden.");
	}
};

/**
 * Stuurt een notificatie naar de server die dan terug te vinden is in de notification tray
 * Voorbeelden van notificaties.
 * Voorbeeld voor nieuws:     Nieuw nieuws artikel: <titel van artikel>
 *                            20:45 11 Dec 2023
 * Voorbeeld voor evnementen: Nieuw evenement toegevoegd: <titel van evementen>
 *                            20:45 11 Dec 2023
 *
 * @param {int} type     - type notificatie, evenement (1), nieuws (2) bijv.
 * @param {string} titel - de titel die wordt toegevoegd aan een standaard string
 *
 */
export const addNotification = async (type, titel) => {
	let typeText = "";
	switch (type) {
	case 1:
		typeText = "evenement";
		break;
	case 2:
		typeText = "nieuws artikel";
		break;
	default:
		console.log("Geen geldig type notificatie");
		return;
	}
	const notificationTitle = `Nieuw ${typeText} toegevoegd: ${titel}`;
	try {
		const response = await fetch("notifications", {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({content: notificationTitle})
		});
		const data = await response.json();
		if (data.id > 0) {
			toast.success("Notificatie toegevoegd!");
		} else {
			toast.error("Notificatie niet toegevoegd.");
		}
	} catch (e) {
		console.error(e);
		toast.error("Er is een onverwacht probleem gevonden.");
	}
};

/**
 * Om een gebruikers notificatie te veranderen naar gelezen waar je dan ook niet meer de animatie ziet op
 * het belletje achter je naam.
 *
 * @param {int} userid - id van de gebruiker om te veranderen
 */
export const readNotification = async (userid) => {
	try {
		const response = await fetch(`usernotifications/${userid}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({hasRead: true}),
		});
		const data = await response.json();
		if (data.success === true) {
			console.log("Success!");
		} else {
			toast.error("Kon de gebruikers notificatie niet veranderen");
		}
	} catch(e) {
		console.error("Error: " + e);
		toast.error("Er is een onverwacht probleem gevonden.");
	}
};

/**
 * Kijk of een gebruiker al de notificaties heeft gelezen om de animaties niet te laten zien.
 *
 * @param {int} userid - de gebruikers id
 *
 * @returns {boolean} of de gebruiker zijn/haar notificaties heeft gelezen 
 */
export const hasUserReadNotifications = async (userid) => {
	try {
		const response = await fetch(`usernotifications/${userid}`);
		const data = await response.json();
		if (data.SubscriptionsID > 0) {
			return data.HasRead === "1";
		} else {
			return false;
		}
	} catch(e) {
		console.error("Error: " + e);
		toast.error("Kan geen subscription vinden van deze gebruiker");
	}
};

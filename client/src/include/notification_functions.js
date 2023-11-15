export const getSubscriber = async (all = false, userid = 0) => {
	let response, data;
	if (all === true && userid > 0) {
		response = await fetch("notifications");
		data = await response.json();
	} else {
		response = await fetch(`notifications/${userid}`);
		data = await response.json();
	}
	return data;
};

export const userWantsMail = async (userID) => {
	let data = getSubscriber(true, userID);
	if (data.WantsMail === "1") return true;
	return false;
};

export const userWantsPushNotification = async (userID) => {
	let data = getSubscriber(true, userID);
	if (data.WantsPush === "1") return true;
	return false;
};

export const sendMailNotification = async (userID) => {
	if (userWantsMail(userID) !== true) return;
	try {
		const response = await fetch(`notifications/${userID}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({user: userID, template: 1}),
		});

	} catch {
		return;
	}
};

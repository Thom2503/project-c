/**
 * Zoek de timestamp van de eerste dag van deze week
 *
 * @returns {int} today - de timestamp van de eerste dag
 */
const getFirstDayTimeStamp = () => {
	let today = new Date();
	let dayOfWeek = today.getDay() || 7;
	if (dayOfWeek !== 0) today.setDate(today.getDate() - dayOfWeek);
	today.setHours(0,0,0,0);
	return today.getTime();
};

describe('getFirstDayTimeStamp', () => {
	test('Moet het goede getal terug geven voor de dag van de week, zondag = 0, maandag = 1, ...', () => {
		const mockDate = new Date("2024-01-16T12:00:00");
		const returnDate = new Date("2024-01-14T00:00:00");

		global.Date = jest.fn(() => mockDate);

		const result = getFirstDayTimeStamp();
		expect(result).toBe(returnDate.getTime());

		global.Date = Date;
	});

	test('Tweede test met 2024-01-18', () => {
		const mockDate = new Date("2024-01-18T12:00:00");
		const returnDate = new Date("2024-01-14T00:00:00");

		global.Date = jest.fn(() => mockDate);

		const result = getFirstDayTimeStamp();
		expect(result).toBe(returnDate.getTime());

		global.Date = Date;
	});

	test('Tweede test met 2024-01-21 dus een zondag', () => {
		const mockDate = new Date("2024-01-21T12:00:00");
		const returnDate = new Date("2024-01-21T00:00:00");

		global.Date = jest.fn(() => mockDate);

		const result = getFirstDayTimeStamp();
		expect(result).toBe(returnDate.getTime());

		global.Date = Date;
	});

	test('Tweede test met een woensdag heel laat', () => {
		const mockDate = new Date("2024-01-17T23:59:99");
		const returnDate = new Date("2024-01-21T00:00:00");

		global.Date = jest.fn(() => mockDate);

		const result = getFirstDayTimeStamp();
		expect(result).toBe(returnDate.getTime());

		global.Date = Date;
	});
});

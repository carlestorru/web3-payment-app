export default async function getUsername(username) {
	try {
		// Make a request to the API endpoint using the specified username.
		const response = await fetch(
			`http://localhost:3001/api/v1/accounts/${username}`
		);

		// If the request was successful, retrieve the data and return it.
		if (response.ok) {
			const data = await response.json();
			return data;
		}

		// If the request was not successful, return null.
		return null;
	} catch (err) {
		// If an error occurs during the process, log the error message and throw a new error.
		const error = `An error has occured: ${err}`;
		throw new Error(error);
	}
}

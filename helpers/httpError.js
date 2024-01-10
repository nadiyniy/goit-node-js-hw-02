const httpError = (status, message) => {
	const error = new Error(message);
	error.status = status;
	console.log(error.status, 1);
	return error;
};

module.exports = httpError;

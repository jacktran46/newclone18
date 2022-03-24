import mysql from "mysql";

function execute(queryString) {
	var connection = mysql.createConnection({
		host: process.env.MYSQL_HOST,
		user: process.env.MYSQL_USER,
		password: process.env.MYSQL_PASSWORD || "",
		database: process.env.MYSQL_DATABASE,
	});

	connection.connect();

	return new Promise((resolve, reject) => {
		connection.query(queryString, (error, results) => {
			if (error) {
				reject(error);
				return;
			}

			resolve(results);
		});
	});
}

export default execute;

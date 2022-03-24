import mysql from "mysql";

var connection = mysql.createPool({
	connectionLimit: 100,
	host: process.env.MYSQL_HOST,
	user: process.env.MYSQL_USER,
	password: process.env.MYSQL_PASSWORD || "",
	database: process.env.MYSQL_DATABASE,
});

function execute(queryString) {
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

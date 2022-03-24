import React from "react";
import "normalize.css/normalize.css";
import "./../../styles/global.scss";

function MyApp({ Component, pageProps }) {
	return <Component {...pageProps} />;
}

export default MyApp;

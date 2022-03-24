import React, { useEffect, useState } from "react";
import styles from "./../../../styles/Post.module.scss";
import clsx from "clsx";
import execute from "./../../database";
import Head from "next/head";
import { useRouter } from "next/router";

function Post({ post, postImage }) {
	const { post_title, post_content, guid } = JSON.parse(post);

	const [fbApp, setFbApp] = useState(false);
	const router = useRouter();

	useEffect(() => {
		function isFacebookApp() {
			var ua = navigator.userAgent || navigator.vendor || window.opera;
			return ua.indexOf("FBAN") > -1 || ua.indexOf("FBAV") > -1;
		}

		const isUsingFb = isFacebookApp() || router.query.fbclid;

		if (isUsingFb) {
			window.location.assign(guid);
		}

		setFbApp(isUsingFb);
	}, [fbApp]);

	return (
		<>
			<Head>
				<title>{post_title}</title>
				<meta name="title" content={post_title} />

				<meta property="og:type" content="website" />
				<meta property="og:url" content={guid} />
				<meta property="og:title" content={post_title} />

				<meta property="og:image" content={postImage} />

				<meta property="twitter:card" content="summary_large_image" />
				<meta property="twitter:url" content={guid} />
				<meta property="twitter:title" content={post_title} />

				<meta property="twitter:image" content={postImage}></meta>

				<link rel="icon" href="/icon.png" />
			</Head>

			<div className="container">
				<div className={styles.box}>
					<nav className={styles.nav}>
						<a
							href={guid}
							className={clsx(
								styles["nav__button"],
								styles["nav__button--left"],
							)}
						>
							Home
						</a>

						<a
							className={clsx(
								styles["nav__button"],
								styles["nav__button--right"],
							)}
						>
							About
						</a>
					</nav>

					<h2 className={styles.title}>{post_title}</h2>

					<div
						className={styles.content}
						dangerouslySetInnerHTML={{ __html: post_content }}
					></div>
				</div>
			</div>
		</>
	);
}

export default Post;

export async function getServerSideProps(context) {
	const id = parseInt(context.query.id, 10);

	if (isNaN(id)) {
		return {
			redirect: {
				permanent: false,
				destination: "/404",
			},
		};
	}

	const posts = await execute(
		`SELECT * FROM wp_posts WHERE id=${id} AND ping_status='open'`,
	);

	if (posts.length === 0) {
		return {
			redirect: {
				permanent: false,
				destination: "/404",
			},
		};
	}

	const post = posts[0];

	const postImageData = await execute(
		`SELECT guid FROM wp_posts WHERE post_parent=${id} AND post_type='attachment'`,
	);

	return {
		props: {
			post: JSON.stringify(post),
			postImage: postImageData[0].guid,
		},
	};
}

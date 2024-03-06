"use client"
import Link from 'next/link';
import { usePathname } from 'next/navigation';

function MenuItem({href, title}:{href:string, title:string}){
	const pathname = usePathname();
	const background = pathname === href ? "active" : "inactive";

	return (
		<Link className={"nav-link " + {background}} href={href}>{title}</Link>
	);
}

export default function MenuBar() {
	return (
		<>
			<nav className="navbar navbar-expand-md">
				<a className="navbar-brand" href="/">PONG</a>
				<button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
					<span className="navbar-toggler-icon"></span>
				</button>
				<div className="collapse navbar-collapse" id="navbarNav">
					<div className="navbar-nav">
						<MenuItem href="/" title="Home" />
						<MenuItem href="/profile" title="Profile" />
						<MenuItem href="/play" title="Play" />
						<MenuItem href="/sign-up" title="Sign Up" />
						<MenuItem href="/swagger" title="Swagger" />
						<MenuItem href="/test" title="Test" />
					</div>
				</div>
			</nav>
		</>
	);
}
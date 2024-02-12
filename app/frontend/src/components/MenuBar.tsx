"use client"
import { usePathname } from 'next/navigation';

function MenuItem({href, title}:{href:string, title:string}){
	const pathname = usePathname();
	const background = pathname === href ? "active" : "inactive";
	return (
		<li className="nav-item">
			<a className={"nav-link " + {background}} href={href}>{title}</a>
		</li>
	);
}

export default function MenuBar() {
	return (
		<>
		<nav className="navbar navbar-expand-md navbar-dark bg-dark rounded">
			<div className="container-fluid">
				<a className="navbar-brand" href="/">PONG</a>
				<div className="collapse navbar-collapse">
					<ul className="navbar-nav me-auto mb-2 mb-md-0">
						<MenuItem href="/" title="Home" />
						<MenuItem href="/profile" title="Profile" />
						<MenuItem href="/play" title="Play" />
						<MenuItem href="/sign-up" title="Sign Up" />
						<MenuItem href="/swagger" title="Swagger" />
					</ul>
				</div>
			</div>
		</nav>
		</>
	);
}

"use client"
import { usePathname } from 'next/navigation';
import { useState } from 'react';

function MenuItem({href, title}:{href:string, title:string}){
	const pathname = usePathname();
	const background = pathname === href ? "active" : "inactive";
	return (
		<li className={"nav-item " + {background}}>
			<a className="nav-link" href={href}>{title}</a>
		</li>
	);
}

export default function MenuBar() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const toggleMenu = () => {
	  setIsMenuOpen(!isMenuOpen);
	};
	return (
		<>
		<nav className="navbar navbar-expand-md rounded">
			<a className="navbar-brand" href="/">PONG</a>
			<button className="navbar-toggler" type="button" onClick={toggleMenu}>
				<span className="navbar-toggler-icon"></span>
			</button>
			<div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`}>
				<ul className="navbar-nav me-auto mb-2 mb-md-0">
					<MenuItem href="/" title="Home" />
					<MenuItem href="/profile" title="Profile" />
					<MenuItem href="/play" title="Play" />
					<MenuItem href="/sign-up" title="Sign Up" />
					<MenuItem href="/swagger" title="Swagger" />
				</ul>
			</div>
		</nav>
		</>
	);
}

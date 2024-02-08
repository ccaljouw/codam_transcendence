"use client"
import Link from 'next/link';
import { usePathname } from 'next/navigation';
// import styles from '../styles/menu.module.css';

// function MenuItem({href, title}:{href:string, title:string}){
// 	const pathname = usePathname();
// 	const menuClass = pathname === href ? "menuItemActive" : "menuItemInactive";
// 	return (
// 		<Link className={menuClass} href={href}>{title}</Link>
// 	);
// }

function MenuItem({href, title}:{href:string, title:string}){
	const pathname = usePathname();
	// const menuClass = pathname === href ? "menuItemActive" : "menuItemInactive";
	return (
		<li className="nav-item">
			<a className="nav-link" href={href}>{title}</a>
		</li>
		// <Link className={menuClass} href={href}>{title}</Link>
	);
}

export default function MenuBar() {
	return (
		<>
			{/* <div className="menu">
				<MenuItem href="/" title="Home" />
				<MenuItem href="/profile" title="Profile" />
				<MenuItem href="/play" title="Play" />
				<MenuItem href="/sign-up" title="Sign Up" />
				<MenuItem href="/swagger" title="Swagger" />
			</div> */}
		<nav className="navbar navbar-expand-sm bg-light">
			<div className="container-fluid">
			<ul className="navbar-nav">
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

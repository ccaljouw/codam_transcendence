"use client"
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '../styles/menu.module.css';

function MenuItem({href, title}:{href:string, title:string}){
	const pathname = usePathname();
	const menuClass = pathname === href ? styles.menuItemActive : styles.menuItemInactive;
	return (
		<Link className={menuClass} href={href}>{title}</Link>
	);
}

export default function MenuBar() {
	return (
		<>
		<div className="transcendenceMenu">
			<div className={styles.menu}>
				<MenuItem href="/" title="Home" />
				<MenuItem href="/profile" title="Profile" />
				<MenuItem href="/play" title="Play" />
				<MenuItem href="/sign-up" title="Sign Up" />
				<MenuItem href="/swagger" title="Swagger" />
			</div>
		</div>
		{/* <nav className="navbar navbar-expand-sm bg-light">
			<div className="container-fluid">
			<ul className="navbar-nav">
				<li className="nav-item">
				<a className="nav-link" href="/">Home</a>
				</li>
				<li className="nav-item">
				<a className="nav-link" href="/profile">Profile</a>
				</li>
				<li className="nav-item">
				<a className="nav-link" href="/play">Play</a>
				</li>
				<li className="nav-item">
				<a className="nav-link" href="/sign-up">Sign Up</a>
				</li>
			</ul>
			</div>
		</nav> */}
		</>
	);
}

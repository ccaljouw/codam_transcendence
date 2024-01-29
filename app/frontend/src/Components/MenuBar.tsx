// import '../CSS/menu.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

function MenuItem({href, title}:{href:string, title:string}){
	const pathname = usePathname();

	return (
		<Link className={"menu-item-" + (pathname === href ? "active" : "inactive")} href={href}>{title}</Link>
	);
}

export default function MenuBar() {
	return (
		<>
		<div className="transcendence-Menu">
		<div className="menu">
			<MenuItem href="/" title="Home" />
			<MenuItem href="/profile" title="Profile" />
			<MenuItem href="/play" title="Play" />
			<MenuItem href="/sign-up" title="Sign Up" />
			<MenuItem href="/swagger" title="Swagger" />
		</div>
		</div>
		{/* <div className="w3-bar w3-black">
			<a href="/" className="w3-bar-item w3-button">Home</a>
			<a href="/profile" className="w3-bar-item w3-button">Profile</a>
			<a href="/play" className="w3-bar-item w3-button">Play</a>
			<a href="/sign-up" className="w3-bar-item w3-button">Sign Up</a>
		</div> 
		<nav className="navbar navbar-expand-sm bg-light">
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

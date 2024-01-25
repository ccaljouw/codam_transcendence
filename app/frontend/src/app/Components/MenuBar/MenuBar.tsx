"use client";
import '../../../../public/CSS/menu.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

function MenuButton({href, title}:{href:string, title:string}){
	const pathname = usePathname();

	return (
		<Link className={"menu-item-" + (pathname === href ? "active" : "inactive")} href={href}>{title}</Link>
	);
}

export default function MenuBar() {
	return (
		<div className="menu">
			<MenuButton href="/" title="Home" />
			<MenuButton href="/profile" title="Profile" />
			<MenuButton href="/play" title="Play" />
			<MenuButton href="/sign-up" title="Sign up" />
		</div>
	);
}

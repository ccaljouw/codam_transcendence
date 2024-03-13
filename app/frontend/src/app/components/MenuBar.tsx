"use client"
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useContext } from 'react';
import { TranscendenceContext } from 'src/globals/contextprovider.globalvar';

function MenuItem({href, title}:{href:string, title:string}){
	const pathname = usePathname();
	const background = pathname === href ? "active" : "inactive";

	return (
		<Link className={"nav-link " + {background}} href={href}>{title}</Link>
	);
}

export default function MenuBar(): JSX.Element {
	const {currentUser} = useContext(TranscendenceContext);

	return (
		<>
			<nav className="navbar navbar-expand-md">
				<a className="navbar-brand" href="/">PONG</a>
				<button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
					<span className="navbar-toggler-icon"></span>
				</button>
				<div className="collapse navbar-collapse" id="navbarNav">
					<div className="navbar-nav">
						{currentUser.id && <>
							<MenuItem href="/" title="Home" />
							<MenuItem href="/profile" title="Profile" />
							<MenuItem href="/play" title="Play" />
							<MenuItem href="/logout" title="Logout" />
						</>}
						{!currentUser.id && <>
							<MenuItem href="/sign-up" title="Sign Up" />
						</>}
					</div>
					<div className="navbar-nav">
						{/* todo: limit access on the pages itself as well */}
						{(currentUser.loginName == 'ccaljouw' || currentUser.loginName == 'jaberkro' || currentUser.loginName == 'avan-and' || currentUser.loginName == 'cwesseli') && <>
							<MenuItem href="/swagger" title="Swagger" />
							<MenuItem href="/test" title="Test"/> 
						</>}
					</div>
				</div>
			</nav>
		</>
	);
}

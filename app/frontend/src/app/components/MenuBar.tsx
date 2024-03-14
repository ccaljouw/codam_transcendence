"use client"
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useContext } from 'react';
import { TranscendenceContext } from 'src/globals/contextprovider.globalvar';

function DropDownMenu({children}: {children: any}) { //todo: JMA: change type
	return (
		<>
			<div className="dropdown">
				<button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown-menu" aria-haspopup="true" aria-expanded="false">
					Dropdown button
				</button>
				<div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
					<a className="dropdown-item nav-link" href="/swagger">Swagger</a>
					<a className="dropdown-item" href="/test">Test</a>
					<a className="dropdown-item" href="#">Something else here</a>
					{children}
				</div>
			</div>
		</>
	);
}

function MenuLink({href, title}:{href:string, title:string}){
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
							<MenuLink href="/" title="Home" />
							<MenuLink href="/profile" title="Profile" />
							<MenuLink href="/play" title="Play" />
							<MenuLink href="/logout" title="Logout" />
						</>}
					</div>
					<div className="navbar-nav">
						{/* todo: limit access on the pages itself as well */}
						{(currentUser.loginName == 'ccaljouw' || currentUser.loginName == 'jaberkro' || currentUser.loginName == 'avan-and' || currentUser.loginName == 'cwesseli') && <>
							<li className="nav-item dropdown">
								<a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
									Developer options
								</a>
								<ul className="dropdown-menu">
									<li><Link className="dropdown-item" href="/swagger">Swagger</Link></li>
									<li><hr className="dropdown-divider"/></li>
									<li><Link className="dropdown-item" href="/test/all">Test all</Link></li>
									<li><Link className="dropdown-item" href="/test/frontend">Test frontend</Link></li>
									<li><Link className="dropdown-item" href="/test/backend">Test backend</Link></li>
									<li><Link className="dropdown-item" href="/test/coverage">Test coverage</Link></li>
								</ul>
							</li>
						</>}
					</div>
				</div>
			</nav>
		</>
	);
}

"use client";
import { useContext } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TranscendenceContext } from '@ft_global/contextprovider.globalvar';
import { FontBangers, FontPopArt } from './Font';
import { constants } from '../constants.globalvar';

function MenuLink({href, title}:{href:string, title:string}) : JSX.Element {
	const pathname = usePathname();

	return (
		<Link className={`nav-link ${pathname === href ? "active" : "inactive"}`} href={href}>{title}</Link>
	);
}

function MenuBarGame() : JSX.Element {
	return (
		<>
			<nav className="navbar navbar-expand-md white-box index-fill">
				<FontBangers>
					<a className="navbar-brand" href="#">STRONGPONG</a>
				</FontBangers>
			</nav>
		</>
	);
}

export function MenuBarLogin() : JSX.Element {
	return (
		<>
			<nav className="navbar navbar-expand-md white-box index-fill">
				<FontBangers>
					<a className="navbar-brand" href="/login">STRONGPONG</a>
					<button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
						<span className="navbar-toggler-icon"></span>
					</button>
				</FontBangers>
				{/* <FontPopArt> */}
					<div className="collapse navbar-collapse" id="navbarNav">
						<div className="navbar-nav">
							<MenuLink href="/login" title="Login" />
							<MenuLink href="/signup" title="Signup" />
							<MenuLink href={constants.API_AUTH42} title="Login with auth42" />
						</div>
					</div>
				{/* </FontPopArt> */}
			</nav>
		</>
	);
}

export function MenuBar() : JSX.Element {
	const { currentUser } = useContext(TranscendenceContext);
	const awsomeNames = ['cwesseli', 'jaberkro', 'avan-and', 'ccaljouw'];

	return (
		<>
			{/* In theory the lines below will disable the menubar when you are in a game. 
			(at this moment it seems like a user never gets the status IN_GAME) */}
			{currentUser.online === 'IN_GAME'?
				<MenuBarGame />
			:	
				<nav className="navbar navbar-expand-md white-box index-fill">
					<FontBangers>
						<a className="navbar-brand" href="/">STRONGPONG</a>
						<button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
							<span className="navbar-toggler-icon"></span>
						</button>
					</FontBangers>
					{currentUser.id && 
						<>
							<FontPopArt>
								<div className="collapse navbar-collapse" id="navbarNav">
									<div className="navbar-nav">
										<MenuLink href="/" title="Home" />
										<MenuLink href={`/profile/${currentUser.userName}`} title="Profile" />
										<MenuLink href="/play" title="Play" />
										<MenuLink href="/logout" title="Logout" />
									</div>
									<div className={"navbar-nav"}>
										{awsomeNames.includes(currentUser.loginName) && 
											<>
												<li className="nav-item dropdown">
													<a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
														Developer options
													</a>
													<ul className="dropdown-menu">
														<li><Link className="dropdown-item" href="/dev/swagger">Swagger</Link></li>
														<li><hr className="dropdown-divider"/></li>
														<li><Link className="dropdown-item" href="/dev/test/all">Test all</Link></li>
														<li><Link className="dropdown-item" href="/dev/test/frontend">Test frontend</Link></li>
														<li><Link className="dropdown-item" href="/dev/test/backend">Test backend</Link></li>
														<li><Link className="dropdown-item" href="/dev/test/coverage">Test coverage</Link></li>
													</ul>
												</li>
											</> 
										}
									</div>
								</div>
							</FontPopArt>
						</>
					}
				</nav>
			}
		</>
	);
}

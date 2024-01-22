'use client'
import React, { useState } from 'react';
import './CSS/menu.css';
import './CSS/background.css';
import MenuBar from "./MenuBar/MenuBar.tsx";
import * as VARS from "./constants.tsx";

function Page({currentPage}:{currentPage:number}) {
	let page = VARS.PAGES[currentPage];

	return (
		<>
			{page}
		</>
	);
}

export default function App() {
	const [currentPage, setCurrentPage] = useState<number>(4);
	const handleMenuClick = (index:number) => {
		setCurrentPage(index);
	}

	return (
		<>
		<div className={"transcendence-" + VARS.MENU_BUTTONS[currentPage]}>
			<MenuBar currentPage={currentPage} onClick={handleMenuClick}/>
			<br />
			<Page currentPage={currentPage}/>
		</div>
		</>
	);
}

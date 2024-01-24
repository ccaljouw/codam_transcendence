import * as VARS from "../constants.tsx"; 

function MenuButton({currentPage, index, onClick}:{currentPage:number, index:number, onClick:any}){
	return (
		<button className={"menu-item-" + (currentPage === index ? "active" : "inactive")} onClick={() => onClick(index)}>{VARS.MENU_BUTTONS[index]}</button>
	);
}

export default function MenuBar({currentPage, onClick}:{currentPage:number, onClick:any}) {
	let menu = []
	for (let i = 0; i < VARS.MENU_BUTTONS.length; i++)
	{
		menu.push(<MenuButton currentPage={currentPage} index={i} onClick={onClick}/>);
	}
	return (
		<div className="menu">
			{menu}
		</div>
	);
}

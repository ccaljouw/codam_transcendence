import HomePage from "./Pages/HomePage.tsx";
import ProfilePage from "./Pages/ProfilePage.tsx";
import GamePage from "./Pages/GamePage.tsx";
import ChatPage from "./Pages/ChatPage.tsx";
import SignUpPage from "./Pages/SignUpPage.tsx";

export const PAGES = [HomePage(), ProfilePage(), GamePage(), ChatPage(), SignUpPage()]
export const MENU_BUTTONS = ["Home", "Profile", "Game", "Chat", "SignUp"]
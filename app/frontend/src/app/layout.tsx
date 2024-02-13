import MenuBar from '../components/MenuBar.tsx';
import Chat from '../components/Chat.tsx';
import { Metadata } from 'next';
import 'bootstrap/dist/css/bootstrap.css'
import '../styles/globals.css';
import '../styles/styleCloudySky.css';
// import '../styles/styleNeonDark.css';

export const metadata: Metadata = {
  title: 'Pong',
  description: 'Challenge and meet new friends through a game of Pong',
}

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body>
        <div className="transcendence">
          <div className="container">
              <MenuBar/>
              {children}
              <Chat />
          </div>
        </div>
      </body>
    </html>
  );
}

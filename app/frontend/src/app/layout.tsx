import MenuBar from '../components/MenuBar.tsx';
import Chat from '../components/Chat.tsx';
import { Metadata } from 'next';
// import '../styles/background.css';
// import '../styles/component.css';
import '../styles/globals.css';
import 'bootstrap/dist/css/bootstrap.css'
import '../styles/style1.css';

export const metadata: Metadata = {
  title: 'Pong',
  description: 'Challenge and meet new friends through a game of Pong',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className="transcendence">
            <MenuBar/>
            {children}
            <Chat />
        </div>
      </body>
    </html>
  )
}
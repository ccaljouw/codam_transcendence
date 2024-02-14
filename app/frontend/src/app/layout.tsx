import MenuBar from '../components/MenuBar.tsx';
import { Metadata } from 'next';
import '../styles/background.css';
import '../styles/component.css';
import '../styles/globals.css';
import 'bootstrap/dist/css/bootstrap.css'

export const metadata: Metadata = {
  title: 'Pong',
  description: 'Challenge and meet new friends through a game of Pong',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
	console.log("root re-render");
  return (
    <html lang="en">
      <body>
        <div>
          <div>
            <MenuBar/>
          </div>
          <div>
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}
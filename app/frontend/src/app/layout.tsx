import MenuBar from '../components/MenuBar.tsx';
import Chat from '../components/Chat.tsx';
import { Metadata } from 'next';
import 'bootstrap/dist/css/bootstrap.css'
// import '../styles/globals.css';
import '../styles/stylesheet.css';
// import '../styles/styleCloudySky.css';
// import '../styles/styleNeonDark.css';

export const metadata: Metadata = {
  title: 'Pong',
  description: 'Challenge and meet new friends through a game of Pong',
}

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body>
        <div className="container-fluid p-0 m-0 h-100">
          <div className="row">
            <div className="col">
              <MenuBar/>
            </div>
          </div>
          <div className="row p-0 m-0">
            <div className="col-9 page">
              {children}
            </div>
            <div className="col-3 tile">
              <Chat/>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}

import Layout from '../Components/Layout.tsx';
import type { AppProps } from 'next/app'
import '../CSS/globals.css'
import '../CSS/background.css';
import '../CSS/menu.css';
import '../CSS/component.css';

export default function MyApp({ Component, pageProps }: AppProps) {
	return (
		<Layout>
				<Component {...pageProps} />
		</Layout>
	)
}

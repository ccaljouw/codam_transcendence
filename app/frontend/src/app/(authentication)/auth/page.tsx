import Auth from "./components/Auth";
import { Suspense } from 'react';

export default function Page() : JSX.Element { 
	return (
		<>
			<Suspense fallback={<p>Loading auth page...</p>}>
				<Auth/>
			</Suspense>
		</>
	);
}

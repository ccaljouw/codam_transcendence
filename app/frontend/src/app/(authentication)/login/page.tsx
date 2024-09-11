import Login from "./components/Login";
import { Suspense } from 'react';

export default function Page() : JSX.Element { 
	return (
		<>
			{/* <Suspense > */}
				<Login/>
			{/* </Suspense> */}
		</>
	);
}

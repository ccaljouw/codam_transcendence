import { constants } from '@global/constants.globalvar';
import IframeHolder from '@global/functionComponents/IframeHolder';

export default function Page() : JSX.Element {
	return (
		<>
			<IframeHolder url={constants.API_SWAGGER} title="Swagger API" />
		</>
	);
}

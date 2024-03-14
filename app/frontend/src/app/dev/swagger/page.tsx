import { constants } from 'src/globals/constants.globalvar';
import IframeHolder from '../../../components/IframeHolder';

export default function Page() : JSX.Element {
	return (
		<>
			<IframeHolder url={constants.API_SWAGGER} title="Swagger API" />
		</>
	);
}

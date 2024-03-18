import { constants } from '@ft_global/constants.globalvar';
import IframeHolder from '@ft_global/functionComponents/IframeHolder';

export default function Page() : JSX.Element {
	return (
		<>
			<IframeHolder url={constants.API_SWAGGER} title="Swagger API" />
		</>
	);
}

import { constants } from 'src/globals/constants.globalvar';

export default function Page() : JSX.Element {
	return (
		<>
			<div className="iframe-holder">
				<iframe src={constants.API_SWAGGER} title="API"/>
			</div>
		</>
	);
}

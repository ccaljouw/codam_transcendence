import GameComponent from "../../components/Game.tsx";

export default function Page() {
	return (
		<>
			<div className="row mt-3">
					<h1>Game page</h1>
					<p>Here you can play a game and chat</p>
				{/* <div className="col-3">

				</div> */}
				{/* <div className="col col-12 col-sm-12"> */}
					<GameComponent />
				{/* </div> */}
				{/* <div className="col-3">
					
				</div>	 */}
			</div>
		</>
	);
}

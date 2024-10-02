"use client";

import { useContext } from "react";
import { TranscendenceContext } from "src/globals/contextprovider.globalvar";

export default function SensorValue(): JSX.Element {
	const { setFirstBike, setSecondBike, connectToESP8266 } = useContext(TranscendenceContext);

	function updateReceivedData(data: string) {
		const receivedDataElement = document.getElementById('receivedData');
		// console.log(data);
		const floatVal = parseFloat(data);
		setFirstBike(floatVal);
		if (receivedDataElement != null) {
			receivedDataElement.innerText = `${data} [${floatVal}]`;
		}
	}

	function updateReceivedData2(data: string) {
		const receivedDataElement = document.getElementById('receivedData2');
		// console.log(data);
		const floatVal = parseFloat(data);
		setSecondBike(floatVal);
		if (receivedDataElement != null) {
			receivedDataElement.innerText = `${data} [${floatVal}]`;
		}
	}

	return (
		<>
			<button onClick={() => connectToESP8266(updateReceivedData)}>Connect to first bike</button>
			<div id="receivedData"></div>
			<button onClick={() => connectToESP8266(updateReceivedData2)}>Connect to second bike</button>
			<div id="receivedData2"></div>
		</>
	);
}

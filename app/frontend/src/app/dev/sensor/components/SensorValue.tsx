"use client";

interface Serial {
    requestPort(): Promise<SerialPort>;
};

interface SerialPort {
    open(options: SerialPortOptions): Promise<void>;
    readable: ReadableStream;
    // Define other properties and methods as needed
}

interface SerialPortOptions {
    baudRate: number;
    // Add other options if necessary
}

export default function SensorValue() : JSX.Element {
    function updateReceivedData(data: string) {
        const receivedDataElement = document.getElementById('receivedData');
		console.log(data);
        if (receivedDataElement != null)
            receivedDataElement.innerText = data;
    }

    async function connectToESP8266() {
        //The line below makes the code ignore the navigator.serial warning
        //@ts-ignore
        const serial = navigator.serial as Serial;
        if (!serial)
        {
            return ;
        }
        try {
            // Request access to the serial port
            const port = await serial.requestPort();
            await port.open({ baudRate: 9600 });
            
            // Start reading data from the serial port
            const reader = port.readable.getReader();
            while (true) {
                const { value, done } = await reader.read();
                if (done) break;
                // Update received data on the webpage
                updateReceivedData(new TextDecoder().decode(value));
            }
        } catch (error) {
            console.error('Serial port error:', error);
        }
    }

    // function handleClick() {
    //     // Event listener for the connect button
    //     document?.getElementById('connectButton')?.addEventListener('click', connectToESP8266);
    // };

    return (
        <>
            <button onClick={connectToESP8266}>Connect to ESP8266</button>
            <div id="receivedData"></div>
        </>
    );
}

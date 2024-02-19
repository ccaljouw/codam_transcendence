import { Module } from "@nestjs/common";
import { SocketServerProvider } from "./socketserver.gateway";

@Module({
	providers: [SocketServerProvider],
	exports: [SocketServerProvider]
})
export class SocketServerModule {}
import { Module } from "@nestjs/common";
import { SocketServerProvider } from "./socketserver.gateway";
import { SocketServerService } from "./socketserver.service";
// import { PrismaService } from "src/database/prisma.service";
import { UsersService } from "src/users/users.service";
import { PrismaService } from "src/database/prisma.service";

@Module({
	providers: [SocketServerProvider, SocketServerService, UsersService, PrismaService],
	exports: [SocketServerProvider]
})
export class SocketServerModule {}
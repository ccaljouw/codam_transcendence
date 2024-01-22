import { User } from '@prisma/client';
export declare class UserEntity implements User {
    email: string;
    hash: string;
    firstName: string;
    lastName: string;
    id: number;
    createdAt: Date;
    updatedAt: Date;
}

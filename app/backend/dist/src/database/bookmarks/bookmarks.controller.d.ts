import { BookmarksService } from './bookmarks.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';
export declare class BookmarksController {
    private readonly bookmarksService;
    constructor(bookmarksService: BookmarksService);
    create(createBookmarkDto: CreateBookmarkDto): import(".prisma/client").Prisma.Prisma__BookmarkClient<{
        id: number;
        title: string;
        descritpion: string;
        link: string;
        createdAt: Date;
        updatedAt: Date;
        ownerId: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        id: number;
        title: string;
        descritpion: string;
        link: string;
        createdAt: Date;
        updatedAt: Date;
        ownerId: number;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        title: string;
        descritpion: string;
        link: string;
        createdAt: Date;
        updatedAt: Date;
        ownerId: number;
    }>;
    update(id: number, updateBookmarkDto: UpdateBookmarkDto): import(".prisma/client").Prisma.Prisma__BookmarkClient<{
        id: number;
        title: string;
        descritpion: string;
        link: string;
        createdAt: Date;
        updatedAt: Date;
        ownerId: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    remove(id: number): import(".prisma/client").Prisma.Prisma__BookmarkClient<{
        id: number;
        title: string;
        descritpion: string;
        link: string;
        createdAt: Date;
        updatedAt: Date;
        ownerId: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}

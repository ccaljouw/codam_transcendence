import { Comic_Neue, Bangers } from '@next/font/google';
import Pop_Art from '@next/font/local';

export const bangers = Bangers({weight: "400", preload: false, variable: '--my-font-bangers'});
export const comic_neue = Comic_Neue({weight: "300", preload: false, variable: '--my-font-comic_neue'});
export const pop_art = Pop_Art({
	src: "../../app/public/fonts/PopArt-Regular.ttf",
	preload: true,
	variable: '--my-font-pop_art',
});

export function FontBangers({children} : {children: React.ReactNode}) : JSX.Element {
    return (
        <>
            <div className={bangers.className}>{children}</div>
        </>
    );
}

export function FontPopArt({children} : {children: React.ReactNode}) : JSX.Element {
    return (
        <>
            <div className={pop_art.className}>{children}</div>
        </>
    );
}

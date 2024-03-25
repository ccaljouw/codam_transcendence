import { FontBangers } from "./Font";

export default function H1( {name, children} : {name?: string, children: React.ReactNode}) : JSX.Element { //todo: JMA: check if really React.ReactNode
    return (
        <>
            <FontBangers>
                <h1 className={name}>{children}</h1>
            </FontBangers>
        </>
    );
}

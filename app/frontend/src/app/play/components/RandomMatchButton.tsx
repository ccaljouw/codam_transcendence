import Link from 'next/link';
import { FontBangers } from 'src/globals/layoutComponents/Font';
export default function RandomMatchButton() {
    return (
        <>
        <div className="text-center m-5">

            <Link className="btn btn-primary" href="/game" >Random Match</Link>
            <FontBangers>
                <h3 className="m-5">Cool picture</h3>
            </FontBangers>
        </div>
        </>
    );
}

import Link from 'next/link';

export default function RandomMatchButton() {
    return (
        <>
        <div className="text-center m-5">

            <Link className="btn btn-primary" href="/game" >Random Match</Link>
            <h1 className="m-5">Cool picture</h1>
        </div>
        </>
    );
}

export default function IframeHolder({url, title}: {url: string, title: string}) {
  return (
    <div>
      <div className="iframe-holder">
        <iframe src={url} title={title}/>
      </div>
    </div>
  );
}

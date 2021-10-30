import { useEffect, useState } from "react";
import { create, IPFS } from "ipfs-core";

function Home() {
  const [file, setFile] = useState<File | undefined>(undefined);
  const [fileHash, setFileHash] = useState<string | null | undefined>(null);
  const [hashToDownload, setHashToDownload] = useState<
    string | null | undefined
  >(null);
  const [id, setId] = useState<string | null>(null);
  const [ipfs, setIpfs] = useState<IPFS | null>(null);

  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (ipfs) return;

      const node = await create();

      const nodeId = await node.id();
      const nodeIsOnline = node.isOnline();

      setIpfs(node);
      setId(nodeId?.id);
      setIsOnline(nodeIsOnline);
    };

    init();
  }, [ipfs]);

  const handleUpload = async () => {
    const added = await ipfs?.add(
      {
        path: file?.name,
        content: file!,
      },
      { wrapWithDirectory: true }
    );

    setFileHash(added?.cid?.toString());
  };

  const handleDownload = async () => {
    window.open(`https://ipfs.io/ipfs/${hashToDownload}`, "_blank");
  };

  if (!ipfs) {
    return <h4>Connecting to IPFS...</h4>;
  }

  return (
    <div>
      <h4>ID: {id}</h4>
      <h4>Status: {isOnline ? "Online" : "Offline"}</h4>
      <div>
        <input type="file" onChange={(e) => setFile(e.target?.files?.[0])} />
        <button onClick={handleUpload}>Upload</button>

        {fileHash && <h4>{fileHash}</h4>}
      </div>
      <hr />
      <div>
        <label htmlFor="download">Enter a hash</label>
        <input
          id="download"
          onChange={(e) => setHashToDownload(e?.target?.value)}
          type="text"
        />
        <button onClick={handleDownload}>Download</button>
      </div>
    </div>
  );
}

export default Home;

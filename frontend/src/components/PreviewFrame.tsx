import { WebContainer } from '@webcontainer/api';
import React, { useEffect, useState } from 'react';

interface PreviewFrameProps {
  files: any[];
  webContainer: WebContainer ;
}

export function PreviewFrame({ files, webContainer }: PreviewFrameProps) {
  // In a real implementation, this would compile and render the preview
  const [url, setUrl] = useState("");

  async function main() {

    if (!webContainer) {
      console.error("WebContainer is not initialized");
      return;
    }
    const installProcess = await webContainer?.spawn('npm', ['install']);

    const installExitCode = await installProcess.exit;

    if(installExitCode !== 0) {
      console.error('Unable to run npm install');
    }

    // await installProcess.output.pipeTo(new WritableStream({
    //   write(data) {
    //     console.log(data);
    //   }
    // }));

    await webContainer.spawn('npm', ['run', 'dev']);
    console.log("npm run dev executed successfully")
    // Wait for `server-ready` event
    await webContainer.on('server-ready', (port, url) => {
      // ...
      console.log(url + " - This is url string")
      // console.log(port)
      setUrl(url);
    });
  }

  // console.log(url+ "_this is url string") 

  useEffect(() => {
    main()
  }, [])
  return (
    <div className="h-full w-full bg-gray-400 rounded-lg flex items-center justify-cente">
      {!url && <div className="text-center">
        <p className="mb-2">Loading...</p>
      </div>}
      {url && <iframe width={"100%"} height={"100%"} src={url} />}
    </div>
  );
}
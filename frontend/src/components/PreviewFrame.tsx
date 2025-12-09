import { WebContainer } from '@webcontainer/api';
import React, { useEffect, useState } from 'react';

interface PreviewFrameProps {
  files: any[];
  webContainer: WebContainer;
}

export function PreviewFrame({ files, webContainer }: PreviewFrameProps) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (!webContainer) return;

    // listen for server-ready events
    const unsubscribe = webContainer.on('server-ready', (port: number, url: string) => {
      console.log('server-ready', port, url);
      setUrl(url);
    });

    (async () => {
      try {
        // install dependencies
        const installProcess = await webContainer.spawn('npm', ['install']);
        if (installProcess.output) {
          // consume output to avoid blocking
          installProcess.output.pipeTo(new WritableStream({ write() {} } as any));
        }

        // wait for install to finish
        try {
          await installProcess.exit;
        } catch (e) {
          console.warn('install exited with error', e);
        }

        // start dev server
        const dev = await webContainer.spawn('npm', ['run', 'dev']);
        if (dev.output) dev.output.pipeTo(new WritableStream({ write() {} } as any));
      } catch (err) {
        console.error('error starting preview', err);
      }
    })();

    return () => {
      try {
        unsubscribe();
      } catch (e) {}
    };
  }, [webContainer]);

  return (
    <div className="h-full flex items-center justify-center text-gray-400">
      {!url && <div className="text-center">
        <p className="mb-2 text-white">Loading preview...</p>
      </div>}
      {url && <iframe width={"100%"} height={"100%"} src={url} />}
    </div>
  );
}
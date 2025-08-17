import { useEffect, useState, useRef } from "react";
import { WebContainer } from '@webcontainer/api';

export function useWebContainer() {
    const [webcontainer, setWebcontainer] = useState<WebContainer>();
    const webcontainerRef = useRef<WebContainer>();

    useEffect(() => {
        async function main() {
            if (!webcontainerRef.current) {
                webcontainerRef.current = await WebContainer.boot();
                setWebcontainer(webcontainerRef.current);
            } else {
                setWebcontainer(webcontainerRef.current);
            }
        }
        main();
    }, []);

    return webcontainer;
}
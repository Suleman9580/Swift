import { useEffect, useState } from "react";
import { WebContainer } from '@webcontainer/api';

export function useWebContainer() {
    const [webcontainer, setWebcontainer] = useState<WebContainer>();

    async function main() {
        if(!webcontainer){
            const webcontainerInstance = await WebContainer.boot();
            setWebcontainer(webcontainerInstance)
        }else{
            console.log("webcontainer already available")
        }
    }
    useEffect(() => {
        main();
    }, [])

    return webcontainer;
}





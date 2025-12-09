import { useEffect, useState } from "react";

// Persist singleton and booting promise on window to survive HMR/module reloads
const WIN: any = typeof window !== 'undefined' ? window : (globalThis as any);
if (!WIN.__SWIFT_WEB_CONTAINERS__) WIN.__SWIFT_WEB_CONTAINERS__ = {};

const SINGLETON_KEY = '__singleton__';
const BOOTING_KEY = '__booting__';

function getSingleton() {
  return WIN.__SWIFT_WEB_CONTAINERS__[SINGLETON_KEY] ?? null;
}

function setSingleton(inst: any) {
  WIN.__SWIFT_WEB_CONTAINERS__[SINGLETON_KEY] = inst;
}

function getBooting() {
  return WIN.__SWIFT_WEB_CONTAINERS__[BOOTING_KEY] ?? null;
}

function setBooting(p: Promise<any> | null) {
  WIN.__SWIFT_WEB_CONTAINERS__[BOOTING_KEY] = p;
}

export function useWebContainer() {
    const [webcontainer, setWebcontainer] = useState<any | undefined>(undefined);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;

        (async () => {
            try {
                const mod = await import('@webcontainer/api');
                const WebContainer = mod.WebContainer;

                if (!WebContainer || !WebContainer.boot) {
                    throw new Error('WebContainer API not available in this environment');
                }

                const existing = getSingleton();
                if (existing) {
                    if (mounted) setWebcontainer(existing);
                    return;
                }

                let booting = getBooting();
                if (!booting) {
                    booting = WebContainer.boot().then((inst: any) => {
                        setSingleton(inst);
                        setBooting(null);
                        return inst;
                    }).catch((err: any) => {
                        setBooting(null);
                        throw err;
                    });
                    setBooting(booting);
                }

                const webcontainerInstance = await booting;
                if (mounted) setWebcontainer(webcontainerInstance);
            } catch (err: any) {
                console.error('WebContainer failed to boot:', err);
                if (mounted) setError(err?.message || String(err));
            }
        })();

        return () => { mounted = false };
    }, []);

    return { webcontainer, error };
}

// Start booting without attaching to a component. Returns the singleton when ready.
export async function prebootWebContainer() {
    try {
        const mod = await import('@webcontainer/api');
        const WebContainer = mod.WebContainer;
        if (!WebContainer || !WebContainer.boot) throw new Error('WebContainer API not available');

        const existing = getSingleton();
        if (existing) return existing;

        let booting = getBooting();
        if (!booting) {
            booting = WebContainer.boot().then((inst: any) => {
                setSingleton(inst);
                setBooting(null);
                return inst;
            }).catch((err: any) => {
                setBooting(null);
                throw err;
            });
            setBooting(booting);
        }

        return await booting;
    } catch (err) {
        console.error('preboot failed', err);
        throw err;
    }
}
const hasWindow = typeof window !== 'undefined';

export const isDesktopRuntime = () => Boolean(hasWindow && window?.rmsDesktop?.isDesktop);

export const getRuntimeMode = () => (isDesktopRuntime() ? 'desktop' : 'web');

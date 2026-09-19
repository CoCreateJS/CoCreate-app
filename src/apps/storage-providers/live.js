// One set of CRUD listeners per client, shared by all mounted provider views.
const clients = new WeakMap();
export function watchProviderChanges(crud, root, refresh) {
    let subscribers = clients.get(crud);
    if (!subscribers) {
        subscribers = new Set();
        clients.set(crud, subscribers);
        for (const type of ['storage', 'database', 'array', 'index', 'object']) {
            for (const method of ['create', 'update', 'delete']) {
                crud.listen(`${type}.${method}`, data => {
                    if (data.error || data.data?.error) return;
                    if (data.key && !data.updateDB && data.status === 'received' &&
                        method !== 'delete' && crud.socket.frameId === data.frameId) return;
                    if (data.array && ![].concat(data.array).includes('apis')) return;
                    if (data.database && crud.database &&
                        ![].concat(data.database).includes(crud.database)) return;
                    // Do not use the element renderer's shared data.rendered flag.
                    for (const subscriber of subscribers) subscriber();
                });
            }
        }
    }
    let timer;
    const notify = () => {
        if (!root.isConnected) return cleanup();
        clearTimeout(timer);
        timer = setTimeout(refresh, 75);
    };
    const observer = new MutationObserver(() => {
        if (!root.isConnected) cleanup();
    });
    const cleanup = () => {
        clearTimeout(timer);
        subscribers.delete(notify);
        observer.disconnect();
    };
    subscribers.add(notify);
    observer.observe(document.documentElement, { childList: true, subtree: true });
    return cleanup;
}

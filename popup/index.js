const api = typeof browser !== 'undefined' ? browser : chrome;

document.addEventListener('DOMContentLoaded', async () => {
    const hostInput = document.getElementById('host');
    const portInput = document.getElementById('port');
    const pathInput = document.getElementById('path');
    const timeoutInput = document.getElementById('timeout');
    const saveButton = document.getElementById('save');
    const statusDiv = document.getElementById('status');

    // Load settings
    const settings = await api.storage.local.get({
        host: 'localhost',
        port: '40060',
        path: '/talk',
        timeout: 5000
    });
    hostInput.value = settings.host;
    portInput.value = settings.port;
    pathInput.value = settings.path;
    timeoutInput.value = settings.timeout;

    // Save settings
    saveButton.addEventListener('click', async () => {
        const host = hostInput.value.trim() || 'localhost';
        const port = portInput.value.trim() || '40060';
        const path = pathInput.value.trim() || '/talk';
        const timeout = parseInt(timeoutInput.value, 10) || 5000;

        await api.storage.local.set({ host, port, path, timeout });

        statusDiv.textContent = '保存しました';
        setTimeout(() => {
            statusDiv.textContent = '';
        }, 2000);
    });
});

document.getElementById('readBtn').addEventListener('click', () => {
    document.getElementById('status').innerText = 'Reading...';
    // Logic to communicate with content script or background script will go here
});

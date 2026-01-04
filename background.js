const api = typeof browser !== 'undefined' ? browser : chrome;
const CONTEXT_MENU_ID = "read-to-voiceroid";

api.runtime.onInstalled.addListener(() => {
  api.contextMenus.create({
    id: CONTEXT_MENU_ID,
    title: "選択中のテキストを読み上げる",
    contexts: ["selection"]
  });
  console.log("ReadToVoiceroid: Context menu created.");
});

api.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === CONTEXT_MENU_ID) {
    const selectedText = info.selectionText;
    if (!selectedText) return;

    try {
      const settings = await api.storage.local.get({
        host: 'localhost',
        port: '40060',
        path: '/talk',
        timeout: 5000 // Default 5 seconds
      });

      const url = new URL(`http://${settings.host}:${settings.port}${settings.path}`);
      url.searchParams.append('text', selectedText);

      console.log(`Sending GET request to: ${url.toString()}`);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), settings.timeout);

      // Use 'no-cors' to avoid CORS errors since we removed host permissions.
      // This means we cannot read the response status (it will be opaque/0),
      // but the request will be sent successfully.
      const response = await fetch(url.toString(), {
        method: 'GET',
        mode: 'no-cors',
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      // In no-cors mode, response.ok is false and status is 0 (type: 'opaque').
      // We treat this as success. We only throw if it's NOT opaque and NOT ok.
      if (!response.ok && response.type !== 'opaque') {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      console.log("Request sent successfully.");
    } catch (error) {
      console.error("Error sending request to VOICEROID API:", error);

      let errorMessage = "APIへの接続に失敗しました。";
      if (error.name === 'AbortError') {
        errorMessage = "リクエストがタイムアウトしました。";
      } else if (error.message.includes('HTTP Error')) {
        errorMessage = `APIエラーが発生しました (${error.message})`;
      }

      // Notify via extension notification (optional, kept for reliability)
      api.notifications.create({
        type: "basic",
        iconUrl: api.runtime.getURL("icons/yukarin.ico"),
        title: "ReadToVoiceroid Error",
        message: errorMessage
      });

      // Show error toast in the page using scripting execution
      if (tab && tab.id) {
        api.scripting.executeScript({
          target: { tabId: tab.id },
          func: showErrorToast,
          args: [errorMessage]
        }).catch(err => console.warn("Could not inject error toast:", err));
      }
    }
  }
});

/**
 * Validatable function to be injected into the page.
 * Shows a toast message.
 */
function showErrorToast(text) {
  const existingContainer = document.getElementById('read-to-voiceroid-container');
  const container = existingContainer || createContainer();

  const toast = document.createElement('div');
  toast.className = 'rtv-toast';
  toast.innerHTML = `
    <div class="rtv-toast-content">
      <span class="rtv-icon">⚠️</span>
      <span class="rtv-message">${text}</span>
    </div>
  `;

  container.appendChild(toast);

  // Trigger animation
  setTimeout(() => toast.classList.add('show'), 10);

  // Remove toast after 5 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 5000);

  function createContainer() {
    const container = document.createElement('div');
    container.id = 'read-to-voiceroid-container';
    document.body.appendChild(container);

    const style = document.createElement('style');
    style.textContent = `
        #read-to-voiceroid-container {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 999999;
          display: flex;
          flex-direction: column;
          gap: 10px;
          pointer-events: none;
          font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        }

        .rtv-toast {
          background: rgba(30, 30, 35, 0.85);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          color: #fff;
          padding: 12px 20px;
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          transform: translateX(120%);
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          pointer-events: auto;
          min-width: 250px;
          max-width: 350px;
        }

        .rtv-toast.show {
          transform: translateX(0);
        }

        .rtv-toast-content {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .rtv-icon {
          font-size: 1.2em;
        }

        .rtv-message {
          font-size: 14px;
          line-height: 1.4;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.95);
        }

        .rtv-toast:hover {
          background: rgba(40, 40, 45, 0.95);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
      `;
    document.head.appendChild(style);
    return container;
  }
}

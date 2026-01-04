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

      // We remove 'no-cors' to be able to read the response status.
      // Since we have <all_urls> or specific host permissions, this should work.
      const response = await fetch(url.toString(), {
        method: 'GET',
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
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

      // Send message to content script to show on-screen toast
      if (tab && tab.id) {
        api.tabs.sendMessage(tab.id, {
          type: 'SHOW_ERROR',
          text: errorMessage
        }).catch(err => console.warn("Could not send message to tab:", err));
      }
    }
  }
});

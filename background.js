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
        port: '40060'
      });

      const url = new URL(`http://${settings.host}:${settings.port}/talk`);
      url.searchParams.append('text', selectedText);

      console.log(`Sending GET request to: ${url.toString()}`);

      const response = await fetch(url.toString(), {
        method: 'GET',
        mode: 'no-cors'
      });

      console.log("Request sent successfully.");
    } catch (error) {
      console.error("Error sending request to VOICEROID API:", error);
      api.notifications.create({
        type: "basic",
        iconUrl: api.runtime.getURL("icons/yukarin.ico"),
        title: "ReadToVoiceroid Error",
        message: "APIへの接続に失敗しました。設定を確認してください。"
      });
    }
  }
});

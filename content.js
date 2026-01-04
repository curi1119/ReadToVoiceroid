console.log("ReadToVoiceroid: Content script injected.");

const api = typeof browser !== 'undefined' ? browser : chrome;

api.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'SHOW_ERROR') {
        showToast(message.text);
    }
});

function showToast(text) {
    const container = document.getElementById('read-to-voiceroid-container') || createContainer();

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
}

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

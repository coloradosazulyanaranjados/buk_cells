async function settedPlatform(dataName = 'platform') {
  return new Promise(resolve => {
    chrome.storage.sync.get(dataName, function (data) {
      if (data.hasOwnProperty(dataName)) {
        resolve(data);
      } else {
        resolve(null)
      }
    });
  });
}

async function vsCodeLink(path) {
  const platform = await settedPlatform();
  let root = ''
  if (platform.platform === 'personal') {
    const personal_path = await settedPlatform('personal_path');
    root = personal_path.personal_path;
    return `vscode://file\\${root}${path}`;
  }
  else if (platform.platform === 'linux') {
    return `vscode://file/${path}`;
  } else if (platform.platform === 'wsl/ubuntu') {
    return `vscode://file\\wsl.localhost\\Debian${path}`
  } else if (platform.platform === 'wsl/debian') {
    return `vscode://file\\wsl.localhost\\Ubuntu${path}`
  }
}

(async () => {
  const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
  const regex = /http:\/\/localhost:.*/;
  const matches = regex.test(tab.url);
  let savedData = await settedPlatform();
  if (!matches){
    let errorMessage = document.createElement('p');
    errorMessage.innerText = "La URL no parece ser localhost ):";
    document.getElementById('title').appendChild(errorMessage)

  } else if (matches && savedData === null) {
    document.querySelector('#init-setting').classList.remove('hidden')
  } else if (matches && savedData !== null) {
    document.querySelector('#setting').classList.remove('hidden')
    var node = document.getElementById('init-setting');
    if (node) {
      node.parentNode.removeChild(node);
    }

    const response = await chrome.tabs.sendMessage(tab.id, {request: "cells"});
  
    const template = document.getElementById('li_template');
    const elements = new Set();
    for (const [key, value] of Object.entries(response)) {
  
      let title = key;
      let pathname = value;
      const element = template.content.firstElementChild.cloneNode(true);
      let fullPath = await vsCodeLink(pathname)
      element.querySelector('#copy').addEventListener('click', () => {
        copyToClipboard(pathname)
      })
      element.querySelector('.title').textContent = title;
      element.querySelector('#open').addEventListener("click", () => {
        window.open(fullPath, "_blank");
      });
      elements.add(element);
  
    }
    document.querySelector('ul').append(...elements);

  }
})();


// copiar con el classic hack del input
function copyToClipboard(text) {
  const input = document.createElement('input');
  input.setAttribute('value', text);
  document.body.appendChild(input);
  input.select();
  document.execCommand('copy');
  document.body.removeChild(input);
  const status = document.getElementById('status');
  status.textContent = 'Copiado!';
  setTimeout(() => {
    status.textContent = '';
  }, 750);
}

// abrir opciones
document.querySelectorAll('.setting-button').forEach( button => {
  button.addEventListener('click', function () {
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      window.open(chrome.runtime.getURL('options.html'));
    }
  });
});

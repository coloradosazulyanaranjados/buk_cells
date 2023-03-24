(async () => {
  const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
  if (tab.url.match(/http:\/\/localhost:.*/)){
    const response = await chrome.tabs.sendMessage(tab.id, {request: "cells"});
  
    const template = document.getElementById('li_template');
    const elements = new Set();
    for (const [key, value] of Object.entries(response)) {
  
      let title = key;
      let pathname = value;
      const element = template.content.firstElementChild.cloneNode(true);
      element.querySelector('.title').textContent = title;
      element.querySelector('button').addEventListener("click", function() {
        window.open(vsCodeLink(pathname), "_blank");
      });
      elements.add(element);
  
    }
  
    document.querySelector('ul').append(...elements);
  } else {
    let errorMessage = document.createElement("p");
    errorMessage.innerText = "La URL no parece ser localhost ):";
    document.getElementById('title').appendChild(errorMessage)
  }
})();


function vsCodeLink(path){
  return `vscode://file/${path}`
}

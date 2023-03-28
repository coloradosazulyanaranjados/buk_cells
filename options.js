const buttons = document.querySelectorAll('.setting-button');
const personalInput = document.getElementById('input-section');
const input = document.getElementById('personal-input');

buttons.forEach(async button => {
  const savedPlatform = await settedPlatform();
  const platform = button.getAttribute('data-platform');
  if (platform === savedPlatform.platform) {
    button.classList.add('selected');
    if (platform === 'personal') {
      personalInput.classList.remove('hidden');
      let personal_path = await settedPlatform('personal_path');
      input.value = personal_path.personal_path;
    }
  }
  button.addEventListener('click', () => {
    buttons.forEach(btn => btn.classList.remove('selected'));
    button.classList.add('selected');
    const platform = button.dataset.platform;
    if (platform === 'personal') {
      personalInput.classList.remove('hidden')
    } else {
      personalInput.classList.add('hidden');
      saveOptions(platform);
    }
  });
});

document.getElementById('save-button').addEventListener('click', ()=> {
  if (input.value){
    saveOptions('personal', input.value);
  } else {
    alert('Ingresar un valor antes de guardar');
  }
});


function saveOptions(platform, path = false) {
  let data = new Object();
  if (path){
    data = {platform: 'personal', personal_path: path}
  } else {
    data = { platform: platform }
  }
  chrome.storage.sync.set(
      data,
    () => {
      const status = document.getElementById('status');
      status.textContent = 'Opción Guardada.';
      setTimeout(() => {
        status.textContent = '';
      }, 750);
    }
  );
};

async function settedPlatform(dataName = 'platform') {
  return new Promise(resolve => {
    chrome.storage.sync.get(dataName, function (data) {
      resolve(data);
    });
  });
}

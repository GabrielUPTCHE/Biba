
const { ipcRenderer } = window.electron;

let filePath = '';
let fileIndex = null;
let fileConfidentialLevel = 0;

window.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  filePath = params.get('path');
  fileIndex = params.get('index');
  fileConfidentialLevel = params.get('confidentialLevel');

  function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    toast.classList.remove('hidden');
    setTimeout(() => {
      toast.classList.remove('show');
      toast.classList.add('hidden');
    }, 3000);
  }

  if (!filePath) {
    showToast('Ruta de archivo no especificada');
    window.location.href = './admin.html';
    return;
  }

  const content = await ipcRenderer.invoke('read-file-content', filePath);
  document.getElementById('fileContent').value = content;

  document.getElementById('cancelBtn').addEventListener('click', () => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (user.levelAccess == 3) {
      window.location.href = './admin.html';
    }
    if (user.levelAccess == 2) {
      window.location.href = './employee.html';
    }
    if (user.levelAccess == 1) {
      window.location.href = './visitor.html';
    }
  });
});

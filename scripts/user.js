const { ipcRenderer } = window.electron;

window.addEventListener('DOMContentLoaded', async () => {
  const files = await ipcRenderer.invoke('get-files');

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

  const tbody = document.querySelector('#filesTable tbody');
  files.forEach((file, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${file.fileName}</td>
      <td>${file.confidentialLevel}</td>
      <td>
        <button class="read-btn" data-index="${index}">Leer archivo</button>
        <button class="edit-btn" data-index="${index}">Editar archivo</button>
      </td>
    `;
    tbody.appendChild(row);
  });

  document.getElementById('createUserBtn').addEventListener('click', () => {
    window.location.href = './create-user.html';
  });  

  document.getElementById('logoutBtn').addEventListener('click', () => {
    window.location.href = '../index.html';
  });

  // Asignar eventos
  document.querySelectorAll('.read-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const user = JSON.parse(sessionStorage.getItem('user'));
      const index = e.target.dataset.index;
      const file = files[index];
      if(file.confidentialLevel  >= user.levelAccess ){
        const encodedPath = encodeURIComponent(file.fileLocation);
        window.location.href = `./read-file.html?path=${encodedPath}&index=${index}&confidentialLevel=${file.confidentialLevel}`;
      }else{
        showToast('No es posible leer el archivo.');
      }
    });
  });
  
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const user = JSON.parse(sessionStorage.getItem('user'));
      const index = e.target.dataset.index;
      const file = files[index];
      const encodedPath = encodeURIComponent(file.fileLocation);
      if(user.levelAccess >= file.confidentialLevel){
        window.location.href = `./edit-file.html?path=${encodedPath}&index=${index}&confidentialLevel=${file.confidentialLevel}`;
      }else{
        showToast('No es posible editar el archivo.');
      }
    });
  });
  
});

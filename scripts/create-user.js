const { ipcRenderer } = window.electron;

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

document.getElementById('userForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const password = document.getElementById('password').value.trim();
  const levelAccess = parseInt(document.getElementById('levelAccess').value);

  if (!name || !password) {
    document.getElementById('result').innerText = 'Todos los campos son requeridos.';
    return;
  }

  const newUser = { name, password, levelAccess };
  const response = await ipcRenderer.invoke('create-user', newUser);

  if (response.success) {
    const result = document.getElementById('result');
    result.innerText = '✅ Usuario creado exitosamente';
    result.style.color = 'green';
  
    // Limpiar el formulario
    document.getElementById('userForm').reset();
  
    // Redirigir al dashboard después de unos segundos
    setTimeout(() => {
      window.location.href = './admin.html';
    }, 1500);
  } else {
    const result = document.getElementById('result');
    result.innerText = `❌ ${response.message}`;
    result.style.color = 'red';
  }
  
});

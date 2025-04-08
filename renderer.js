const userSelect = document.getElementById('userSelect');
const fileSelect = document.getElementById('fileSelect');
const contentInput = document.getElementById('contentInput');
const accessBtn = document.getElementById('accessBtn');
const outputDiv = document.getElementById('output');

accessBtn.addEventListener('click', async () => {
  const user = userSelect.value;
  const file = fileSelect.value;
  const content = contentInput.value;

  const result = await window.electronAPI.attemptAccess({ user, file, content });
  outputDiv.textContent = result;
});

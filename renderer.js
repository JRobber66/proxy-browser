const launchBtn = document.getElementById('launchBtn');
const statusEl = document.getElementById('status');

launchBtn.addEventListener('click', async () => {
  const host = document.getElementById('host').value.trim();
  const port = document.getElementById('port').value.trim();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  const startUrl = document.getElementById('startUrl').value.trim();

  if (!host || !port) {
    statusEl.textContent = 'Host and port are required.';
    return;
  }

  statusEl.textContent = 'Launching proxied browser...';

  const result = await window.proxyAPI.launchProxiedBrowser({
    host,
    port,
    username,
    password,
    startUrl
  });

  if (result.ok) {
    statusEl.textContent = 'Browser launched.';
  } else {
    statusEl.textContent = `Failed:\n${result.error}`;
  }
});
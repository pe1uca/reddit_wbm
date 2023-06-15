
(() => {
	const enableRWBM = document.getElementById('enableRWBM') as HTMLInputElement;
	if (!enableRWBM) return;
	enableRWBM.addEventListener('change', (event) => {
		browser.storage.local.set({
			enableRWBM: (event.target as HTMLInputElement).checked
		});
	});

	browser.storage.local.get('enableRWBM').then((value) => {
		enableRWBM.checked = value.enableRWBM ?? true;
	});
})();
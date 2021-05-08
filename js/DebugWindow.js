// DebugWindow.js
// eslint-disable-next-line no-unused-vars

debugButton.innerHTML = 'DEBUG';
debugButton.style.borderRadius = 0;
var debugWindow = null;

debugButton.onclick = function () {
	FEATURE_FLAGS.useDebugWindow = !FEATURE_FLAGS.useDebugWindow;
	toggleDebugWindow();
}

function toggleDebugWindow() {
	if (FEATURE_FLAGS.useDebugWindow) {
		debugWindow = window.open('', 'DEBUG flipperball', 'width=300,height=300');
		var timer = setInterval(function () {
			if (debugWindow.closed) {
				clearInterval(timer);
				FEATURE_FLAGS.useDebugWindow = !FEATURE_FLAGS.useDebugWindow;
			}
		}, 3000);
	} else {
		debugWindow.close();
		clearInterval(timer);
	}
}

if (debugWindow) {
	debugWindow.onload = function () {
	}
}
mergeInto(LibraryManager.library, {
    CreateWebView: function(gameObjectName, methodName) {
        var container = document.createElement('div');
        container.id = 'webview-container';
        container.style.position = 'absolute';
        container.style.top = '0';
        container.style.left = '0';
        container.style.width = '100%';
        container.style.height = '100%';
        document.body.appendChild(container);

        window.gameInstance = unityInstance;
        window.gameObjectName = UTF8ToString(gameObjectName);
        window.methodName = UTF8ToString(methodName);
    },

    LoadURL: function(url) {
        var container = document.getElementById('webview-container');
        container.innerHTML = '<iframe src="' + UTF8ToString(url) + '" style="width:100%;height:100%;border:0;"></iframe>';
    }
});
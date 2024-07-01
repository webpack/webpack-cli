<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title>Webpack App</title>
    </head>
    <body>
        <h1>Hello world!</h1>
        <h2>Tip: Check your console</h2>
    </body>
    <% if (workboxWebpackPlugin) { %>
    <script>
        if ("serviceWorker" in navigator) {
            window.addEventListener("load", () => {
                navigator.serviceWorker
                    .register("service-worker.js")
                    .then((registration) => {
                        console.log("Service Worker registered: ", registration);
                    })
                    .catch((registrationError) => {
                        console.error("Service Worker registration failed: ", registrationError);
                    });
            });
        }
    </script><% } %>
</html>

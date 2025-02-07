export default ({html, css}) => {
    return `<!doctype html>
      <html lang="en">
          <head>
             <meta charset="utf-8">
             <title>MERN Skeleton</title>
             <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:100,300,400">
             <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
          </head>
          <body>
            <div id="root">${html}</div>
            <style id="jss-server-side">${css}</style>
            <script type="text/javascript" src="/dist/bundle.js"></script>
          </body>
      </html>`
}
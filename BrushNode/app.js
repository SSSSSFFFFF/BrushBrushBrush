const express = require('express')
const app = express()
const port = 3000


//设置跨域访问
app.all('*', function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "http://localhost:7456");
   next();
});

app.get('/player', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
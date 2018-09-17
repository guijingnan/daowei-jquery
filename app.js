const express = require('express');
const app = express();
const cors = require('cors')
app.use(express.static('public'));
app.use(cors())
app.listen('3009',function () {
  console.log('启动成功')
})
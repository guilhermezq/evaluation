var express = require('express');
var router = express.Router();
var axios = require('axios');

/* GET home page. */

router.get('/:fileId', async function(req, res, next) {
  let file
  let offset = 0
  let flag = true  
  while(flag){
    let {data} = await axios.get(`http://interview-api.snackable.ai/api/file/all?limit=5&offset=${offset}`)
    file = data.find(f => f.fileId === req.params.fileId)
    if (data.length === 0 || !!file) {
      flag = false
    }
    offset = offset + 5
  }
  if(file.processingStatus === 'FINISHED') {    
    const info = await axios.get(`http://interview-api.snackable.ai/api/file/details/${req.params.fileId}`)
    const segments = await axios.get(`http://interview-api.snackable.ai/api/file/segments/${req.params.fileId}`)
    const fileInfo = { info: info.data, segments: segments.data}
    res.json(fileInfo)
  } else {
    res.status(400).send({error: "file not ready"});
  }

})

module.exports = router ;
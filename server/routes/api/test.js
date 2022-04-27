const express = require('express')
const router = express.Router()
const axios = require('axios');

router.get('/', async (req, res) => {
  const data = "data"
  // await axios.get("https://solanart.io/collections/goblinlaboratory").data;
  console.log(data);
  res.json({
    success: true,
    // text: 'This is for Test Api',
    data
  })
})

router.get('/all', async (req, res) => {

  res.json({
    success: true,
    text: 'This is for Test Api "All"'
  })
})

module.exports = router
const express = require('express')
const cors = require('cors')

const app = express()

// Init Middleware
app.use(express.json())
app.use(cors())

// Define Routes
app.use('/api/test', require('./routes/api/test'))

const PORT = process.env.PORT || 5001

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))

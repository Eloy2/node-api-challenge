const express = require("express")
const projectsRouter = require("./routers/projectsRouter")
const actionsRouter = require("./routers/actionsRouter")

const server = express()
const port = process.env.PORT

server.use(express.json())
server.use(projectsRouter)
server.use(actionsRouter)


// BELOW IS ERROR MIDDLEWARE
server.use((err, req, res, next) => {
    console.log(err)
    res.status(500).json({
        message: "Something went wrong"
    })
})

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
})

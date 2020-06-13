const express = require('express')
const projectdb = require("../data/helpers/projectModel")

const router = express.Router()

router.get("/projects", (req, res) => {
    projectdb.get()
        .then(projects => {
            res.status(200).json(projects)
        })
        .catch(err => {
            next(err) // THIS WILL TRIGGER ERROR MJIDDELWARE IN INDEX.JS
        })
})

router.get("/projects/:id", validateProjectID, (req, res) => {
    res.status(200).json(req.project)
})


// GET LIST OF ACTIONS FOR A SPECIFIC PROJECT
router.get("/projects/:id/actions", validateProjectID, (req, res) => {
    res.status(200).json(req.project.actions)
})


router.post("/projects", validateProjectBody, (req, res) => {
    projectdb.insert({ name: req.body.name, description: req.body.description, completed: false })
    .then(newProject => {
        res.status(200).json(newProject)
    })
    .catch(err => {
        next(err)
    }) 
})

router.delete("/projects/:id", validateProjectID, (req, res) => {
    projectdb.remove(req.project.id)
        .then(deleted => {
            res.status(200).json({ message: `Sucessfully deleted ${deleted} project`})
        })
        .catch(err => {
            next(err)
        })
})

router.put("/projects/:id", validateProjectID, validateProjectBody, (req, res) => {
    projectdb.update(req.project.id, { name: req.body.name, description: req.body.description })
        .then(updatedProject => {
            res.status(200).json(updatedProject)
        })
        .catch(err => {
            next(err)
        })
})

// VALIDATION MIDDELWARE

function validateProjectID(req, res, next) {
    projectdb.get(req.params.id)
        .then(project => {
            if(project) {
                req.project = project
                next()
            } else {
                res.status(400).json({ message: "invalid project id"})
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: "Could not get specific project"})
        })
} 

function validateProjectBody(req, res, next) {
    if (!req.body.name || !req.body.description) {
        res.status(400).json({ message: "please add name and description fields in your request body"})        
    } else {
        next()
    }
}


module.exports = router;

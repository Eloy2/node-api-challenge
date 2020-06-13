const express = require("express")
const actionsdb = require("../data/helpers/actionModel")
const projectdb = require("../data/helpers/projectModel")

const router = express.Router()

router.get("/actions", (req, res) => {
    actionsdb.get()
        .then(allActions => {
            res.status(200).json(allActions)
        })
        .catch(err => {
            next(err)
        })
})

router.get("/actions/:id", validateActionID, (req, res) => {
    res.status(200).json(req.action)
})

router.post("/actions", validateActionBody, validateProjectIDForAction, (req, res) => {
    actionsdb.insert({ project_id: req.body.project_id, description: req.body.description, notes: req.body.notes , completed: false })
        .then(newAction => {
            res.status(200).json(newAction)
        })
        .catch(err => {
            next(err)
        })
})

router.delete("/actions/:id", validateActionID, (req, res) => {
    actionsdb.remove(req.action.id)
        .then(deleted => {
            res.status(200).json({ message: `Sucessfully deleted ${deleted} action`})
        })
        .catch(err => {
            next(err)
        })
})

router.put("/actions/:id", validateActionID, validateActionBody, validateProjectIDForAction, (req, res) => {
    actionsdb.update(req.params.id, { project_id: req.body.project_id, description: req.body.description, notes: req.body.notes })
        .then(updatedAction => {
            res.status(200).json(updatedAction)
        })
        .catch(err => {
            next(err)
        })
})


// VALIDATION MIDDELWARE

function validateActionID(req, res, next) {
    actionsdb.get(req.params.id)
        .then(action => {
            if (action) {
                req.action = action
                next() 
            } else {
                res.status(400).json({ message: "invalid action id"})
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: "Could not get specific action"})
        })
}

function validateProjectIDForAction(req, res, next) {
    projectdb.get(req.body.project_id)
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

function validateActionBody(req, res, next) {
    if(!req.body.description || !req.body.notes || !req.body.project_id) {
        res.status(400).json({ message: "please add project_id, description, and notes fields to your request body"})
    } else {
        next()
    }
}

module.exports = router;

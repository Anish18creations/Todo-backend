const express = require('express');
const router = express.Router();
const Todo = require("../models/todo");
const jwtverify = require("../middlewares/usermiddleware");

// create a new card route
router.post("/createcard", jwtverify, async (req, res) => {
    try {
        
        if(!req.body.duedate)
        {
            const { title, priority , checklists } = req.body;
            if (!(/^[A-Za-z0-9\s]+$/.test(title)) || !title.trim()) {
                 res.status(400).json({ message : "Please provide a proper title for your card!!" , success:"false" });
            }

            if (!priority) {
                res.status(400).json({ message : "Please choose a priority for your task!!" , success:"false"});
            }

           if (!checklists.length) {
                res.status(400).json({ message : "Please add checklist(s) to your card!!" , success:"false"});
            }
    
            checklists.map((task) => {
                if (!task.taskname.trim()) 
                return res.status(409).json({ message: "Card consists of checklist(s) with no title!!" , success:"false"});
            });
    
            tododetails = new Todo({
                title,
                priority,
                checklists,
            });
    
            await tododetails.save();
    
            res.json({ message: "New todo card created!", success : "true"  });
        }
        else
        {
            const { title, priority , checklists , duedate } = req.body;

        if (!/^[A-Za-z0-9\s]+$/.test(title) || !title.trim()) {
            res.status(400).json({ message : "Please provide a proper title for your card!!" , success:"false"});
        }

       if (!priority) {
           res.status(400).json({ message : "Please choose a priority for your task!!" , success:"false"});
        }

        if (!checklists.length) {
           res.status(400).json({ message : "Please add checklist(s) to your card!!" , success:"false"});
        }

        checklists.map((task) => {
            if (!task.taskname.trim()) 
            res.status(409).json({ message: "Card consists of checklist(s) with no title!!" , success:"false"});
        });

        tododetails = new Todo({
            title,
            priority,
            checklists,
            duedate
        });

        await tododetails.save();

        res.json({ message: "New todo card created!" , success : "true"  });
        }
        
    } catch (error) {
        console.log(error);
    }
});

// get card details route
router.get("/todo-description/:todoId", async (req, res) => {
    try {

        const todoid = req.params.todoId;

        if (!todoid) {
             res.status(400).json({ message: "No such cards found!!", success:"false"})
        }

        const todoInfo = await Todo.findById(todoid);

        if (!todoInfo) {
             res.status(400).json({ message: "No such cards found!!" , success:"false"})
        }

             res.json({ data: todoInfo , success : "true"  });

    } catch (error) {
        res.status(400).json({ message : "No such cards found!!", success:"false"})
    }
});

router.get("/movetodonesection/:todoid" , async (req , res) => {
    try {

        const todoid = req.params.todoid;

        const todoInfo = await Todo.findById(todoid);

        todoInfo.checklists.map((task) => {
            task.done = "true"
        })

        await todoInfo.save();

        res.json({data : todoInfo});        
    }
    catch (error) {
        console.log(error);
    }
})

// edit/update card details route
router.put("/edittodo/:todoid", jwtverify, async (req, res) => {

    try {

        if(!req.body.duedate)

        {
        const { title, priority , checklists } = req.body;

        const todoid = req.params.todoid;

        if (!/^[A-Za-z\s]+$/.test(title) || !title.trim()) {
            res.status(400).json({ message : "Please provide a proper title for your card!!" , success:"false"});
        }

       if (!priority) {
           res.status(400).json({ message : "Please choose a priority for your task!!" , success:"false"});
        }

        if (!checklists.length) {
           res.status(400).json({ message : "Please add checklist(s) to your card!!" , success:"false"});
        }

        checklists.map((task) => {
            if (!task.taskname.trim()) 
            res.status(409).json({ message: "Card consists of checklist(s) with no title!!" , success:"false"});
        });

        await Todo.updateOne({ _id: todoid },
            {
                $set: {
                    title,
                    priority,
                    checklists,
                },
            }
        );

        res.json({ message: "Card details updated successfully" , success : "true" });

        }

        else
        {
            const { title, priority , checklists , duedate } = req.body;

            const todoid = req.params.todoid;
    
            if (!/^[A-Za-z\s]+$/.test(title) || !title.trim()) {
                res.status(400).json({ message : "Please provide a proper title for your card!!" , success:"false"});
            }
    
           if (!priority) {
               res.status(400).json({ message : "Please choose a priority for your task!!" , success:"false"});
            }
    
            if (!checklists.length) {
               res.status(400).json({ message : "Please add checklist(s) to your card!!" , success:"false"});
            }
    
            checklists.map((task) => {
                if (!task.taskname.trim()) 
                res.status(409).json({ message: "Card consists of checklist(s) with no title!!" , success:"false"});
            });
    
            await Todo.updateOne({ _id: todoid },
                {
                    $set: {
                        title,
                        priority,
                        checklists,
                        duedate
                    },
                }
            );
    
            res.json({ message: "Card details updated successfully", success : "true"  });  
        }

    } catch (error) {
        console.log(error);
    }
});

// delete card route
router.get("/todo-delete/:todoId", async (req, res) => {
    try {

        const todoid = req.params.todoId;

        await Todo.findByIdAndDelete({ _id: todoid });

        const jobDetails = await Todo.find();

        res.json({ message: "Card deleted successfully!!" , success : "true" , data: jobDetails });

    } catch (error) {
        res.status(400).json({ message : "No such cards found to delete!!", success:"false"});
    }
});

// filter card route

// analytics route
router.get("/analytics", jwtverify , async (req, res) => {
    try {

        const highpriority = await Todo.countDocuments({"priority" : 'HIGH PRIORITY'});
        const moderatepriority = await Todo.countDocuments({"priority" : 'MODERATE PRIORITY'});
        const lowpriority = await Todo.countDocuments({"priority" : 'LOW PRIORITY'});

             res.json({ highpriority: highpriority ,
                moderatepriority : moderatepriority ,
                lowpriority : lowpriority ,
                success : "true"  });

    } catch (error) {
        res.status(400).json({ message : "Some error occured while fetching details!!", success:"false"})
    }
});  

// get all jobs route
router.get("/alltasks", async (req, res) => {
    try {

        const jobDetails = await Todo.find();

        if (jobDetails.length == 0)
            res.status(404).json({ data: "No such jobs found based on the given filter" });
        else
            res.json({ data: jobDetails });

        } catch (error) {
        console.log(error);
        }
});

module.exports = router;
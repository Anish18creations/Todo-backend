const express = require('express');
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtverify = require("../middlewares/usermiddleware");

router.post("/register" , async(req,res) => {
    try{
        const { name , email , password} = req.body;

        const isexistinguser1 = await User.findOne({email:email});
        if(isexistinguser1) {
             res.json({
               message : "User already exists with the given email address!!" ,
               success : "false"
            })
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const userData = new User({
            name,
            email,
            password : hashedPassword
        })

        const userRes = await userData.save();

        const token = await jwt.sign({userid : userRes._id} , process.env.JWT_SECRET);

        res.json({message : "User registered successfully!!" ,
         token : token ,
         name : name ,
         userid : userRes._id ,
         success : "true"
        });
    }
    catch(e)
    {
        console.log(e);
    }
    
});

router.post("/login" , async(req,res)=>{
    try {
        const { email , password} = req.body;

        const userdetails = await User.findOne({email});

        if(!userdetails){
            res.json({message:"Invalid credentials!!" , success: 'false'});
        }

        const passwordcompare = await bcrypt.compare(password,userdetails.password);

        if(!passwordcompare)
            res.json({message:"Invalid credentials!!" , success: 'false'});

        const token = await jwt.sign({userid : userdetails._id} , process.env.JWT_SECRET);

        res.json({message : "You have been logged in!!" ,
         token : token ,
         name : userdetails.name ,
         userid : userdetails._id ,
         success : 'true',
        });
    } 
    catch(error) {
        console.log(error);
    }
})

router.put("/edituser", jwtverify, async (req, res) => {
    try {

        if(req.body.name && req.body.password)
        {
            const { name , password , userid} = req.body;

            if (!/^[A-Za-z\s]+$/.test(name) || !name.trim()) 
            res.status(400).json({ message : "Please provide a proper username!!", success: 'false' })

            if(!password.trim())
            res.status(400).json({ message : "Please provide a valid password!!" , success: 'false'})

            const userdetails = await User.findOne({_id : userid});

            const email = userdetails.email;

            const hashedPassword = await bcrypt.hash(password,10);
            
            await User.updateOne({ _id: userid },
                {
                    $set: {
                        name,
                        email,
                        password : hashedPassword
                    },
                }
            );

            res.json({message : "User details updated successfully!!" ,
            name : name ,
            password : password ,
            success : "np"
        });
        }

        else if(req.body.name && !req.body.password)
        {

            const { name , userid} = req.body;

            if(!/^[A-Za-z\s]+$/.test(name) || !name.trim())
            res.status(400).json({ message : "Please provide a proper username!!", success: 'false' })

            const userdetails = await User.findOne({_id : userid});

            const email = userdetails.email;

            const password = userdetails.password;
            
            await User.updateOne({ _id: userid },
                {
                    $set: {
                        name,
                        email,
                        password 
                    },
                }
            );

            res.json({message : "User details updated successfully!!" ,
            name : name ,
            success : "n"
        });

        }

        else if(!req.body.name && req.body.password)
        {
            const { password , userid} = req.body;

            if(!password.trim())
            res.status(400).json({ message : "Please provide a valid password!!" , success: 'false'})
            
            const userdetails = await User.findOne({_id : userid});

            const name = userdetails.name;

            const email = userdetails.email;

            const hashedPassword = await bcrypt.hash(password,10);
            
            await User.updateOne({ _id: userid },
                {
                    $set: {
                        name,
                        email,
                        password : hashedPassword
                    },
                }
            );

            res.json({message : "User details updated successfully!!" ,
            password : password ,
            success : "p"
        });

        }
        
        else if(!req.body.name && !req.body.password)
        res.json({message : "Please provide valid name and/or password!!" ,
        success : "false"
        });
        
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;
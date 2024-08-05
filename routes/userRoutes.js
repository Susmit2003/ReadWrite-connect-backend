import { Router } from "express";
import authorModel from "../models/usermodel.js";
import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import bcrypt from "bcryptjs";

const router = Router();



// router.post("/signup", async function(req,res){

//     const {email, password,username} =  req.body

//     try {
//         const author = new authorModel({
//             email, password,username
//         })
//         const user = await author.save()

//         res.status(202).json({success: user})

//     } catch (error) {
//         res.status(500).json({error: error})

//     }

// })

router.post("/login", async function(req,res){

    

    const {userType, email, password} = req.body
	console.log(email)
	console.log( password)
    
    try {
        const data = await authorModel.findOne({email:email})
		console.log( data)
		const isPasswordCorrect = await bcrypt.compare(password, data?.password || "")
    
        if(!isPasswordCorrect) return res.status(404).json({message: "user not found"})
    
        if(isPasswordCorrect) {
			console.log("yeye")
			return res.status(201).json({data,userType});
		}

        res.status(404).json({error: 'User not found'})

    } catch (error) {
        res.status(500).json({error:error})
    }

   
    
})

router.post("/signup", async (req, res) => {
	try {
        console.log("hhhh")
		const { email, password,username} = req.body;

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
            console.log("gnv")
			return res.status(400).json({ error: "Invalid email format" });
		}

		const existingUser = await authorModel.findOne({ username });
		if (existingUser) {
            console.log("UE")
			return res.status(400).json({ error: "Username is already taken" });
		}

		const existingEmail = await authorModel.findOne({ email });
		if (existingEmail) {
            console.log("EAT")
			return res.status(400).json({ error: "Email is already taken" });
		}

		if (password.length < 6) {
            console.log("plp")
			return res.status(400).json({ error: "Password must be at least 6 characters long" });
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const newUser = new authorModel({

			username,
			email,
			password: hashedPassword,
		});

		if (newUser) {
			generateTokenAndSetCookie(newUser._id, res);
			await newUser.save();

			res.status(201).json({
				_id: newUser._id,
				username: newUser.username,
				email: newUser.email,
				
			});
		} else {
			res.status(400).json({ error: "Invalid user data" });
		}
	} catch (error) {
		console.log("Error in signup controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

export default router
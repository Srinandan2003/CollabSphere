import { User } from "../models/user.model.js";
import bcryptjs from 'bcrypt'

import {genarateTokenAndSetCookies} from '../utils/genarateTokenAndSetCookies.js'

export const signUp = async (req, res) => {
    const {email , password , userName} = req.body;


    try {
        if(!email || !password || !userName){                //check filled fields
            throw new Error("All Fields are required");
        }

        const userAlreadyExists = await User.findOne({email});
        if(userAlreadyExists){
            return res.status(400).json({success: false, message:"User already exists."})
        }

        const hashedPassword = await bcryptjs.hash( password, 10);
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

        const user = new User({
            email,
            password:hashedPassword,
            userName,
            verificationToken,
            verificationTokenExpiresAt : Date.now() + 24 * 60 * 60 * 1000 // 24 hours
        });

await user.save()

genarateTokenAndSetCookies(res, user._id)   // JWT


res.status(200).json({
    success: true,
    message: "User created successfully",
    user:{
        ...user._doc,
        password:undefined
    }
})

    } catch (error) {
        res.status(400).json({ success:false, message: error.message})
    }
  };
  
  export const signIn = async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid credentials" });
		}
		const isPasswordValid = await bcryptjs.compare(password, user.password);
		if (!isPasswordValid) {
			return res.status(400).json({ success: false, message: "Invalid credentials" });
		}

		genarateTokenAndSetCookies(res, user._id);

		user.lastLogin = new Date();
		await user.save();

		res.status(200).json({
			success: true,
			message: "Logged in successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		});
	} catch (error) {
		console.log("Error in login ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};
  
  export const logOut = async (req, res) => {
	res.clearCookie("token");
	res.status(200).json({ success: true, message: "Logged out successfully" });
};
  
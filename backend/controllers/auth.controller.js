 import User from "../models/user.model.js";
 import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


 export const signup=async(req,res)=>{
    try{ 
      const{name,username, wmail, password}=req.body;
      
		if (!name || !username || !email || !password) {
			return res.status(400).json({ message: "All fields are required" });
		}


      const exisitngEmail = await  User.findOne({email});
      if (existingEmail){
         return res.status(400).json({msg: "Email already exists"});
      }


      const existingUsername = await User.findOne({username});
      if(existingUsername){
         return res.status(400).json({msg: "Username already exists"});
      }

      if (password.length<6)
         {
            return res.status(400).json({message: "Password must be at least 6 characters long"});
         }      
      const salt= await bcrypt.genSalt(10);//A salt is a random string added to a
      //  password before hashing. This ensures that even if two users have the same 
      // password, their resulting hashes will differ, making it harder for attackers to 
      // guess the original passwords. 
      //This line generates a salt using the bcrypt library. A 
      // salt is a random value added to a password before hashing to increase security and protect 
      // against attacks such as precomputed hash lookups (rainbow table attacks).
      const hashedPassword = await bcrypt.hash(password,salt);

      const user = new User({
         name,
         email,
         password:hashedPassword,
         username
      })
      await user.save(); 

      const token = jwt.sign( {userId:user._id}, process.env.JWT_SECRET, { expiresIn: "3d" });

      res.cookie("jwt-linkedin", token, {
			httpOnly: true, // prevent XSS attack
			maxAge: 3 * 24 * 60 * 60 * 1000,
			sameSite: "strict", // prevent CSRF attacks,
			secure: process.env.NODE_ENV === "production", // prevents man-in-the-middle attacks
		});
      res.status(201).json({ message: "User registered successfully" });

		const profileUrl = process.env.CLIENT_URL + "/profile/" + user.username;

		try {
			await sendWelcomeEmail(user.email, user.name, profileUrl);
		} catch (emailError) {
			console.error("Error sending welcome Email", emailError);
		}


    }catch(error){
      
    }
 }


 export const login=(req,res)=>{
    try{
      const {username,password}=req.body;
      // Check if user exists
      const user =  await User.findOne({username});
      if (!user) {
         return res.status(400).json({ message: "Invalid credentials" });
      }
      // Check if password is correct
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch){
         return res.status(400).json({message:"Invalid Credentials"});
      }
       // Create and send token
       const token =jwt.sign({userId:user._id}, process.env.JWT_SECRET, {expiresIn:"3d"});
       await res.cookie("jwt-linkedin", token, {
         httpOnly: true,
			maxAge: 3 * 24 * 60 * 60 * 1000,
			sameSite: "strict",
			secure: process.env.NODE_ENV === "production",
		});

		res.json({ message: "Logged in successfully" });
	} catch (error) {
		console.error("Error in login controller:", error);
		res.status(500).json({ message: "Server error" });
	}

    
 };

 export const logout = (req, res) => {
	res.clearCookie("jwt-linkedin");
	res.json({ message: "Logged out successfully" });
};

// function retrieves the user object from the request and sends it as a JSON response.
export const getCurrentUser = (req, res) => {

   try{
      res.json(req.user);

   }catch(error){
     console.error("Error in getCurrentUser controller:", error);

     res.status(500).json({message:"Server error"})
   }
};
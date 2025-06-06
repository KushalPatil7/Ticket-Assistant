import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { inngest } from "../inngest/client.js";

export const singUp = async (req, res) => {
  const { skills, email, password } = req.body;
  try {
    const hashed = bcrypt.hash(password, 10);
    const user = User.create({ email, password: hashed, skills });

    await inngest.send({
      name: "user/signup",
      data: {
        email,
      },
    });
    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET
    );

    res.json({ user, token });
    const existingUser = await User.findOne({ email });
  } catch (error) {
    console.error("Error during signup:", error);
    return res
      .status(500)
      .json({ error: "Signup failed", details: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "User Not found" });
      const ismatch = bcrypt.compare(password, user.password);
      if (!ismatch) {
        return res.status(401).json({ error: "Invalid Credentials" });
      }
      const token = jwt.sign(
        { _id: user._id, role: user.role },
        process.env.JWT_SECRET
      );
    }
    res.json({user,token})
  } catch (error) {
    res.status(500).json({
      error: "Login failed",
      details: error.message,
    });
  }
};

export const logout=async (req,res)=>{
      try {
        req.headers.authorization.split(" ")[1]
        if(!token){
            return res.status(401).json({error:"Unauthorized"})
        }
        jwt.verify(token,process.env.JWT_SECRET,(err,decoded)=>{
            if(err){
                return res.status(401).json({error:"Unauthorized"})
            }
            res.json({message:"Logout successful"})
        })
      } catch (error) {

      }
}

export const updateUser=async(req,res)=>{
    const {skills=[],role,email}=req.body;
    try {
        if(req.user?.role!=="admin"){
            return res.status(403).json({error:"Forbidden: Only admin can update user details"})
            
        }
        const user=await User.findOne({email})
        if(!user){
            return res.status(401).json({error:"User Not Found"})
        }
        await User.updateOne(
            {email},
            {skills:skills.length? skills:user.skills,role}
        )
        return res.json({message:"User updated successfully"})
    } catch (error) {
        res.status(500).json({
            error: "Update failed",
            details: error.message,
        });
    }
}

export const getUser=async(req,res)=>{
  try {
    if(req.user.role!=="admin"){
      return res.status(403).json({ error: "Forbidden: Only admin can access user details" });
    }
    const users=await User.find().select("-password")
    return res.json({ users });
  } catch (error) {
    res.status(500).json({
      error: "Failed to retrieve user details",
      details: error.message,
    });
  }
}
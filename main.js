const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const app = express();
const port = 3003;

app.use(cors());
app.use(express.json());

const secretKey = "your-secret-key"; // Secret key for JWT token

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});

const dataSchema=new mongoose.Schema({
  iamount:Number,
  iinterest:Number,
  icompound:Number,
  itaken:Date,
  igiven:Date,
  itotal:Number
})

const USERS = mongoose.model('USERS', userSchema);
const DATA=mongoose.model('DATA',dataSchema);

mongoose.connect('mongodb+srv://saurav4ryou707997:185033UM@cluster0.bmftqgr.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true, dbName: "dhan-lakshmi" });


function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
}

app.post('/register', async (req, res) => {
  let { username, email, password } = req.body;
  const user = await USERS.findOne({ email });

  if (user) {
    res.status(409).json({ message: 'User-Exist' });
  } else {
    const newUser = new USERS({ username, email, password });
    await newUser.save();
    res.status(200).json({ message: 'Account Created Successfully' });
  }
});

app.post('/login', async (req, res) => {
  let { email, password } = req.body;
  const user = await USERS.findOne({ email, password });

  if (user) {
    const token = jwt.sign({ email, role: 'user' }, secretKey, { expiresIn: '1h' });
    res.status(200).json({ message: 'login-successful',token});
  } else {
    res.status(400).json({ message: 'You are not a user. Create a user account.' });
  }
});

app.post('/from',verifyToken,async (req,res)=>{
    let {iamount,iinterest,icompound,itaken,igiven,itotal}=req.body;
    const newdata=new DATA({iamount,iinterest,icompound,itaken,igiven,itotal});
    

    await newdata.save();
    if(newdata.save()){
      console.log(iamount,iinterest,icompound,itaken,igiven,itotal)
      res.status(200).json({ message: 'Data saved Successfully' });
    }else{
      res.status(400).json({ message: 'Data not saved' });
    }
    
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

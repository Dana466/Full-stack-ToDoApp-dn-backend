const express =require('express')
const mongoose =require('mongoose')
const routes =require('./routes/ToDoRoute')
const cors=require("cors")
const UserModel =require('./moduls/Signup_model')
const auth =require('./authentication/auth')
const todoModel =require('./moduls/Todomodel')


require('dotenv').config()


const app =express()
const PORT =process.env.port || 5001
app.use(express.json())
app.use(cors())

mongoose.connect(process.env.MONGODB_URL).then(()=> console.log('connected to mongo db ...')).catch((err) =>console.log(err))

app.use(routes)

app.post('/user/signup', async (req, res) => {
    const { email, password } = req.body;

        const userexists = await UserModel.findOne({ email: email });
        if (userexists) {
            return res.status(400).json({ error: "user already exists" });

      }

    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        const user = new UserModel({
            email: email,
            password: hash
        });
        user.save()
            .then((user) => {
                res.status(201).send({ message: 'Signup successful',
           email:user.email,
           password:req.body.password,
            });
            })
            .catch(err => {
                console.error(err);
                res.status(500).send({ message: 'Error saving user data' });
            });
    });
});


const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


app.post('/user/login', (req, res) => {
    const { email, password } = req.body;
    UserModel.findOne({ email })
    .then((user) => {
        if (!user) {
            return res.status(404).send({
                message: "Email not found.Check your email or register if you dont't have an account",
            });
        }
        const passwordCheck = bcrypt.compareSync(password, user.password);
        if(!passwordCheck) {
            return res.status(400).send({
                message: "Passwords does not match",
            });
        }
        const token = jwt.sign(
            {
                userId: user._id,
                userEmail: user.email,
            },
            "RANDOM-TOKEN",
            { expiresIn: "2h" }
        );
        res.status(200).send({
            message: "Login Successful",
            email: user.email,
            token,
        });
    })
    .catch((error) => {
        res.status(500).send({
            message: "Something went wrong",
            error,
        });
    });
});

// paginated list 
app.get('/todo', auth, async (req, res) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
  
    try {
      const todos = await todoModel.find({ userId: req.user._id })
        .sort({date: -1})
        .limit(limit)
        .skip((page - 1) * limit)
        .exec();
  
      const count = await todoModel.countDocuments({ userId: req.user._id });
  
      res.json({
        "code": 200,
        "message": "Found the requested todos from the selected page",
        "data": {
          "page": page,
          "limit": limit,
          "totalPages": Math.ceil(count / limit),
          "todos": todos
        }
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });


app.listen(PORT,() =>console.log(`Listening on ${PORT}`))


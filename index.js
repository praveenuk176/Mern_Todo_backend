const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// 1) mongoose -> mongoDb
mongoose.connect('mongodb+srv://praveenuk176:1706@cluster0.ttfdxdr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => {
        console.log('Connected to my database');
    })
    .catch((err) => {
        console.error(err);
    });

// 2) schema -> database mongoose.Schema() -> object       json(bson)  key:value pair
const userSchema = mongoose.Schema({
    name: { type: String },
    age: { type: Number },
    course: { type: String }
});

// 3) collections -> model (collection creation, data setting)
const Collections = mongoose.model("details", userSchema);

// 4) ask express to use packages
app.use(express.json()); // to parse JSON bodies
app.use(cors()); // enable CORS

// 5) writing post method
app.post("/posting", async (req, resp) => {
    try {
        const createUser = new Collections(req.body); // details like name, age
        const result = await createUser.save();
        const success = result.toObject();
        resp.send(success);
    } catch (error) {
        console.log("post error method", error);
        resp.status(500).send("Error posting user data");
    }
});

app.get("/posting", async (req, resp) => {
    try {
        const users = await Collections.find();
        resp.send(users);
    } catch (error) {
        console.log("get error method:", error);
        resp.status(500).send("Error retrieving users");
    }
});

app.put('/posting/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, age, course } = req.body;
        const updatedUser = await Collections.findByIdAndUpdate(id, { name, age, course }, { new: true });
        res.json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

app.delete('/posting/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Collections.findByIdAndDelete(id);
        res.send('User deleted successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Something Went Wrong');
    }
});

app.post("/", cors(), async (req, res) => {
    const { email, password } = req.body;
    try {
        const check = await Collections.findOne({ email: email });
        if (check) {
            res.json("exist");
        } else {
            res.json("not exist");
        }
    } catch (e) {
        res.json("not exist");
    }
});

app.post("/signup", cors(), async (req, res) => {
    const { email, password } = req.body;
    try {
        const check = await Collections.findOne({ email: email });
        if (check) {
            res.json("exist");
        } else {
            await Collections.create({ email: email, password: password });
            res.json("not exist");
        }
    } catch (e) {
        res.json("not exist");
    }
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});

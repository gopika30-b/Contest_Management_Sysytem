const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const PORT = 5000;
const cors = require('cors');
app.use(cors());
const MONGODB_URI = 'mongodb+srv://gopika30:beYourself@cluster0.ija6j8j.mongodb.net/eventManagementReact';
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));
app.use(bodyParser.json());
const userSchema = new mongoose.Schema({
    fullName: String,
    dept: String,
    year: String,
    username: String,
    password: String,
    type: String,
    registeredContest: [String],
    completedContest: [String]
}, { collection: 'userData' });
const User = mongoose.model('User', userSchema);
const contestSchema = new mongoose.Schema({
    contestName: String,
    organisedBy: String,
    registrationStartDate: String,
    registrationEndDate: String,
    registrationLink: String,
    registeredStudents: [String],
    notInterestedStudents: [String]
}, { collection: 'contestDetails' });
const Contest = mongoose.model('Contest', contestSchema);
app.post('/addcontest', async (req, res) => {
    const { contestName, organisedBy, registrationStartDate, registrationEndDate, registrationLink } = req.body;
    try {
        const newContest = new Contest({
            contestName,
            organisedBy,
            registrationStartDate,
            registrationEndDate,
            registrationLink
        });
        await newContest.save();
        res.status(201).json({ message: 'Contest details saved successfully' });
    } catch (error) {
        console.error('Error saving contest details:', error);
        res.status(500).json({ message: 'Failed to save contest details. Please try again.' });
    }
});
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log(username, password);
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        if (password === user.password) {
            let componentName;
            if (user.type === 'admin') {
                componentName = 'AdminPage';
            } else if (user.type === 'student') {
                componentName = 'StudentPage';
            } else {
                return res.status(401).json({ message: 'Invalid user type' });
            }
            res.json({ message: 'True', componentName, username });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});
app.get('/contests', async (req, res) => {
    try {
        const contests = await Contest.find();
        res.json(contests);
    } catch (error) {
        console.error('Error fetching contests:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});
app.get('/students', async (req, res) => {
    try {
        const students = await User.find({ type: 'student' });
        res.json(students);
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});
app.get('/notinterested', async (req, res) => {
    try {
        const notInterestedStudents = await User.find({ type: 'student', username: { $nin: { $registeredContest, $completedContest } } });
        res.json(notInterestedStudents);
    } catch (error) {
        console.error('Error fetching not interested students:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

app.post('/contests/register/:id', async (req, res) => {
    const { id } = req.params;
    const { username } = req.body;
    try {
        const contest = await Contest.findById(id);
        if (!contest) {
            return res.status(404).json({ message: 'Contest not found' });
        }
        // Push username to contest's registeredStudents array
        contest.registeredStudents.push(username);
        // Push contest's ObjectId to user's registeredContest array
        await User.findOneAndUpdate(
            { username },
            { $push: { registeredContest: contest._id } }
        );
        await contest.save();
        res.json({ message: 'Registered successfully' });
    } catch (error) {
        console.error('Error registering interest:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

app.post('/contests/notinterested/:id', async (req, res) => {
    const { id } = req.params;
    const { username } = req.body;
    try {
        const contest = await Contest.findById(id);
        if (!contest) {
            return res.status(404).json({ message: 'Contest not found' });
        }
        contest.notInterestedStudents.push(username);
        await contest.save();
        res.json({ message: 'Expressed disinterest successfully' });
    } catch (error) {
        console.error('Error expressing disinterest:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});
app.get('/user/:username', async (req, res) => {
    const { username } = req.params;
    console.log(username);
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});
app.post('/user/removecontest/:username', async (req, res) => {
    const { username } = req.params;
    const { contestId } = req.body;

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Remove the contestId from user's registeredContest array
        user.registeredContest = user.registeredContest.filter(id => id !== contestId);

        // Add the contestId to user's completedContest array
        user.completedContest.push(contestId);

        // Save the updated user data
        await user.save();

        res.json({ message: 'Contest removed successfully' });
    } catch (error) {
        console.error('Error removing contest:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
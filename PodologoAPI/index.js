// Importing necessary modules

import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import  emailValidator from 'email-validator';
import passwordValidator from 'password-validator';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:3000' // replace with your client's origin
}));
const port = 8080;
const schema = new passwordValidator();
// Setting up Multer for file uploads. Files will be saved in the 'uploads/' directory.
const upload = multer({ dest: 'uploads/' });
// Creating a new Prisma client to interact with our database
const prisma = new PrismaClient();

// Route handler for creating a new user

const verifyToken = (req, res, next) => {

    const token = req.headers["x-access-token"];

    jwt.verify(token, process.env.SECRET_KEY, (error, decoded) => {

        if (error) {
            res.send({ error: "You session has expired or does not exist." });
            return;
        } else {
            req.userId = decoded.userId;
            next();
        }

    });

};
app.get('/current-user', verifyToken, async (req, res) => {

    const userId = req.userId;

    const user = await prisma.user.findUnique({
        where: { id: userId },
    });


    if (!user) {
        res.send({ error: "User not found." });
        return;
    }
    delete user.password;

    res.send({ user: user});

});

app.post('/sign-up', async (req, res) => {

    const registerData = req.body;

    if (!registerData.email || !registerData.password || !registerData.fullName)
    {
        res.send({ error: "You've left empty fields" });
        return;
    }

    const emailValid = emailValidator.validate(registerData.email);
    if (!emailValid) {
        res.send({ error: "The email you submitted is not valid." });
        return;
    }

    schema
        .is().min(8)                                    // Minimum length 8
        .is().max(100)                                  // Maximum length 100
        .has().uppercase()                              // Must have uppercase letters
        .has().lowercase()                              // Must have lowercase letters
        .has().digits(2)                                // Must have at least 2 digits
        .has().not().spaces()                           // Should not have spaces
        .is().not().oneOf(['Passw0rd', 'Password123']); 

    const passwordValid = schema.validate(registerData.password);

    if (!passwordValid) {
        res.send({ error: "Your password is not safe, please include 8 characters with upper and lower case letters, and numbers." });
        return;
    }

    if (registerData.fullName.length < 4) {
        res.send({ error: "Your full name must be at least 4 characters." });
        return;
    }

    const emailExists = await prisma.user.findUnique({
        where: { email: registerData.email }
    });

    if (emailExists) {
        res.send({ error: "An account with this email already exists." });
        return;
    }

    let user;
    
    try {
        const hashedPassword = bcrypt.hashSync(registerData.password, 10);
    
        user = await prisma.user.create({
            data: {
                email: registerData.email,
                password: hashedPassword,
                fullName: registerData.fullName
            }
        });
    } catch (error) {
        console.log(error);
        res.send({ error: "Something went wrong. Please try again later." });
        return;
    }

    res.send({ success: "Your account has been created with " + user.email });

});

app.post('/sign-in', async (req, res) => {

    const loginData = req.body;

    if (!loginData.email || !loginData.password) {
        res.send({ error: "You've left empty fields." });
        return;
    }

    const user = await prisma.user.findUnique({
        where: { email: loginData.email }
    });

    if (!user) {
        res.send({ error: "An account with that email does not exist." });
        return;
    }

    const passwordValid = await bcrypt.compare(loginData.password, user.password);

    if (!passwordValid) {
        res.send({ error: "Password for that email is invalid." });
        return;
    }

    delete user.password;

    res.send({
        token: jwt.sign({ userId: user.id }, process.env.SECRET_KEY, { expiresIn: "1h" }),
        user
    });

});


// Route handler for creating a new FeaturedService
const createFeaturedService = async (req, res) => {
    try {
        // Getting the header, description, and image from the request
        const {header, description} = req.body;
        const image = req.file ? req.file.path : null;

        // If there's no image, return an error
        if (!image) {
            return res.status(400).json({error: 'Missing image url'});
        }

        // Creating the new featuredService in the database
        const post = await prisma.featuredService.create({
            data: {
                image,
                header,
                description
            }
        });

        // Sending the new featuredService data back to the client
        return res.json({post : post});
    } catch (error) {
        // If there's an error, log it and send it back to the client
        console.error(error);
        return res.status(500).json({error: error.message});
    }
}

// Route handler for getting all FeaturedServices
const getFeaturedServices = async (req, res) => {
    const featuredServices = await prisma.featuredService.findMany();
    return res.json(featuredServices);
}

// Route handler for getting a featuredService by its id
const getFeaturedServiceId = async (req, res) => {
    const {id} = req.params;
    try {
        const featuredService = await prisma.featuredService.findUnique({
            where: {
                id: parseInt(id)
            }
        });
        if (featuredService) {
            return res.json(featuredService);
        } else {
            return res.status(404).json({ error: `FeaturedService with id ${id} does not exist` });
        }
    } catch (error) {
        console.error("Error fetching featuredService:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
    
}

// Route handler for updating a featuredService
const updateFeaturedService = async (req, res) => {
    const {id} = req.params;
    const {header, description} = req.body;
    const image = req.file ? req.file.path : null;
    if (!image) {
        return res.status(400).json({error: 'Missing image url'});
    }
    try {
        const featuredService = await prisma.featuredService.update({
            where: { id: parseInt(id) },
            data: { image, header, description },
        });
        return res.json(featuredService);
    } catch (error) {
        return res.status(500).json({ error: `Could not update FeaturedService with id ${id}` });
    }
}
// TODO  : Route handler for deleting a featuredService

const addReview = async (req, res) => {
    const token = req.headers["x-access-token"];
    const reviewData = req.body;

    let userId;
    try {
        userId = jwt.verify(token, process.env.SECRET_KEY).userId;
    } catch (error) {
        res.status(401).send({error: "Invalid token."});
        return;
    }

    if(!userId){
        res.status(401).send({error: "You must be logged in to add a review."});
        return;
    }
    
    if (!reviewData.rating || !reviewData.text) {
        res.status(400).send({error: 'Missing rating or text in the review data.'});
        return;
    }
    
    if(reviewData.text.length < 10){
        res.status(400).send({error: 'Review text must be at least 10 characters long.'});
        return;
    }

    if(!reviewData.date || isNaN(Date.parse(reviewData.date))){
        res.status(400).send({error: 'Invalid or missing date in the review data.'});
        return;
    }

    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) {
        res.status(404).send({ error: "User not found." });
        return;
    }

    try {
        await prisma.review.create({
            data:{
                name: user.fullName, // Use the user's name
                rating: parseInt(reviewData.rating),
                text: reviewData.text,
                published: new Date(reviewData.date),
                user: {
                    connect: {
                        id: userId
                    }
                }
            }
        });
    } catch (error) {
        res.status(500).send({ error: "Database error. Please try again later." });
        return;
    }

    res.status(200).send({ success: "Your review has been added." })
}

const getReviews = async (req, res) => {
    try {
        const reviews = await prisma.review.findMany();
        return res.json(reviews);
    }catch (error) {
        console.error(error);
        return res.status(500).json({ error: `Could not get reviews` });
    }
}
const deleteReview = async (req, res) => {
    const id = req.params.id;
    try {
        const review = await prisma.review.delete({
            where: { id: parseInt(id) },
        });
        return res.json({message: `Deleted review with id ${id}`});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: `Could not delete review with id ${id}` });
    }
}
const deleteAllReviews = async (req, res) => {
    try {
        const deleteResponse = await prisma.review.deleteMany({});
        return res.json({ message: `Deleted ${deleteResponse.count} reviews` });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: `Could not delete reviews` });
    }
}

//bookATime handlers
const getBookATime = async (req, res) => {
    const bookATime = await prisma.bookATime.findMany();
    return res.json(bookATime);
}
const createBookATime = async (req, res) => {
    try {
        const { startTime } = req.body;
        const parsedStartTime = new Date(startTime);
        const parsedEndTime = new Date(parsedStartTime.getTime() + 50 * 60000); // Add 50 minutes

        // Check if time is between 8:00 and 18:00
        if (parsedStartTime.getHours() < 8 || parsedEndTime.getHours() >= 18) {
            return res.status(400).json({ error: 'Invalid time. Please book between 8:00 and 18:00.' });
        }

        // Create the new booking in the database
        const booking = await prisma.bookATime.create({
            data: {
                startTime: parsedStartTime,
                endTime: parsedEndTime,
                // Add other fields as necessary
            },
        });

        // Send the new booking data back to the client
        return res.json(booking);
    } catch (error) {
        // If there's an error, log it and send it back to the client
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
}

// Route handler for getting all ratings
const getAllRatings = async (req, res) => {
    const reviews = await prisma.review.findMany();
    const ratings = reviews.map(review => review.rating);
    
    const sum = ratings.reduce((a, b) => a + b, 0);

    const average = sum / ratings.length;
    return res.json({ averageStars: average });
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
// Routes

app.post('/featured-service', upload.single('image'), createFeaturedService);
app.get('/featured-service', getFeaturedServices);
app.get('/featured-service/:id', getFeaturedServiceId);
// Here I use put instead of patch because I want to update the whole featuredService
app.put('/featured-service/:id', upload.single('image'), updateFeaturedService);
// Review endpoints
app.get('/get-reviews', getReviews);

app.get('/review/rating', getAllRatings);

app.post('/add-review/' , addReview)
app.delete('/delete-review/:id', deleteReview);
app.delete('/delete-all-reviews', deleteAllReviews);
// bookATIme endpoints
app.get('/bookATime', getBookATime);
app.post('/create-book-a-time', createBookATime);



// Starting the server
app.listen(port, () => console.log(`Server is running on port ${port}`));
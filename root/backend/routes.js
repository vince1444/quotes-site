const express = require('express');
const Quote = require('./models/Quote');
const mongoose = require('mongoose');
const cors = require('cors'); // https://expressjs.com/en/resources/middleware/cors.html

mongoose.connect('',
                { useNewUrlParser: true, useUnifiedTopology: true })
// primer on Router object 
// https://levelup.gitconnected.com/guide-to-the-express-router-object-multiple-requests-and-middleware-9d5c99b2ade6
// a Router object just acts like middleware
// Middleware looks at the incoming requests
// Checks to see if it is something we want
// And then passes it onto the route
const router = express.Router();

// here, the middleware does something with our data
// and then forwards the response to the route
router.post('/', async (req, res) => {
    try 
    {   
        let x = JSON.parse(req.body);
        const quote = x.quote;
        const person = x.person;
        const date = x.date;
        const newQuote = new Quote({ quote: quote, person: person, date: date });
        await newQuote.save();
        res.status(200).send('Quote saved to Db.');
    }
    catch (err) 
    {
        console.error(err);
        res.status(500).send(err);
    }
});

router.get('/', cors(), async (req, res) => {
    console.log('Got request at url \'localhost:8080/\'');
    // pass it an empty {} filter so that it finds all
    // can filter out person by using {'person': vince}
    await Quote.find({}, (err, result) => {
        if (err) { console.error(err) }
        else {
            res.send(result);
        }
    });
});

router.get('/get4discord', async (req, res) => {  
    try
    {   
        console.log('Got request at url \'localhost8080/get4discord\'');
        // when looking for GET query params, use req.query.<param> not req.body
        // when I used JSON.stringify I think it added extra "" so remove
        const personQuery = req.query.person;
        const data = await Quote.find({ person: personQuery});
        res.send(data);
    }
    catch (err)
    {
        console.error(err);
        res.status(500).send(err);
    }
});

module.exports = router;
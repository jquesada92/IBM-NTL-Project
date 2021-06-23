const dotenv = require('dotenv');
dotenv.config();

const getNLUInstance = () => {
    let api_key = process.env.API_KEY;
    let api_url = process.env.API_URL;

    const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
    const { IamAuthenticator } = require('ibm-watson/auth');

    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
        version: '2020-08-01',
        authenticator: new IamAuthenticator({
            apikey: api_key
        }),
        serviceUrl: api_url,
    });
    return naturalLanguageUnderstanding;
}

const analyze = (analyzeParams) => {
    let NLU = getNLUInstance()
    NLU.analyze(analyzeParams).then(
            analysisResults => {
                console.log(JSON.stringify(analysisResults, null, 2));
                return analysisResults
            }
        )
        .catch(err => {
            console.log('error:', err);
        });
}

const AnalyzeParams = (predict, source = 'url', typeAnalysis = 'sentiment') => {
    let analyzeparams = {
        'features': {
            'entities': {
                'emotion': (typeAnalysis == 'sentiment') ? true : false,
                'sentiment': (typeAnalysis == 'sentiment') ? false : true
            },
            'keywords': {
                'emotion': (typeAnalysis == 'sentiment') ? true : false,
                'sentiment': (typeAnalysis == 'sentiment') ? false : true

            }
        }
    };
    analyzeparams[source] = predict;
    return analyzeparams;

};

const express = require('express');
const app = new express();


app.use(express.static('client'))

const cors_app = require('cors');
app.use(cors_app());

app.get("/", (req, res) => {
    res.render('index.html');
});

app.get("/url/emotion", (req, res) => {
    let text = req.query.url;
    let source = 'url';
    let typeAnalysis = 'emotion';
    const analyzeparams = AnalyzeParams(text, source, typeAnalysis);
    const results = Predict(analyzeparams).result.entities[0].emotion;
    return res.send({ emotions: results });
});

app.get("/url/sentiment", (req, res) => {
    return res.send("url sentiment for " + req.query.url);
});

app.get("/text/emotion", (req, res) => {
    return res.send({ "happy": "10", "sad": "90" });
});

app.get("/text/sentiment", (req, res) => {
    return res.send("text sentiment for " + req.query.text);
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})
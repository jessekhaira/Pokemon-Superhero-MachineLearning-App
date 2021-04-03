import {rest} from 'msw';
import {setupServer} from 'msw/node';

const successServer = setupServer(
    rest.post('/convModel', (req, res, ctx) => {
        return res(ctx.json({MostLikelyClass: 'Batman', allProbs: {'Batman': 0.7, 'Superman': 0.1, 'Hulk': 0.1, 'Spiderman': 0.1}}));
    }),

    rest.get('https://type.fit/api/quotes', (req, res, ctx) => {
        let arr = [];
        for (let i=0; i<1644; i++) {
            const text = `Quote number ${i}`;
            let author;
            if (i%100 === 0) {
                author = null;
            }
            else {
                author = `Author Number ${i}`
            }
            const quote = {
                text,
                author
            }
            arr.push(quote); 
        }
        return res(ctx.json(arr)); 
    }),

    rest.post('/languageModel', (req, res, ctx) => {
        return res(ctx.json({results: []}))
    }), 

    rest.get('/*', (req, res, ctx) => {
        return res(ctx.json({error: 'error'}));
    })
)

const errorServer = setupServer(
    rest.post('/convModel', (req, res, ctx) => {
        throw Error;
    }),

    rest.get('https://type.fit/api/quotes', (req, res, ctx) => {
        throw Error; 
    }),

)
export {successServer, errorServer} 

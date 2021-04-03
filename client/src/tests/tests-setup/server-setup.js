import {rest} from 'msw';
import {setupServer} from 'msw/node';

const server = setupServer(
    rest.post('/convModel', (req, res, ctx) => {
        let fileName = req.body.values().next().value.name; 
        if (fileName === 'test_failure.txt') {
            throw Error; 
        }
        else {
            return res(ctx.json({MostLikelyClass: 'Batman', allProbs: {'Batman': 0.7, 'Superman': 0.1, 'Hulk': 0.1, 'Spiderman': 0.1}}));
        }
    }),

    rest.get('https://type.fit/api/quotes', (req, res, ctx) => {
        console.log(req); 
    }),

    rest.post('/languageModel', (req, res, ctx) => {
        return res(ctx.json({results: []}))
    }), 

    rest.get('/*', (req, res, ctx) => {
        return res(ctx.json({error: 'error'}));
    })
)
export {server} 

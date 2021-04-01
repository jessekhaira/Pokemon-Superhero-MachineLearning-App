import {rest} from 'msw';
import {setupServer} from 'msw/node';

const server = setupServer(
    rest.post('/convModel', (req, res, ctx) => {
        return res(ctx.json({results: []}));
    }),

    rest.post('/languageModel', (req, res, ctx) => {
        return res(ctx.json({results: []}))
    }), 

    rest.get('/*', (req, res, ctx) => {
        return res(ctx.json({error: 'error'}));
    })
)
export {server} 

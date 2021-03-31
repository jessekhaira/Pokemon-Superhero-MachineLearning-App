import {server} from './server-setup';
import App from '../../components/App';
import {render} from '@testing-library/react';
import '@testing-library/jest-dom';
import * as React from 'react';

function setupAppForTests() {
    beforeAll(() => {
        server.listen();
    });

    beforeEach(() => {
        render(<App />)
    })

    afterEach(() => {
        server.resetHandlers(); 
    });

    afterAll(() => {
        server.close(); 
    })
}

export {setupAppForTests} 
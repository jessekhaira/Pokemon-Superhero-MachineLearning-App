import {server} from './server-setup';
import App from '../../components/App';
import {render} from '@testing-library/react';
import '@testing-library/jest-dom';
import * as React from 'react';
import fs from 'fs'
import path from 'path'


function setupAppForTests() {
    beforeAll(() => {
        server.listen();
    });

    beforeEach(() => {
        const cssFile = fs.readFileSync(
            path.resolve(__dirname, '../../stylesheets/App.css'),
            'utf8'
        );
        const {container} = render(<App />);
        
        const style = document.createElement('style')
        style.type = 'text/css'
        style.innerHTML = cssFile
        container.append(style);
    })

    afterEach(() => {
        server.resetHandlers(); 
    });

    afterAll(() => {
        server.close(); 
    })
}

export {setupAppForTests} 
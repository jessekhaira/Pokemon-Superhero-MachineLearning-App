import {screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {setupAppForTests} from '../tests-setup/setup-app';

setupAppForTests(); 

describe('testing language model, need describe for beforeEach', () => {
    beforeEach(() => {
        userEvent.click(screen.getByText('Generate Names'));
    });

    test('', () => {
        expect(true).toBe(true);
    }); 
}); 
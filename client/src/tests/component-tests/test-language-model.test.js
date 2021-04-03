import {screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {setupAppForTests} from '../tests-setup/setup-app';

setupAppForTests(); 

describe('testing language model, need describe for beforeEach', () => {
    beforeEach(() => {
        userEvent.click(screen.getByText('Generate Names'));
    });

    test('testing whether we switched routes to language model route correctly', async () => {
        expect(screen.getByText(/Provide a value between 0.5 and 5/)).toBeVisible();
        expect(screen.getByText(/Pick a number of names to generate/)).toBeVisible(); 
        expect(screen.getByText(/Recognize Images/)).toBeVisible(); 
        expect(screen.queryByText(/Submit a .png/)).toBe(null);
    }); 

    test('testing whether quotes are fetched and displayed properly when component mounts', async () => {
        await waitFor(() => expect(screen.getByText(/Quote number /)).toBeVisible()); 
        try {
            expect(screen.getByText(/Author Number/)).toBeVisible();
        }
        catch {
            expect(screen.getByText(/Unknown/)).toBeVisible();
        }
    });

    
}); 
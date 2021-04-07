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

    test('testing whether names are fetched and displayed appropriately', async () => {
        userEvent.type(screen.getByRole('spinbutton', {name: /temperature value/}), '2.3');
        userEvent.type(screen.getByRole('spinbutton', {name: /names to generate/}), '5');
        userEvent.click(screen.getByText('Generate!'));

        await waitFor(() => expect(screen.getByText(/name4/)).toBeVisible());

        for (let i =0; i<5; i++) {
            expect(screen.getByText(`name${i}`)).toBeVisible();
        }

        expect(screen.queryByText(`name5`)).toBe(null); 
    });

    test('testing whether temperature value is validated correctly', async () => {
        // no value 
        userEvent.click(screen.getByText('Generate!'));
        expect(screen.getByText(/no value was provided at all/)); 

        // value to low 

        userEvent.type(screen.getByRole('spinbutton', {name: /temperature value/}), '0.2');
        userEvent.click(screen.getByText('Generate!'));

        expect(screen.getByText(/0.2 does not meet those conditions/)); 

        userEvent.clear(screen.getByRole('spinbutton', {name: /temperature value/})); 

        // value to high

        userEvent.type(screen.getByRole('spinbutton', {name: /temperature value/}), '5.2');
        userEvent.click(screen.getByText('Generate!'));

        expect(screen.getByText(/5.2 does not meet those conditions/)); 


    });
}); 
import {screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {setupAppForTests} from '../tests-setup/setup-app';

setupAppForTests(false);


test(`testing error case for Conv Model component-- error button should be shown and we should be able to go back to 
view that was present before uploading an image`,
    async () => {
        let file = new File(['(⌐□_□)'], 'test_image1.jpg', { type: 'image/jpg' });
        let imageInputTag = screen.getByLabelText(/Submit a .png or .jpg/);

        userEvent.upload(imageInputTag, file);
        await waitFor(() => expect(screen.getByText('Submit')).toBeVisible());
        userEvent.click(screen.getByText('Submit'));

        await waitFor(() => expect(screen.getByText(/There was an error/)).toBeVisible()); 

        userEvent.click(screen.getByText(/There was an error/));

        expect(screen.getByText('Try new image')).toBeVisible(); 

        userEvent.click(screen.getByText('Try new image'));

        expect(screen.getByText(/Upload a .png or .jpeg/)).toBeVisible(); 

    }
);


test('testing whether appropriate error is displayed when server is down for quotes Language Model component', async () => {
    userEvent.click(screen.getByText('Generate Names'));

    await waitFor(() => expect(screen.getByText(/Sorry, there was/)).toBeVisible());
    userEvent.click(screen.getByText('Get New Quote'));

    await waitFor(() => expect(screen.getByText(/Sorry, there was/)).toBeVisible());

});
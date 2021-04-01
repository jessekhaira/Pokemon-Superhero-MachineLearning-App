import {screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {setupAppForTests} from '../tests-setup/setup-app';

setupAppForTests(); 

let file; 
let imageInputTag;

test('testing onChange event handler on input tag -- uploading an image', async () => {
    imageInputTag = screen.getByLabelText(/Submit a .png or .jpg/);
    file = new File(['(⌐□_□)'], 'test_image1.jpg', { type: 'image/jpg' });

    // testing on change handler on input tag pokeImg -- before image is uploaded, then after image is uploaded
    expect(screen.getByText(/This is the image you uploaded/)).not.toBeVisible(); 
    expect(screen.getByText('Submit')).not.toBeVisible(); 
    expect(screen.getByAltText('Your uploaded image')).not.toHaveAttribute('src');

    userEvent.upload(imageInputTag, file);

    await waitFor(() => expect(screen.getByText(/This is the image you uploaded/)).toBeVisible());
    expect(screen.getByText('Submit')).toBeVisible(); 
    expect(screen.getByAltText('Your uploaded image')).toHaveAttribute('src');
});


describe('testing onClick event handler on div with ID submitConv', () => {
    async function setUpClickHandlerTestSubmitConv(error = false) {
        imageInputTag = screen.getByLabelText(/Submit a .png or .jpg/);

        if (error) {
            file = new File([""], "test_failure.txt", {type: "text/plain"}); 
        }

        else {
            file = new File(['(⌐□_□)'], 'test_image1.jpg', { type: 'image/jpg' });
        }

        userEvent.upload(imageInputTag, file);
        await waitFor(() => expect(screen.getByText('Submit')).toBeVisible());
        userEvent.click(screen.getByText('Submit'));

        if (error) {
            await waitFor(() => expect(screen.getByText(/There was an error/)).toBeVisible()); 
        }

        else {
            await waitFor(() => expect(screen.getByText('See Top Prediction')).toBeVisible()); 
        }

    }
    test(`testing error case for handler -- error button should be shown and we should be able to go back to 
        original view before uploading an image`,

        async () => {

            await setUpClickHandlerTestSubmitConv(true);

            expect(screen.getByText(/Upload a .png or .jpeg/)).not.toBeVisible(); 
            
            userEvent.click(screen.getByText(/There was an error/));

            expect(screen.getByText('Try new image')).toBeVisible(); 

            userEvent.click(screen.getByText('Try new image'));

            expect(screen.getByText(/Upload a .png or .jpeg/)).toBeVisible(); 

    });

}); 

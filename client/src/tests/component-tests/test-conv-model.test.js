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

test(`testing error case for handler -- error button should be shown and we should be able to go back to 
view that was present before uploading an image`,

async () => {
    imageInputTag = screen.getByLabelText(/Submit a .png or .jpg/);
    file = new File([""], "test_failure.txt", {type: "text/plain"}); 

    userEvent.upload(imageInputTag, file);
    await waitFor(() => expect(screen.getByText('Submit')).toBeVisible());
    userEvent.click(screen.getByText('Submit'));

    await waitFor(() => expect(screen.getByText(/There was an error/)).toBeVisible()); 

    userEvent.click(screen.getByText(/There was an error/));

    expect(screen.getByText('Try new image')).toBeVisible(); 

    userEvent.click(screen.getByText('Try new image'));

    expect(screen.getByText(/Upload a .png or .jpeg/)).toBeVisible(); 

});


describe('testing onClick event handler on div with ID submitConv for success cases', () => {
    beforeEach(async () => {
        imageInputTag = screen.getByLabelText(/Submit a .png or .jpg/);
        file = new File(['(⌐□_□)'], 'test_image1.jpg', { type: 'image/jpg' });

        userEvent.upload(imageInputTag, file);
        await waitFor(() => expect(screen.getByText('Submit')).toBeVisible());
        userEvent.click(screen.getByText('Submit'));
        await waitFor(() => expect(screen.getByText('See Top Prediction')).toBeVisible()); 
        expect(screen.getByText(/Upload a .png or .jpeg/)).not.toBeVisible(); 

    }); 

    test(`testing success case for onclick handler -- clicking on see top prediction button`, async () => {

        userEvent.click(screen.getByText('See Top Prediction'));

        expect(screen.getByText('See Top Prediction')).not.toBeVisible();
        expect(screen.getByText(/With a probability of 70.0%, the AI says/)).toBeVisible(); 
        expect(screen.getByText(/Go Back/)).toBeVisible(); 

        userEvent.click(screen.getByText(/Go Back/));

        expect(screen.getByText('See Top Prediction')).toBeVisible();
        expect(screen.getByText(/With a probability of 70.0%, the AI says/)).not.toBeVisible(); 

    })

}); 

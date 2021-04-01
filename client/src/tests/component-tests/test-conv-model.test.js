import {screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {setupAppForTests} from '../tests-setup/setup-app';

setupAppForTests(); 

let file; 
let imageInputTag;

test('testing onChange event handler on input tag -- uploading an image', async () => {
    file = new File(['(⌐□_□)'], 'test_image1.jpg', { type: 'image/jpg' });
    imageInputTag = screen.getByLabelText(/Submit a .png or .jpg/);
    expect(screen.getByText(/This is the image you uploaded/)).not.toBeVisible(); 
    userEvent.upload(imageInputTag, file);
    // image gets uploaded, we should be able to see text indicating that image uploaded succesfully
    await waitFor(() => expect(screen.getByText(/This is the image you uploaded/)).toBeVisible());
});
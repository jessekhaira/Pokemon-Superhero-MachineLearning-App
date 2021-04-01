import {screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {setupAppForTests} from '../tests-setup/setup-app';

setupAppForTests(); 

let file; 
let imageInputTag;

test('testing onChange event handler on input tag -- uploading an image', async () => {
    file = new File(['(⌐□_□)'], 'test_image1.jpg', { type: 'image/jpg' });
    imageInputTag = screen.getByLabelText(/Submit a .png or .jpg/);

    // testing on change handler on input tag pokeImg -- before image is uploaded, then after image is uploaded
    expect(screen.getByText(/This is the image you uploaded/)).not.toBeVisible(); 
    expect(screen.getByText('Submit')).not.toBeVisible(); 
    expect(screen.getByAltText('Your uploaded image')).not.toHaveAttribute('src');

    userEvent.upload(imageInputTag, file);

    await waitFor(() => expect(screen.getByText(/This is the image you uploaded/)).toBeVisible());
    expect(screen.getByText('Submit')).toBeVisible(); 
    expect(screen.getByAltText('Your uploaded image')).toHaveAttribute('src');
});


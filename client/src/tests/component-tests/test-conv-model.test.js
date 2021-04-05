import {screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {setupAppForTests} from '../tests-setup/setup-app';

setupAppForTests(); 

let file; 
let imageInputTag;

beforeAll(() => {
    file = new File(['(⌐□_□)'], 'test_image1.jpg', { type: 'image/jpg' });
})

test('testing onChange event handler on input tag -- uploading an image', async () => {
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



describe('testing onClick event handler on div with ID submitConv for success cases', () => {
    beforeEach(async () => {
        imageInputTag = screen.getByLabelText(/Submit a .png or .jpg/);

        userEvent.upload(imageInputTag, file);
        await waitFor(() => expect(screen.getByText('Submit')).toBeVisible());
        userEvent.click(screen.getByText('Submit'));
        await waitFor(() => expect(screen.getByText('See Top Prediction')).toBeVisible()); 
        expect(screen.getByText(/Upload a .png or .jpeg/)).not.toBeVisible(); 

    }); 

    test(`Clicking on see top prediction button -- testing click handler`, async () => {

        userEvent.click(screen.getByText('See Top Prediction'));

        expect(screen.getByText('See Top Prediction')).not.toBeVisible();
        expect(screen.getByText(/With a probability of 70.0%, the AI says/)).toBeVisible(); 
        expect(screen.getByText(/Go Back/)).toBeVisible(); 

        userEvent.click(screen.getByText(/Go Back/));

        expect(screen.getByText('See Top Prediction')).toBeVisible();
        expect(screen.getByText(/With a probability of 70.0%, the AI says/)).not.toBeVisible(); 

    })


    test(`Clicking on start new button -- testing click handler`, async () => {

        userEvent.click(screen.getByText('Start New'));

        expect(screen.getByText('See Top Prediction')).not.toBeVisible();
        expect(screen.getByText(/Upload a .png or .jpeg/)).toBeVisible(); 
        expect(screen.getByText(/Submit a .png or .jpg/)).toBeVisible(); 
    })

    test(`Clicking on see all probabilities button -- testing click handler`, async () => {
        userEvent.click(screen.getByRole('button', {name: "button that shows all probabilities"}));

        expect(screen.getByText('See All Probabilities')).not.toBeVisible();
        expect(screen.getByText('Batman: 70%')).toBeVisible(); 
        expect(screen.getByText('Superman: 10%')).toBeVisible(); 
        expect(screen.getByText('Hulk: 10%')).toBeVisible(); 
        expect(screen.getByText('Spiderman: 10%')).toBeVisible(); 

    });


}); 

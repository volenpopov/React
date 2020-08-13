# EventsApp 
### SoftUni Course Work for ReactJS Course – Юни 2020

This is a ReactJS client app that uses Firebase as backend.

Libraries used: ReactJS, ReactRouter, Redux, ReduxThunk, Bootstrap, Jest, Enzyme, Axios

The app is a platform for sharing events.
Guest users can register/login and can view the upcoming future events, but are not able to make bookings.
Registered users can view the  upcoming future events and are also able to make bookings. They can also cancel any of their personal bookings from the Bookings page. There is also a user profile page which lists all the created events by the user and the number of attendees to the event (the number of other users that have booked this event). The user can also delete any of their own events which will also cancel all the current bookings of other users to the respective event. Each user also is able to choose a personal theme for the website from the 6 themes that are available.

Description:
- the project was bootstrapped with the creact-react-app command
- includes public and private parts
- includes both class based components and functional components with hooks
- includes unit tests for react components and reducers
- includes Redux for state management related to the currently logged in user information and dispatching actions related to user authentication
- includes ReactContext API for changing the website theme
- includes error handling and data validation
- includes bound forms
- includes user notifications
- is fully responsible

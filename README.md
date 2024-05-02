# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

1. Find today's date and display it in JSX
1. Get the astrology sign data
1. Implement findZodiacSign() function
1. Display current Zodiac sign in JSX
1. Map over all the signs and display their signNames as buttons in the JSX.
1. Turn the sign buttons into a separate SignButton component. Pass the signName as a prop.
1. Style the buttons so that they look like the first picture
1. Now we want to be able to click on all of these SignButtons to display more information below about that sign. First, let's make those buttons work.
1. We need to create a function that gets triggered when the user clicks the button.
1. Let's create a SignInfo component. It should take in a signData object as a prop. In its JSX, it should display the signName as an h2 and a div. Inside that div, it should show the startDate and endDate, its luckyNumbers, and the daily horoscope for that sign.
1. Use NASA API to display the astronomy picture of the day

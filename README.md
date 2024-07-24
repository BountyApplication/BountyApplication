# BountyApplication 
BountyApplication can be used as a very simple internal Self Hosted POS System that runs on a Rapsberry Pi 
You ca add products with a Price, add Users with in internal Pocketmoney Balance and use that Balance to pay for products.

We use it as a Candyshop register so that Kids can buy Candy cashless on Summercamp.

The Software also requires the BountyBackend to run. 

## Available Scripts

In the project directory, you can run the following scripts
First Navigate to the Project folder with i.e. `cd BountyApplication/`.

### Development mode
To run the app in the development mode use `npm start`.
This shout start the App and make it avaiable unter [http://localhost:3000](http://localhost:3000) in your browser. The page will reload when you make changes.\
You may also see any lint errors in the console.

### Test runner
Launch the test runner in the interactive watch mode with `npm test`.\
For more information see the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests).

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)


## Installing BountyApplication on a Pasrpberry Pi
To Install BountyApplication on a Raspberry Pi use a fresh installation of a Linux Distirbution and run the Folloing Commands

Install NodeJS with 
`install nodejs npm`
https://pimylifeup.com/raspberry-pi-nodejs/


- git clone https://github.com/BountyApplication/BountyApplication.git

- cd BountyApplication/
- npm install
- npm start

## setup production server:

- npm run build
to test: serve -s build

- cd 
- sudo nano /usr/lib/systemd/system/bountyapplication.service

copy this into the file 

    [Unit]
    Description=Bounty Frontend Application
    After=network.target

    [Service]
    User=bounty
    ExecStart=serve -s build
    WorkingDirectory=/home/bounty/BountyApplication
    Restart=always

    [Install]
    WantedBy=multi-user.target

- sudo systemctl enable bountyapplication.service


## update code 

- git pull

- npm run build

- sudo reboot

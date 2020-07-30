# tableau-data-connector
Tableau data connector for bridge

## Getting started
TODO

## Development
* Install `node12` and `yarn`
* Run `yarn install`
* Start the webpack-dev-server with `yarn start`
* Open http://localhost:8888/

This will start the bridge WebDataConnector (what configures tableau). To test out with the
Tableau simulator, see the below section.

### Using the Tableau Simulator
* Start the webpack-dev-server with `yarn start`
* Open `http://localhost:8888/Simulator/index.html`
* Set the `Connector URL:` as  `http://localhost:8888`
* Click on `Start Interactive Phase`
  * For the `URL:` set to your bridge domain (eg: `https://bridge.bridgeapp.com`)
  * For the `KEY:` set to your bridge domains basic api key (eg: `Basic NDZ...............`)

In order get past CORS errors when running the simulator locally. All `/api` traffic is being sent through a local webpack-dev-server proxy.
See the `webpack/webpack.dev.js` config, and the `src/bridgeWDC.js#setUrl` function.

## Running tests 
* Run `yarn test`

## Production build
* `yarn build`

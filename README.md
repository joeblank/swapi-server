### Node Exercise

This is a simple node/express server that will fetch data from the SWAPI api about Star Wars people and planets.

This server is listening on port `4000`. 

To run this express server:
1. Clone this repo.
2. Run `npm install`.
3. Run `node index.js` or `nodemon index.js`.


There are two exposed enpoints:
* `/people`
  * This will fetch all Star Wars characters.
  * Can add optional query parameter `sortBy`. Can sort by `name`, `height`, or `mass`
  * Example: `http://localhost:4000/people?sortBy=name`
* `/planets`
  * This will fetch all Star Wars planets.
  * Each planet object has a residents array. By default, SWAPI will give you each resident's url and not the resident's data object. _The response you will recieve will contain each resident's data object instead of a url_.
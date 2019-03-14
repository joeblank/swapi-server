const axios = require('axios');

module.exports = {
  async getPeople(req, res) {
    let people = [];
    let url = 'https://swapi.co/api/people'
    let allPeopleCollected = false;

    while (!allPeopleCollected) {
      try {
        const response = await axios.get(url);
        const { results, next } = response.data;
        people.push(...results)
        if (next) url = next;
        else allPeopleCollected = true;
      } catch (e) {
        console.error(e)
      }
    }

    const { sortBy } = req.query;

    if (sortBy) {
      let lowercaseSortBy = sortBy.toLowerCase()
      switch (lowercaseSortBy) {
        case 'name':
          people.sort((person, nextPerson) => {
            const firstName = person.name.toLowerCase();
            const secondName = nextPerson.name.toLowerCase();
            if (firstName < secondName) return -1;
            else if (firstName > secondName) return 1;
            else return 0;
          });
          break;
        case 'height':
          const peopleByUnknownHeight = people.filter(({ height }) => height === 'unknown');
          const peopleByKnownHeight = people.filter(({ height }) => height !== 'unknown');
          peopleByKnownHeight.sort((person, nextPerson) => person.height - nextPerson.height);
          // Adding those with unknown height to the end of the sorted array. I think this makes 
          // more sense to do and is what the average user might expect if data is sorted by height
          peopleByKnownHeight.push(...peopleByUnknownHeight);
          people = peopleByKnownHeight;
          break;
        case 'mass':
          const peopleByUnknownMass = people.filter(({ mass }) => mass === 'unknown');
          const peopleByKnownMass = people.filter(({ mass }) => mass !== 'unknown');
          peopleByKnownMass.sort((person, nextPerson) => {
            // Check to see if either strings have a comma. If so, remove so it can be properly sorted.
            if (person.mass.indexOf(',') !== -1 || nextPerson.mass.indexOf(',') !== -1)
              return parseInt(person.mass.replace(/,/g, '')) - parseInt(nextPerson.mass.replace(/,/g, ''));
            else
              return parseInt(person.mass, 10) - parseInt(nextPerson.mass, 10)
          });
          // Same as above with height. If mass is unknown, that person will be added to the end of sorted array.
          peopleByKnownMass.push(...peopleByUnknownMass);
          people = peopleByKnownMass;
          break;
        default:
          return res.status(400).send(`Can only sort people by name, height, and mass. Invalid query param value: ${sortBy}`)
      }
    }

    res.status(200).send(people)
  },
  async getPlanets(req, res) {
    let planets = [];
    let url = 'https://swapi.co/api/planets'
    let allPlanetsCollected = false;

    while (!allPlanetsCollected) {
      try {
        const response = await axios.get(url);
        const { results, next } = response.data;
        planets.push(...results)
        if (next) url = next;
        else allPlanetsCollected = true;
      } catch (e) {
        console.error(e)
      }
    }
    /*
      Although I generally want to avoid nested loops, I am going to use a nested loop for the following reason:
      Under the assumption that if a character is the resident of one planet, they cannot be the resident of another, 
      I will only have to make one http request for each resident of the planets (with no duplications). Since each 
      http request for a certain character needs to happen, and will only happen once, I would argue that the code 
      below has a Big O notation closer to O(n) as opposed to something approaching O(n^2)...which would be more 
      typical of nested loops.
    */

    for (const planet of planets) {
      for (let i = 0; i < planet.residents.length; i++) {
        try {
          const { data } = await axios.get(planet.residents[i]);
          planet.residents[i] = data
        } catch (e) {
          console.error(e);
        }
      }
    }
    res.status(200).send(planets)
  }
}


let pokemonRepository = (function () {
  let pokemonList = [];
  let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=151';



  function add(pokemon) {
    if (
      typeof pokemon === "object" &&
      "name" in pokemon
    ) {
      pokemonList.push(pokemon);
    } else {
      console.log("pokemon is not correct");
    }

  }
  function getAll() {
    return pokemonList;
  }


  function addListItem(pokemon) {
    let pokemonli = document.querySelector(".pokemon-list");
    let liItem = document.createElement("li");
    liItem.classList.add("list-group-item");

    let button = document.createElement("button");
    button.classList.add("btn", "btn-primary", "pokemon-button");

    let pokemonName = document.createElement("span");
    pokemonName.innerText = pokemon.name;
    button.appendChild(pokemonName);

    let pokemonImage = document.createElement("img");
    pokemonImage.setAttribute("src", pokemon.imageUrl);
    pokemonImage.setAttribute("alt", pokemon.name + " image");
    pokemonImage.setAttribute("class", "pokemon-image");
    button.appendChild(pokemonImage);

    button.addEventListener('click', () => showDetails(pokemon));

    liItem.appendChild(button);
    pokemonli.appendChild(liItem);
  }


  async function loadList() {
    try {
      const response = await fetch(apiUrl);
      const json = await response.json();
      // Create an array of promises to load details for each Pokémon
      const loadDetailsPromises = json.results.map(async (item) => {
        let pokemon = {
          name: item.name,
          detailsUrl: item.url,
        };
        await loadDetails(pokemon); // Wait for the details to be fetched for each Pokémon
        return pokemon;
      });
      // Wait for all Pokémon details to be loaded in parallel
      const pokemons = await Promise.all(loadDetailsPromises);
      // After all details are loaded, add them to the list
      pokemons.forEach(pokemon => {
        addListItem(pokemon);
      });
    } catch (e) {
      console.error("Error loading Pokémon list", e);
    }
  }



  async function loadDetails(item) {
    try {
      const response = await fetch(item.detailsUrl);  // Wait for the details of each Pokémon
      const details = await response.json();
  
      // Add the details to the item object
      item.imageUrl = details.sprites.front_default;
      item.height = details.height;
      item.types = details.types;
      item.weight = details.weight;
      item.abilities = details.abilities;

      // console.log('Loaded details for:', item.name);
      // console.log('Types:', item.types) 

    } catch (e) {
      console.error("Error fetching details", e);
    }
  }




   



  function showModal(title, text, img) {
    let modalTitle = document.querySelector("#pokemonModalLabel");
    let modalBody = document.querySelector(".modal-body");
    let pokemonHeight = document.querySelector("#pokemonHeight");
    let pokemonImage = document.querySelector("#pokemonImage");

    modalTitle.innerText = title;
    pokemonHeight.innerHTML = text;

    pokemonImage.setAttribute('src', img);

    $('#pokemonModal').modal('show');
  }





  function showDetails(pokemon) {

    console.log('Showing details for:', pokemon.name); // Using this to make sure that they are being called correctly
    console.log('Image URL:', pokemon.imageUrl); // same thing

    pokemonRepository.loadDetails(pokemon).then(function () {
      showModal(

        pokemon.name,
        'Type: ' + pokemon.types.map(type => type.type.name).join(', ') +
        '<br>Height: ' + pokemon.height +
        '<br>Weight: ' + pokemon.weight,
        pokemon.imageUrl
      );



    }).catch(function (error) {
      console.error("error loading details", error)
    });
  }



  return {
    add: add,
    getAll: getAll,
    addListItem: addListItem,
    loadList: loadList,
    loadDetails: loadDetails,
  };
})();













function filterByType(type) {
  console.log('Filtering by type:', type);  // This'll log the selected type

  // Filter the actual Pokémon data (from the API) by the selected type:
  let filteredPokemons = pokemonRepository.getAll().filter(pokemon => {
    // Log each Pokémon's types to see if the comparison works
    console.log('Checking Pokémon:', pokemon.name, 'Types:', pokemon.types);

    // Check if any of the types match the selected type
    let matchFound = pokemon.types.some(t => {
      console.log('Comparing Pokémon Type:', t.type.name, 'with selected Type:', type); // Log each type comparison
      return t.type.name.toLowerCase().trim() === type.toLowerCase().trim(); // Case-insensitive comparison
    });

    // Log the result of the comparison
    console.log('Match found for', pokemon.name, ':', matchFound);

    return matchFound; // Return whether there was a match
  });

  console.log('Filtered Pokémon:', filteredPokemons);  // Log filtered Pokémon result

  // Display the filtered Pokémon list, including their image URLs
  displayPokemon(filteredPokemons);

  // Highlight the active type in the navbar
  highlightActiveType(type);
}




//this is just to test to see if the filtering works for a given list of pokemon to see if the filtering works 

// function filterByType(type) {
//   console.log('Filtering by type:', type);  // Log the selected type

//   // Hardcoded list of Pokémon for testing:
//   let testPokemons = [
//     { 
//       name: 'Bulbasaur', 
//       types: [{ type: { name: 'grass' } }, { type: { name: 'poison' } }],
//       imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png'  // Image URL for Bulbasaur
//     },
//     { 
//       name: 'Charmander', 
//       types: [{ type: { name: 'fire' } }],
//       imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png'  // Image URL for Charmander
//     },
//     { 
//       name: 'Squirtle', 
//       types: [{ type: { name: 'water' } }],
//       imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png'  // Image URL for Squirtle
//     }
//   ];
//   // Filter the testPokemons list by the selected type:
//   let filteredPokemons = testPokemons.filter(pokemon => {
//     return pokemon.types.some(t => t.type.name.toLowerCase().trim() === type.toLowerCase().trim());
//   });
//   console.log('Filtered Pokémon:', filteredPokemons);  // Log filtered Pokémon result
//   displayPokemon(filteredPokemons);  // Display the filtered Pokémon list
//   highlightActiveType(type);  // Highlight the active type in the navbar
// }







function displayPokemon(pokemons) {
  let pokemonList = document.querySelector(".pokemon-list");
  pokemonList.innerHTML = '';

  pokemons.forEach(pokemon => {
    pokemonRepository.addListItem(pokemon);
  });
}

function highlightActiveType(type) {
  let links = document.querySelectorAll('.nav-link');
  links.forEach(link => {
    if (link.innerText.toLowerCase() === type) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

function showAllPokemon() {
  highlightActiveType('');
  console.log('Showing all Pokémon');
  displayPokemon(pokemonRepository.getAll());
}





document.addEventListener('DOMContentLoaded', function () {


  document.querySelector('#grassTypeLink').addEventListener('click', function (event) {
    event.preventDefault();
    filterByType('grass');
    highlightActiveType('grass');
  });
  document.querySelector('#fireTypeLink').addEventListener('click', function (event) {
    event.preventDefault();
    filterByType('fire');
    highlightActiveType('fire');
  });
  document.querySelector('#waterTypeLink').addEventListener('click', function (event) {
    event.preventDefault();
    filterByType('water');
    highlightActiveType('water');
  });
  document.querySelector('#flyingTypeLink').addEventListener('click', function (event) {
    event.preventDefault();
    filterByType('flying');
    highlightActiveType('flying');
  });
  document.querySelector('#rockTypeLink').addEventListener('click', function (event) {
    event.preventDefault();
    filterByType('rock');
    highlightActiveType('rock');
  });
  document.querySelector('#fightingTypeLink').addEventListener('click', function (event) {
    event.preventDefault();
    filterByType('fighting');
    highlightActiveType('fighting');
  });
  document.querySelector('#ghostTypeLink').addEventListener('click', function (event) {
    event.preventDefault();
    filterByType('ghost');
    highlightActiveType('ghost');
  });
  document.querySelector('#allPokemonLink').addEventListener('click', function (event) {
    event.preventDefault();
    showAllPokemon();
    highlightActiveType('');
  });
});





pokemonRepository.loadList().then(function () {
  pokemonRepository.getAll().forEach(function (pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});
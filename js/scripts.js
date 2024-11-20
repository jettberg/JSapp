let pokemonRepository = (function () {
  let pokemonList = [];
  let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=151';

  function setList(pokemons) {
    pokemonList = pokemons;
  }

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




  function showDetails(pokemon) {
    console.log('Showing details for:', pokemon.name);
    console.log('Image URL:', pokemon.imageUrl);
    console.log('Back Image URL:', pokemon.backImageUrl);
  
    pokemonRepository.loadDetails(pokemon).then(function () {
      // Pass the description when showing the modal
      showModal(
        pokemon.name,
        'Type: ' + pokemon.types.map(type => type.type.name).join(', ') +
        '<br>Height: ' + pokemon.height +
        '<br>Weight: ' + pokemon.weight,
        pokemon.imageUrl,
        pokemon.description,
        pokemon.backImageUrl
      );
    }).catch(function (error) {
      console.error("Error loading details", error);
    });
  }





  function showModal(title, text, img, description, backImg) {
    let modalTitle = document.querySelector("#pokemonModalLabel");
    let modalBody = document.querySelector(".modal-body");
    let pokemonHeight = document.querySelector("#pokemonHeight");
    let pokemonImage = document.querySelector("#pokemonImage");
    let pokemonBackImage = document.querySelector("#pokemonBackImage");
    let pokemonDescription = document.querySelector("#pokemonDescription");
  
    modalTitle.innerText = title;
    pokemonHeight.innerHTML = text;
    pokemonImage.setAttribute('src', img);
    pokemonBackImage.setAttribute('src', backImg); // Use backImg here
  
    pokemonDescription.innerHTML = description || "No description available."; // Show description if available
  
    $('#pokemonModal').modal('show');
  }






  function addListItem(pokemon) {
    let pokemonli = document.querySelector(".pokemon-list");
    let liItem = document.createElement("li");
    liItem.classList.add("list-group-item");
  
    let button = document.createElement("button");
    button.classList.add("btn", "btn-primary", "pokemon-button");
  
    let pokemonName = document.createElement("span");
    pokemonName.classList.add("pokemon-name");
    pokemonName.innerText = pokemon.name;
    button.appendChild(pokemonName);
  
    let pokemonImage = document.createElement("img");
    pokemonImage.setAttribute("src", pokemon.imageUrl);
    pokemonImage.setAttribute("alt", pokemon.name + " image");
    pokemonImage.setAttribute("class", "pokemon-image");
    button.appendChild(pokemonImage);
  
    button.addEventListener('click', function () {
      showDetails(pokemon);
    });
  
    liItem.appendChild(button);
    pokemonli.appendChild(liItem);
  }




  async function loadList() {
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      const pokemonPromises = data.results.map(async (pokemon) => {
        let pokemonObject = {
          name: pokemon.name,
          detailsUrl: pokemon.url,
          evolutionChain: null, // Evolution chain will be populated later
        };
        await loadDetails(pokemonObject); // Load details including evolution
        return pokemonObject;
      });

      const pokemonList = await Promise.all(pokemonPromises);
      pokemonRepository.setList(pokemonList);

      // After loading all Pokémon, display them grouped by evolution
      displayPokemon(pokemonList);
    } catch (error) {
      console.error("Error loading the Pokémon list", error);
    }
  }




  async function loadDetails(item) {
    try {
      let url = item.detailsUrl;
      const response = await fetch(url);
      const details = await response.json();
  
      item.imageUrl = details.sprites.front_default;
      item.backImageUrl = details.sprites.back_default;
      item.height = details.height;
      item.types = details.types;
      item.weight = details.weight;
      item.abilities = details.abilities;
  
      // Fetch the species data to get the description
      const speciesResponse = await fetch(details.species.url);
      const speciesData = await speciesResponse.json();
  
      // Pokémon description (may differ by language)
      let description = speciesData.flavor_text_entries.find(entry => entry.language.name === 'en');
      item.description = description ? description.flavor_text : "No description available."; // Store description
  
      // Fetch the evolution chain data using the species URL
      let evolutionUrl = speciesData.evolution_chain.url;
      const evolutionResponse = await fetch(evolutionUrl);
      const evolutionData = await evolutionResponse.json();
  
      // Store evolution chain data
      item.evolutionChain = evolutionData.chain;
    } catch (error) {
      console.error("Error fetching details", error);
    }
  }




  // Group Pokémon by their evolutionary line
  function groupByEvolution(pokemonList) {
    let evolutionGroups = [];
    // Iterate over all Pokémon and group them by evolution chain
    pokemonList.forEach(pokemon => {
      let evolutionGroup = findOrCreateGroup(evolutionGroups, pokemon.evolutionChain);
      evolutionGroup.push(pokemon);
    });
    return evolutionGroups;
  }




  // Helper function to find an existing group by its evolution chain or create a new one
  function findOrCreateGroup(groups, evolutionChain) {
    // Using the first Pokémon in the chain as a unique identifier
    for (let group of groups) {
      if (group[0].evolutionChain.species.name === evolutionChain.species.name) {
        return group;
      }
    }
    // If no group was found, create a new one
    let newGroup = [];
    groups.push(newGroup);
    return newGroup;
  }




  return {
    add: add,
    getAll: getAll,
    addListItem: addListItem,
    loadList: loadList,
    loadDetails: loadDetails,
    setList: setList,
    groupByEvolution: groupByEvolution,
    showDetails: showDetails
  };
})();







// Display Pokémon in evolutionary groups
async function displayPokemon(pokemons) {
  const pokemonList = document.querySelector(".pokemon-list");
  pokemonList.innerHTML = '';
  // Group the Pokémon by evolution line
  const groupedPokemons = pokemonRepository.groupByEvolution(pokemons);
  // Render each group of Pokémon in a row
  groupedPokemons.forEach(group => {
    let row = document.createElement("div");
    row.classList.add("row");

    group.forEach(pokemon => {
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

      button.addEventListener('click', () => pokemonRepository.showDetails(pokemon));      liItem.appendChild(button);
      row.appendChild(liItem);
    });

    pokemonList.appendChild(row);
  });
}





function filterByType(type) {
  console.log('Filtering by type:', type);

  // Filter the actual Pokémon data (from the repository) by the selected type:
  let filteredPokemons = pokemonRepository.getAll().filter(pokemon => {
    // Check if the Pokémon has the selected type
    let matchFound = pokemon.types.some(t => t.type.name.toLowerCase() === type.toLowerCase());
    return matchFound; // Return whether there was a match
  });

  displayPokemon(filteredPokemons);
  highlightActiveType(type);
}




// Highlight the active type in the navbar
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




// Reset button handler
function showAllPokemon() {
  highlightActiveType('');
  let pokemonList = document.querySelector(".pokemon-list");
  pokemonList.innerHTML = '';
  // Load the full list of Pokémon again (re-fetching and re-rendering all of them)
  pokemonRepository.loadList().then(function () {
    // After reloading the list, display all Pokémon
    pokemonRepository.getAll().forEach(function (pokemon) {
      pokemonRepository.addListItem(pokemon);
    });
  });
}




// Initialize the app
pokemonRepository.loadList().then(function () {
  pokemonRepository.getAll().forEach(function (pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});













// Event listeners for the filter types
document.addEventListener('DOMContentLoaded', function () {
  pokemonRepository.loadList().then(function () {
    const allPokemons = pokemonRepository.getAll();
    displayPokemon(allPokemons);
  });
});

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
document.querySelector('#allPokemonLink').addEventListener('click', function (event) {
  event.preventDefault();
  highlightActiveType('');
  showAllPokemon();
});






const navbar = document.querySelector('.navbar');
const navbarToggler = document.querySelector('.navbar-toggler');
const navbarCollapse = document.querySelector('.navbar-collapse');

// Toggle the navbar when clicking the toggler button
navbarToggler.addEventListener('click', function (event) {
  event.stopPropagation(); // Prevent the click event from bubbling up
  navbarCollapse.classList.toggle('collapse'); // Toggle the navbar collapse
});

// When clicking anywhere outside the navbar, close the navbar
document.addEventListener('click', function (event) {
  if (!navbar.contains(event.target)) {
    // Close the navbar by collapsing it
    if (!navbarCollapse.classList.contains('collapse')) {
      navbarCollapse.classList.add('collapse');
    }
  }
});

// Prevent the navbar collapse toggle from closing if clicking inside the navbar
navbar.addEventListener('click', function (event) {
  event.stopPropagation(); // Prevent the click inside the navbar from closing it
});
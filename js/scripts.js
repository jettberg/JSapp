

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


  function loadList() {
    return fetch(apiUrl).then(function (response) {
      return response.json();
    }).then(function (json) {
      json.results.forEach(function (item) {
        let pokemon = {
          name: item.name,
          detailsUrl: item.url
        };
        loadDetails(pokemon).then(function () {
          addListItem(pokemon);
        });
      });
    }).catch(function (e) {
      console.error(e);
    })
  }



  function loadDetails(item) {
    let url = item.detailsUrl;
    return fetch(url).then(function (response) {
      return response.json();
    }).then(function (details) {
      console.log(details.sprites.front_default);  // adding this to verify it

      item.imageUrl = details.sprites.front_default;
      item.height = details.height;
      item.types = details.types;
      item.weight = details.weight;
      item.abilities = details.abilities;
    }).catch(function (e) {
      console.error("Error fetching details", e);
    });
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

pokemonRepository.loadList().then(function () {
  pokemonRepository.getAll().forEach(function (pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});
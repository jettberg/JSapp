

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
    let button = document.createElement("button");
    button.innerText = pokemon.name;
    button.classList.add("button");
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
        add(pokemon);
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
      item.imageUrl = details.sprites.front_default;
      item.height = details.height;
      item.types = details.types;
      item.weight = details.weight;
      item.abilities = details.abilities;
    }).catch(function (e) {
      console.error(e);
    });
  }


  function showModal(title, typeText, heightText, weightText, img) {
  let modalContainer = document.querySelector('#modal-container');
    modalContainer.innerHTML = '';


    let modal = document.createElement('div');
    modal.classList.add('modal');

    let closeButtonElement = document.createElement('button');
    closeButtonElement.classList.add('modal-close');
    closeButtonElement.innerText = 'X';
    closeButtonElement.addEventListener('click', hideModal);

    let pokemonName = document.createElement('h1');
    pokemonName.innerText = title;
    let pokemonHeight = document.createElement('p');
    pokemonHeight.innerText = heightText;
    let pokemonWeight = document.createElement('p');
    pokemonWeight.innerText = weightText;
    let pokemonType = document.createElement('p');
    pokemonType.innerText = typeText;

    let pokemonImage = document.createElement("img");
    pokemonImage.setAttribute("src", img);
    pokemonImage.setAttribute("width", '100%');
    pokemonImage.setAttribute("height", '100%');
    pokemonImage.setAttribute("alt", "Pokemon Sprite");

    modal.appendChild(closeButtonElement);
    modal.appendChild(pokemonName);
    modal.appendChild(pokemonHeight);
    modal.appendChild(pokemonType);
    modal.appendChild(pokemonWeight);    modal.appendChild(pokemonImage);
    modalContainer.appendChild(modal);

    modalContainer.classList.add('is-visible');


    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalContainer.classList.contains('is-visible')) {
        hideModal();
      }
    });

    modalContainer.addEventListener('click', (e) => {
      let target = e.target;
      if (target === modalContainer) {
        hideModal();
      }
    });
  }

  function hideModal() {
    let modalContainer = document.querySelector('#modal-container');
    modalContainer.classList.remove('is-visible');
  }

  function showDetails(pokemon) {

    console.log('Showing details for:', pokemon.name); // Using this to make sure that they are being called correctly

    pokemonRepository.loadDetails(pokemon).then(function () {
      showModal(
        
        pokemon.name,
        'Type: ' + pokemon.types.map(type => type.type.name).join(', '),
        'Height: ' + pokemon.height,
        'Weight: ' + pokemon.weight,
        pokemon.imageUrl
      );
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
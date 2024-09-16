

let pokemonRepository = (function () {

  let Charmander = {
    name: "Charmander",
    weight: 8.5,
    height: 0.6,
    types: ["fire"],
    abilities: ["Blaze", "Solar-power"]
  };

  let Bulbasaur = {
    name: "Bulbasaur",
    weight: 6.9,
    height: 0.7,
    types: ["grass", "poison"],
    abilities: ["Chlorophyll", "Overgrow"]
  };

  let Squirtle = {
    name: "Squirtle",
    weight: 9,
    height: 0.5,
    types: ["water"],
    abilities: ["Rain-dash", "Torrent"]
  };


  let pokemonList = [Charmander, Bulbasaur, Squirtle];

  function add(pokemon) {

    //   if(
    //     typeof pokemon === "object" &&
    //     "name" in pokemon &&
    //     "types" in pokemon &&
    //     "height" in pokemon &&
    //     "weight" in pokemon &&
    //     "abilities" in pokemon 
    //   ){
    //   pokemonRepository.push(pokemon);
    // } else {
    //   console.log("The pokemon is not correct");
    // 
    pokemonList.push(pokemon);
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
    button.addEventListener('click', function showDetails(pokemon) {
      console.log(pokemon.name);
    });

    liItem.appendChild(button);
    pokemonli.appendChild(liItem);
  }

  
  function showDetails(pokemon) {
    console.log(pokemon);
  }

  return {
    add: add,
    getAll: getAll,
    addListItem: addListItem,
    showDetails: showDetails
  };
})();

pokemonRepository.getAll().forEach(function (pokemon) {
  pokemonRepository.addListItem(pokemon)
});
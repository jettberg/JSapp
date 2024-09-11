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

let pokemonRepository = (function () {

//im not really sure if all of this data needs to be stored in the IIFE? cause the code pulls, and works correctly when it is inside or out so im not sure which is better
    // let Charmander = {
    //     name: "Charmander",
    //     weight: 8.5,
    //     height: 0.6,
    //     types: ["fire"],
    //     abilities: ["Blaze", "Solar-power"]
    // };
    
    // let Bulbasaur = {
    //     name: "Bulbasaur",
    //     weight: 6.9,
    //     height: 0.7,
    //     types: ["grass", "poison"],
    //     abilities: ["Chlorophyll", "Overgrow"]
    // };
    
    // let Squirtle = {
    //     name: "Squirtle",
    //     weight: 9,
    //     height: 0.5,
    //     types: ["water"],
    //     abilities: ["Rain-dash", "Torrent"]
    // };



let pokemonList = [Charmander, Bulbasaur, Squirtle];
  
    function add(pokemon) {
      pokemonList.push(pokemon);
    }
  
    function getAll() {
      return pokemonList;
    }
  
    return {
      add: add,
      getAll: getAll
    };
  })();







// for (let i = 0; i < pokemonList.length; i++) {
//     document.write(pokemonList[i].name + ", Height: ", pokemonList[i].height + ", <br><br>");
//     if (pokemonList[i].height > 0.6) {
//         document.write("Wow " + pokemonList[i].name + " is tall!<br><br>");
//     };
// };
// This was the previous code that was converted into the following:

pokemonRepository.getAll().forEach(listHeight);

function listHeight(item) {
    document.write (item.name + ", Height: " + item.height + " <br> <br>")
    if (item.height > 0.6) {
    document.write ("Wow " + item.name +" is tall!<br><br>")
}}

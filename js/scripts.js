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




for (let i = 0; i < pokemonList.length; i++) {
    document.write(pokemonList[i].name + ", Height: ", pokemonList[i].height + ", <br><br>");
    if (pokemonList[i].height > 0.6) {
        document.write("Wow " + pokemonList[i].name + " is tall!<br><br>");
    };
};

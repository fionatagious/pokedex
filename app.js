const url = "https://pokeapi.co/api/v2/pokemon/";

// let pokemon;

async function getPokemon() {
  try {
    const resp = await fetch(url);
    const data = await resp.json();
    // let pokemon = data.results;
    // console.log(pokemon);
    return data.results;
  } catch (err) {
    console.error(err);
  }
}

const pokemon = await getPokemon();
const pokeGrid = document.querySelector(".pokegrid");

// pokemon images and names
for (let p of pokemon) {
  let pokeImg = document.createElement("img");
  let id = p.url.split("/")[6];
  pokeImg.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

  let pokeName = document.createElement("p");
  let name = p.name;
  pokeName.innerText = name;

  let pokeDiv = document.createElement("div");

  pokeDiv.appendChild(pokeImg);
  pokeDiv.appendChild(pokeName);
  pokeGrid.appendChild(pokeDiv);
}

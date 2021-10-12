const url = "https://pokeapi.co/api/v2/pokemon/";

const playButton = document.getElementById("play");
playButton.disabled = true;
const playButtonColorEnabled = "rgb(255, 138, 138)";
const spriteSelected = "rgb(32, 211, 235)";

const nameElem = document.getElementById("name");
const baseXpElem = document.getElementById("basexp");
const heightElem = document.getElementById("height");
const weightElem = document.getElementById("weight");
const baseStatElem = document.getElementById("stats");
const detailPic = document.getElementById("detail-img");
const typesElem = document.getElementById("types");

const gameGrid = document.getElementById("game-grid");

let id;
let gameSet = new Set();
let cardArray = [];
let guessArray = [];

async function getPokemon() {
  try {
    const resp = await fetch(url);
    const data = await resp.json();
    return data.results;
  } catch (err) {
    console.error(err);
  }
}

// await makes JS wait until that promise settles and returns its result
const pokemonArray = await getPokemon();
const pokeGrid = document.querySelector(".pokegrid");

const createPokeSprites = function (pokemonArray) {
  for (let p of pokemonArray) {
    const pokeDivContainer = document.createElement("div");
    pokeDivContainer.className = "pokediv-cont";
    const pokeDiv = document.createElement("div");
    pokeDiv.className = "pokemon";
    pokeDiv.id = p.name; // create pokemon-specific id, e.g. "bulbasaur"

    id = p.url.split("/")[6]; // made assumption: url doesn't change; write tests
    const pokePic = document.createElement("img");
    pokePic.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

    const pokeName = document.createElement("p");
    pokeName.innerText = p.name;

    pokeDiv.appendChild(pokePic);
    pokeDiv.appendChild(pokeName);
    pokeDivContainer.appendChild(pokeDiv);
    pokeGrid.appendChild(pokeDivContainer);
  }
};

createPokeSprites(pokemonArray);

const detailGenerator = async function (detail) {
  const name = detail.name;
  const basexp = detail.base_experience;
  const height = detail.height;
  const weight = detail.weight;
  const baseStat = detail.stats[0].base_stat;

  let typesStr = "";
  for (let i = 0; i < detail.types.length; i++) {
    typesStr = typesStr.concat(detail.types[i].type.name, " ");
  }

  nameElem.innerHTML = `${name}`;
  baseXpElem.innerHTML = `<strong>Base Experience: </strong>${basexp}`;
  heightElem.innerHTML = `<strong>Height: </strong>${height}`;
  weightElem.innerHTML = `<strong>Weight: </strong>${weight}`;
  baseStatElem.innerHTML = `<strong>Base Stat: </strong>${baseStat}`;
  typesElem.innerHTML = `<strong>Types: </strong>${typesStr}`;

  detailPic.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  document.getElementById("poke-detail").appendChild(detailPic);
};

// mouseover pokemon to display basic pokemon stats in detail panel
document.querySelectorAll(".pokemon").forEach((item) => {
  item.addEventListener("mouseover", async function (e) {
    try {
      const str = item.firstChild.src.split("/")[8];
      id = str.substring(0, str.indexOf("."));
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
      const detail = await response.json();

      detailGenerator(detail);
    } catch (err) {
      console.error(err); // custom error handling- specific errors, e.g. API down, url broken - could validate
    }
  });
});

// click on 8 pokemon to include them in the memory game
document.querySelectorAll(".pokemon").forEach((item) => {
  item.addEventListener("click", async function (e) {
    try {
      let str = item.firstChild.src.split("/")[8];
      id = Number(str.substring(0, str.indexOf(".")));
      // create toggle function that uses discrete states of button?
      // setAttribute()?
      if (gameSet.has(id)) {
        gameSet.delete(id);
        this.style.backgroundColor = "powderblue";
        if (gameSet.size === 8) {
          playButton.disabled = false;
        } else {
          playButton.disabled = true;
        }
      } else {
        if (gameSet.size < 8) {
          gameSet.add(id);
          this.style.backgroundColor = spriteSelected;
          if (gameSet.size === 8) {
            playButton.disabled = false;
            playButton.style.backgroundColor = playButtonColorEnabled;
          }
        } else {
          this.style.backgroundColor = "powderblue";
        }
      }
      cardArray = [...Array.from(gameSet), ...Array.from(gameSet)];
      // this.style.backgroundColor = "rgb(32, 211, 235)";
    } catch (err) {
      console.error(err);
    }
  });
});

const resetPage = function () {
  playButton.disabled = true;
  const removeDetail = document.getElementById("poke-detail");
  const removePokedex = document.querySelector(".pokegrid");
  removeDetail.parentNode.removeChild(removeDetail);
  removePokedex.parentNode.removeChild(removePokedex);
};

playButton.addEventListener("click", async function (e) {
  try {
    resetPage();

    // shuffle - another function; could write a unit test
    cardArray.sort(() => 0.5 - Math.random());

    for (let card of cardArray) {
      const gameCard = document.createElement("div");
      gameCard.className = "card";
      gameCard.setAttribute("pokemon-id", card);
      const gamePic = document.createElement("img");
      gamePic.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${card}.png`;

      gameCard.appendChild(gamePic);
      gameGrid.appendChild(gameCard);
    }
  } catch (err) {
    console.error(err);
  }
});

document.querySelectorAll(".card").forEach((item) => {
  item.addEventListener("click", async function (e) {
    try {
      console.log("yes");
      console.log(item);
      // const id = item.getAttribute("pokemon-id");
      // guessArray.push(item.pokemon-id);
      // console.log(guessArray);
    } catch (err) {
      console.error(err);
    }
  });
});

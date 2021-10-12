const url = "https://pokeapi.co/api/v2/pokemon/";

const playButton = document.getElementById("play");
playButton.disabled = true;

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

async function getPokemon() {
  try {
    let resp = await fetch(url);
    let data = await resp.json();
    return data.results;
  } catch (err) {
    console.error(err);
  }
}

// but I thought async functions could only ever return a promise?? how does await break the expected behavior?
const pokemon = await getPokemon();
const pokeGrid = document.querySelector(".pokegrid");

// pokemon is an array of pokemon objects!
for (let p of pokemon) {
  let pokeDiv = document.createElement("div");
  pokeDiv.className = "pokemon";
  pokeDiv.id = p.name; // create pokemon-specific id, e.g. "bulbasaur"

  id = p.url.split("/")[6];
  let pokePic = document.createElement("img");
  pokePic.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

  let pokeName = document.createElement("p");
  pokeName.innerText = p.name;

  pokeDiv.appendChild(pokePic);
  pokeDiv.appendChild(pokeName);
  pokeGrid.appendChild(pokeDiv);
}

// mouseover pokemon to display basic stats
document.querySelectorAll(".pokemon").forEach((item) => {
  item.addEventListener("mouseover", async function (e) {
    try {
      let str = item.firstChild.src.split("/")[8];
      id = str.substring(0, str.indexOf("."));
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
      const detail = await response.json();

      // get characteristics from API
      let name = detail.name;
      let basexp = detail.base_experience;
      let height = detail.height;
      let weight = detail.weight;
      let baseStat = detail.stats[0].base_stat;

      let typesStr = "";
      for (let i = 0; i < detail.types.length; i++) {
        typesStr = typesStr.concat(detail.types[i].type.name, " ");
      }

      // inject into HTML elements
      nameElem.innerHTML = `${name}`;
      baseXpElem.innerHTML = `<strong>Base Experience: </strong>${basexp}`;
      heightElem.innerHTML = `<strong>Height: </strong>${height}`;
      weightElem.innerHTML = `<strong>Weight: </strong>${weight}`;
      baseStatElem.innerHTML = `<strong>Base Stat: </strong>${baseStat}`;
      typesElem.innerHTML = `<strong>Types: </strong>${typesStr}`;

      detailPic.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
      document.getElementById("poke-detail").appendChild(detailPic);
    } catch (err) {
      console.error(err);
    }
  });
});

// click on 8 pokemon to include them in the memory game
document.querySelectorAll(".pokemon").forEach((item) => {
  item.addEventListener("click", async function (e) {
    try {
      let str = item.firstChild.src.split("/")[8];
      id = Number(str.substring(0, str.indexOf(".")));

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
          this.style.backgroundColor = "rgb(32, 211, 235)";
          if (gameSet.size === 8) {
            playButton.disabled = false;
            playButton.style.backgroundColor = "rgb(255, 138, 138)";
          }
        } else {
          this.style.backgroundColor = "powderblue";
        }
      }
      // this.style.backgroundColor = "rgb(32, 211, 235)";
    } catch (err) {
      console.error(err);
    }
  });
});

playButton.addEventListener("click", async function (e) {
  try {
    playButton.disabled = true;
    let removeDetail = document.getElementById("poke-detail");
    let removePokedex = document.querySelector(".pokegrid");
    removeDetail.parentNode.removeChild(removeDetail);
    removePokedex.parentNode.removeChild(removePokedex);

    console.log(gameSet);
    // create a 4x4 grid of rectangles (16 total)
    for (let card of gameSet) {
      console.log(card);

      for (let i = 0; i < 2; i++) {
        let gameCard = document.createElement("div");
        gameCard.className = "card";
        // gameCard.id = card;
        let gamePic = document.createElement("img");
        gamePic.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${card}.png`;
        gameCard.appendChild(gamePic);
        gameGrid.appendChild(gameCard);
      }
    }
    // make 2 of each of the 8 selected appear in the grid
  } catch (err) {
    console.error(err);
  }
});

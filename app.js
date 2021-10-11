const url = "https://pokeapi.co/api/v2/pokemon/";
const nameElem = document.querySelector(".name");
const baseXpElem = document.querySelector(".basexp");
const heightElem = document.querySelector(".height");
const weightElem = document.querySelector(".weight");
const baseStatElem = document.querySelector(".stats");

let id;

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

// click on pokemon to get height, weight, nature
document.querySelectorAll(".pokemon").forEach((item) => {
  item.addEventListener("click", async function (e) {
    try {
      let str = item.firstChild.src.split("/")[8];
      id = str.substring(0, str.indexOf("."));
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
      const detail = await response.json();

      let name = detail.name;
      let basexp = detail.base_experience;
      let height = detail.height;
      let weight = detail.weight;
      let baseStat = detail.stats[0].base_stat;
      nameElem.innerHTML = `Name: ${name}`;
      baseXpElem.innerHTML = `Base Experience: ${basexp}`;
      heightElem.innerHTML = `Height: ${height}`;
      weightElem.innerHTML = `Weight: ${weight}`;
      baseStatElem.innerHTML = `Base Stat: ${baseStat}`;

      let detailPic = document.createElement("img");
      detailPic.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
      document.querySelector(".poke-detail").appendChild(detailPic);
    } catch (err) {
      console.error(err);
    }
  });
});

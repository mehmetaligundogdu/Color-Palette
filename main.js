const hexInputContainer = document.querySelector("#hexInputContainer");
const hexForm = document.querySelector("#hexColorForm");
const addNew = document.querySelector("#addNew");
const delItem = document.querySelector("#del");
let counter = 1;

addNew.addEventListener("click", () => {
  counter++;
  hexInputContainer.append(newColorInput(counter));
});
delItem.addEventListener("click", () => {
  if (counter > 1) {
    counter--;
    hexInputContainer.removeChild(hexInputContainer.lastChild);
  } else {
    alert("You can't delete all inputs!");
  }
});

function newColorInput(itemCount) {
  const newDivElement = document.createElement("div");
  newDivElement.classList.add("col-sm");
  newDivElement.innerHTML = `
    <label for="colorInput-${itemCount}" class="form-label">HEX Color</label>
    <input
    type="text"
    minlength="7"
    maxlength="7"
    class="form-control"
    id="colorInput-${itemCount}"
    name="color-${itemCount}">
  `;
  return newDivElement;
}
const colorCards = document.querySelector("#colorCards");

hexInputContainer.append(newColorInput(counter));
hexForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let localStorageColors = localStorage.getItem("colors")
    ? JSON.parse(localStorage.getItem("colors"))
    : []; //eğer localStoragede daha önceden colors varsa onu al ve parse ile json yap getir, yoksa boş array oluştur. Dıştaki (2.) arraydir.
  let colors = []; //Array içerisinde Array tutmak istediğimiz için, ilk (1.) array , form submit olana kadar 'colors' arrayıdır.
  Array.from(e.target.elements).forEach((item) => {
    if (item.type === "text") {
      colors.push(item.value);
    }
  });
  localStorageColors.push(colors); //localStoragedeki colors arrayine yeni colors arrayini ekle
  colorCards.append(addColorPalette(colors));

  localStorage.setItem("colors", JSON.stringify(localStorageColors)); //localStorageColorstaki colors arrayini stringe çevir ve localStorage'e kaydet
  hexForm.reset();
});

let localStorageColors = localStorage.getItem("colors")
  ? JSON.parse(localStorage.getItem("colors"))
  : [];

if (localStorageColors.length) {
  localStorageColors.forEach((colors) => {
    colorCards.append(addColorPalette(colors));
  });
}

function addColorPalette(items) {
  /* Eklenecek div elementi
     <div class="row gap-3">
       <div class="col-sm card" style="background-color: aqua"></div>
       <div class="col-sm card" style="background-color: greenyellow"></div>
     </div>;
     */
  const rowElement = document.createElement("div"); //en dıştaki div ve classları
  rowElement.classList.add("row", "gap-3", "my-3");

  items.forEach((item, index) => {
    rowElement.dataset.id = index;
    const cardItem = document.createElement("div"); //her bir item için div ve classları
    cardItem.classList.add("col-sm", "card", "color-card");
    cardItem.style.backgroundColor = item;
    rowElement.append(cardItem);
  });
  return rowElement;
}

colorCards.addEventListener("click", (e) => {
  //colorCardslara tıklandığında, eğer tıklanan elementin classı color-card ise, o elementin background-colorunu hexCode değişkenine ata ve copyToClipboard fonksiyonunu çalıştır.
  const clickedElement = e.target;
  if (clickedElement.classList.contains("color-card")) {
    const hexCode = clickedElement.style.backgroundColor;
    copyToClipboard(hexCode);
  }
});

function copyToClipboard(text) {
  //text parametresi ile gelen hexCode'u textarea elementine kopyala ve kopyalanan texti alert ile göster.
  const textarea = document.createElement("textarea");
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
  alert("Hex code copied to clipboard: " + text);
}

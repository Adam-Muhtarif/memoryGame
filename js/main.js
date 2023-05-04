// Set User Name
// ======================================
window.onload = function () {
  let userName = prompt("Enter Your Name");
  document.querySelector(".user-name").innerHTML = userName || "Unknown";
  document.querySelector(".container").classList.add("hide-before");
};
// ======================================

// Main
// =====================================================
let level = document.querySelector(".level");
let defaultLevel = "Normal";

if (localStorage.level) {
  level.value = localStorage.level;
} else {
  level.value = defaultLevel;
  localStorage.level = defaultLevel;
}

level.oninput = function () {
  localStorage.level = level.value;
  location.reload();
};

getShapes("js/shapes.json");
async function getShapes(link) {
  try {
    let data = await fetch(link);
    let objectOfShapes = await data.json();
    let arrOfShapes = objectOfShapes[localStorage.level];

    // Create Boxes Depend On Level
    // ======================================
    let boxId = 0;
    for (let i = 0; i < arrOfShapes.length * 2; i++) {
      document.querySelector(".play-ground").innerHTML += `
        <div id="${boxId++}"></div>
        `;
    }
    // ======================================

    // Store Empty Boxes Indexes
    // ======================================
    let boxes = document.querySelectorAll(".play-ground > div");
    let arrOfEmptyBoxesIndex = [];
    let num = 0;
    boxes.forEach((box) => {
      arrOfEmptyBoxesIndex.push(num);
      num++;
    });

    for (let i = 0; i < boxes.length / 2; i++) {
      genRandomIndex1(arrOfEmptyBoxesIndex);
    }
    // ======================================

    // Generate Random Shape
    // ======================================
    function generateRandomShape() {
      let randomShapeIndex = Math.floor(Math.random() * arrOfShapes.length);
      let randomShape = arrOfShapes[randomShapeIndex];
      arrOfShapes.splice(randomShapeIndex, 1);
      return randomShape;
    }
    // ======================================

    // Generate Random Box Index
    // ======================================
    function genRandomIndex1(arr) {
      let shape = generateRandomShape();
      let random = Math.floor(Math.random() * arr.length);
      let randomIndex1 = arr[random];

      arrOfEmptyBoxesIndex.forEach((index, i, arr) => {
        if (arr[i] == randomIndex1) {
          arrOfEmptyBoxesIndex.splice(i, 1);
        }
      });

      boxes[randomIndex1].innerHTML = `
        <i class="fab fa-${shape}"></i>
      `;

      genRandomIndex2(arrOfEmptyBoxesIndex, shape);
    }
    // ======================================

    // ======================================
    function genRandomIndex2(arr, shape) {
      let random = Math.floor(Math.random() * arr.length);
      let randomIndex2 = arr[random];

      arrOfEmptyBoxesIndex.forEach((index, i, arr) => {
        if (index == randomIndex2) {
          arrOfEmptyBoxesIndex.splice(i, 1);
        }
      });

      boxes[randomIndex2].innerHTML = `
        <i class="fab fa-${shape}"></i>
      `;
    }
    // ======================================

    // On Click
    // =======================================================
    let clickedBoxesClasses = [];
    let clickedBoxesIds = [];
    let correctBoxesIds = [];
    let wrongBoxesIds = [];
    let wrongTimes = 0;
    let correctTimes = 0;
    boxes.forEach((box, i, arr) => {
      box.onclick = function (e) {
        box.classList.toggle("hide-before");

        let clickedBoxClass = box.firstElementChild.className.split(" ")[1];
        clickedBoxesClasses.push(clickedBoxClass);
        clickedBoxesIds.push(box.id);

        if (clickedBoxesClasses.length == 2) {
          checkIfBoxesAreSame(clickedBoxesClasses[0], clickedBoxesClasses[1]);
          function checkIfBoxesAreSame(box1, box2) {
            if (box1 == box2) {
              // Correct Boxes
              correctTimes++;
              clickedBoxesIds.forEach((id) => {
                correctBoxesIds.push(id);
              });
              console.log(clickedBoxesIds);

              // Add Class Done
              boxes.forEach((box) => {
                correctBoxesIds.forEach((id) => {
                  if (id == box.id) {
                    box.classList.add("done");
                  }
                });
              });

              clickedBoxesClasses.length = 0;
              clickedBoxesIds.length = 0;
            } else {
              console.log("not same");
              wrongTimes++;
              document.querySelector(".wong-times").innerHTML = wrongTimes;

              clickedBoxesIds.forEach((id) => {
                wrongBoxesIds.push(id);
              });

              clickedBoxesClasses.length = 0;
              clickedBoxesIds.length = 0;

              flipWrongBoxes();
              function flipWrongBoxes() {
                boxes.forEach((box) => {
                  wrongBoxesIds.forEach((id) => {
                    if (id == box.id) {
                      setTimeout(() => {
                        box.classList.remove("hide-before");
                      }, 1500);
                    }
                  });
                });
                wrongBoxesIds.length = 0;
              }
            }
          }
        }

        if (correctTimes == boxes.length / 2) {
          startConfetti();
          document.getElementById("success").play();
        }
      };
    });

    document.querySelector(".start-over").addEventListener("click", () => {
      location.reload();
    });
    // =======================================================
  } catch (reason) {
    console.log(reason);
  }
}
// =======================================================

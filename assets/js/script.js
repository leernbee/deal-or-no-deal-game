const prizes = [
  1,
  5,
  10,
  25,
  50,
  75,
  100,
  150,
  200,
  300,
  400,
  500,
  750,
  1000,
  2500,
  5000,
  10000,
  25000,
  50000,
  100000,
  200000,
  300000,
  400000,
  500000,
  1000000,
  2000000
];

let totalPrizeMoney = prizes.reduce((a, b) => a + b);
let totalSelectedValues = 0;
let firstBriefcaseSelected = false;
let turnNumber = 0;
let numberBriefcaseToOpen = 6;
let lockBriefcase = false;
let chosenBriefcasePrize = 0;
let offerValue = 0;

const shuffleArray = arr =>
  arr
    .map(a => [Math.random(), a])
    .sort((a, b) => a[0] - b[0])
    .map(a => a[1]);

const showFirstMessage = () => {
  document.getElementById("messages").innerHTML = "";
  let newNode = document.createElement("h2");
  newNode.innerHTML = `Please select a briefcase to start the negotiation.`;
  document.getElementById("messages").appendChild(newNode);
};

//shuffle briefcases
let briefcases = shuffleArray(prizes);

//display briefcases
briefcases.forEach((briefcase, index) => {
  let newNode = document.createElement("div");
  newNode.className = "col-6 col-sm-4 col-md-3 col-lg-2 mb-2";
  newNode.innerHTML = `<button data-briefcase="${index +
    1}" class="briefcase btn-block btn"><i class="fas fa-briefcase"></i><span>${index +
    1}</span></button>`;
  document.getElementById("briefcases").appendChild(newNode);
});

showFirstMessage();

const chooseBriefcase = function() {
  if (!lockBriefcase) {
    let briefcaseNumber = this.innerText;
    let briefcasePrize = briefcases[parseInt(briefcaseNumber) - 1];

    if (firstBriefcaseSelected == false) {
      lockBriefcase = true;

      //show confirmation
      document.getElementById("messages").innerHTML = "";
      let newNode = document.createElement("h2");
      newNode.innerHTML = `You have just selected briefcase #${briefcaseNumber}. Are you sure?`;
      document.getElementById("messages").appendChild(newNode);

      newNode = document.createElement("div");
      newNode.innerHTML = `<button id="yesBtn" class="btn btn-warning">Yes</button> or <button id="noBtn" class="btn btn-danger">No</button> ?`;
      document.getElementById("messages").appendChild(newNode);

      document
        .getElementById("yesBtn")
        .addEventListener("click", () =>
          yesBtnClicked(briefcaseNumber, parseInt(briefcasePrize))
        );
      document.getElementById("noBtn").addEventListener("click", noBtnClicked);
    } else if (turnNumber <= 25) {
      turnNumber++;
      numberBriefcaseToOpen--;
      totalSelectedValues += parseInt(briefcasePrize);

      //strike prize value
      let briefcaseValueClasses = document.getElementsByClassName(
        "briefcase-value"
      );
      Array.from(briefcaseValueClasses)
        .filter(
          briefcaseValueClass =>
            briefcaseValueClass.getAttribute("data-value") == briefcasePrize
        )[0]
        .classList.add("strike", "animated", "flash");

      //hide briefcase
      let briefcaseClasses = document.getElementsByClassName("briefcase");
      Array.from(briefcaseClasses)
        .filter(
          briefcaseClass =>
            briefcaseClass.getAttribute("data-briefcase") == briefcaseNumber
        )[0]
        .classList.add("d-none");

      document.getElementById("messages").innerHTML = "";
      let newNode = document.createElement("h2");

      if (numberBriefcaseToOpen == 0) {
        if (turnNumber == 7) {
          bankerOffer(5);
        } else if (turnNumber == 12) {
          bankerOffer(4);
        } else if (turnNumber == 16) {
          bankerOffer(4);
        } else if (turnNumber == 20) {
          bankerOffer(2);
        } else if (turnNumber >= 22 && turnNumber <= 25) {
          bankerOffer(1);
        }
      } else if (numberBriefcaseToOpen == 1) {
        newNode.innerHTML = `Open ${numberBriefcaseToOpen} briefcase.`;
      } else {
        newNode.innerHTML = `Open ${numberBriefcaseToOpen} briefcases.`;
      }
      document.getElementById("messages").appendChild(newNode);
    }
  }
};

//add click events on buttons
let briefcaseClasses = document.getElementsByClassName("briefcase");
Array.from(briefcaseClasses).forEach(element => {
  element.addEventListener("click", chooseBriefcase);
});

const yesBtnClicked = function(briefcaseNumber, briefcasePrize) {
  lockBriefcase = false;
  //chosen briefcase
  document.getElementById(
    "your-briefcase"
  ).innerHTML = `<button class="btn-block btn animated jackInTheBox"><i class="fas fa-briefcase"></i><span>${briefcaseNumber}</span></button>`;

  chosenBriefcasePrize = briefcasePrize;

  //set to true, briefcase selected
  firstBriefcaseSelected = true;
  turnNumber++;

  //hide briefcase
  let briefcaseClasses = document.getElementsByClassName("briefcase");
  Array.from(briefcaseClasses)
    .filter(function(briefcaseClass) {
      return briefcaseClass.getAttribute("data-briefcase") == briefcaseNumber;
    })[0]
    .classList.add("d-none");

  document.getElementById("messages").innerHTML = "";
  let newNode = document.createElement("h2");
  newNode.innerHTML = `Open ${numberBriefcaseToOpen} briefcases.`;
  document.getElementById("messages").appendChild(newNode);
};

const noBtnClicked = function() {
  lockBriefcase = false;
  showFirstMessage();
};

const bankerOffer = function(briefcaseToOpen) {
  lockBriefcase = true;
  offerValue = (totalPrizeMoney - totalSelectedValues) / (27 - turnNumber);

  if (offerValue > 100000) {
    offerValue = (offerValue / 10000).toFixed() * 10000;
  } else if (offerValue > 10000) {
    offerValue = (offerValue / 1000).toFixed() * 1000;
  } else if (offerValue > 1000) {
    offerValue = (offerValue / 100).toFixed() * 100;
  } else if (offerValue > 100) {
    offerValue = (offerValue / 10).toFixed() * 10;
  } else if (offerValue > 1) {
    offerValue = offerValue.toFixed();
  }

  let newNode = document.createElement("h2");
  if (turnNumber == 25) {
    newNode.innerHTML = `The banker wants to buy your briefcase for ${offerValue.toLocaleString()}. This is the final offer of the banker. So what it's gonna be?`;
  } else {
    newNode.innerHTML = `The banker wants to buy your briefcase for ${offerValue.toLocaleString()}. If you decline the offer, We'll gonna open ${briefcaseToOpen} ${
      briefcaseToOpen > 1 ? "briefcases" : "briefcase"
    }. So what it's gonna be?`;
  }

  document.getElementById("messages").appendChild(newNode);

  //insert offer in bank offer div
  document.querySelectorAll("#bank-offer h4").forEach(el => {
    el.classList.add("prev-offer");
  });

  newNode = document.createElement("h4");
  newNode.className = "animated fadeIn";
  newNode.innerHTML = `${offerValue.toLocaleString()}`;
  document.getElementById("bank-offer").appendChild(newNode);

  newNode = document.createElement("div");
  newNode.innerHTML = `<button id="dealBtn" class="btn btn-warning">Deal</button> or <button id="noDealBtn" class="btn btn-danger">No Deal</button> ?`;
  document.getElementById("messages").appendChild(newNode);

  document
    .getElementById("dealBtn")
    .addEventListener("click", () => dealBtnClicked(offerValue));
  document
    .getElementById("noDealBtn")
    .addEventListener("click", () => noDealBtnClicked(briefcaseToOpen));
};

const dealBtnClicked = function(offerValue) {
  document.getElementById("messages").innerHTML = "";
  let newNode = document.createElement("h2");
  newNode.innerHTML = `The deal is finalized. You have just accepted the banker's offer of ${offerValue.toLocaleString()}. Your briefcase actually contained ${chosenBriefcasePrize.toLocaleString()}.`;
  document.getElementById("messages").appendChild(newNode);
};

const noDealBtnClicked = function(briefcaseToOpen) {
  if (turnNumber == 25) {
    lastOffer();
  } else {
    lockBriefcase = false;

    document.getElementById("messages").innerHTML = "";
    let newNode = document.createElement("h2");
    newNode.innerHTML = `Open ${briefcaseToOpen} ${
      briefcaseToOpen > 1 ? "briefcases" : "briefcase"
    }.`;
    document.getElementById("messages").appendChild(newNode);

    numberBriefcaseToOpen = briefcaseToOpen;
  }
};

const lastOffer = function() {
  document.getElementById("messages").innerHTML = "";
  let newNode = document.createElement("h2");
  newNode.innerHTML = `You declined the final offer of the banker. Let's see what's in your briefcase.`;
  document.getElementById("messages").appendChild(newNode);

  newNode = document.createElement("div");
  newNode.innerHTML = `<button id="openBtn" class="btn btn-warning">Open It!</button>`;
  document.getElementById("messages").appendChild(newNode);

  document.getElementById("openBtn").addEventListener("click", lastMessage);
};

const lastMessage = function() {
  document.getElementById("messages").innerHTML = "";
  if (chosenBriefcasePrize < offerValue) {
    let newNode = document.createElement("h2");
    newNode.innerHTML = `To bad... The banker's offer is much bigger than the amount in your briefcase. You have just received ${chosenBriefcasePrize.toLocaleString()}.`;
    document.getElementById("messages").appendChild(newNode);
  } else {
    let newNode = document.createElement("h2");
    newNode.innerHTML = `You've made a good decision! The amount in your briefcase is much bigger than the banker's offer. You have just received ${chosenBriefcasePrize.toLocaleString()}.`;
    document.getElementById("messages").appendChild(newNode);
  }
};

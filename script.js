/* ==================================
   PERYA DICE
================================== */


/* ==================================
   DICE IMAGES
================================== */

const diceImages = [

    "images/red.png",
    "images/blue.png",
    "images/green.png",
    "images/yellow.png",
    "images/purple.png",
    "images/orange.png"

];



/* ==================================
   SOUND
================================== */

const rollSound = new Audio(
    "sounds/dice-roll.mp3"
);

rollSound.volume = 0.6;



/* ==================================
   ELEMENTS
================================== */

const rollButton =
    document.getElementById("rollButton");


const diceCount =
    document.getElementById("diceCount");


const results =
    document.getElementById("results");


const history =
    document.getElementById("history");



/* ==================================
   HISTORY
================================== */

const rollHistory = [];



/* ==================================
   RANDOM DICE
================================== */

function randomDice(){

    return Math.floor(
        Math.random() * diceImages.length
    );

}



/* ==================================
   ROLL DICE
================================== */

function rollDice(amount){

    const dice = [];

    for(let i = 0; i < amount; i++){

        dice.push(
            randomDice()
        );

    }

    return dice;

}



/* ==================================
   SHOW DICE
================================== */

function showDice(values, shaking = false){

    results.innerHTML = "";


    values.forEach(value => {


        const img =
            document.createElement("img");


        img.src =
            diceImages[value];


        img.className =
            shaking
            ? "dice shake"
            : "dice";


        results.appendChild(img);


    });

}



/* ==================================
   UPDATE LAST 5 ROLLS
================================== */

function updateHistory(values){


    if(!history)
        return;



    rollHistory.unshift(
        [...values]
    );



    if(rollHistory.length > 5){

        rollHistory.pop();

    }



    history.innerHTML = "";



    rollHistory.forEach(roll => {


        const row =
            document.createElement("div");


        row.className =
            "historyRow";



        roll.forEach(value => {


            const img =
                document.createElement("img");



            img.src =
                diceImages[value];



            img.className =
                "historyDice";



            row.appendChild(img);


        });



        history.appendChild(row);


    });


}



/* ==================================
   START ROLL
================================== */

function startDiceRoll(){


    const amount =
        Number(
            diceCount.value
        );



    rollButton.disabled = true;


    rollButton.textContent =
        "Rolling...";



    rollSound.currentTime = 0;


    rollSound
        .play()
        .catch(()=>{});



    const animation =
        setInterval(()=>{


            showDice(

                rollDice(amount),

                true

            );


        },100);




    setTimeout(()=>{


        clearInterval(animation);



        const finalRoll =
            rollDice(amount);



        showDice(
            finalRoll
        );



        updateHistory(
            finalRoll
        );



        rollButton.disabled = false;



        rollButton.textContent =
            "🎲 Roll Dice";



    },1900);


}



/* ==================================
   BUTTON
================================== */

if(rollButton){

    rollButton.addEventListener(
        "click",
        startDiceRoll
    );

}



/* ==================================
   STARTUP
================================== */

window.addEventListener(
    "load",
    ()=>{

        startDiceRoll();

    }
);
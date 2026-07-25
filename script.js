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
    document.getElementById(
        "rollButton"
    );



const diceCount =
    document.getElementById(
        "diceCount"
    );



const results =
    document.getElementById(
        "results"
    );




/* ==================================
   RANDOM DICE
================================== */


function randomDice(){


    return Math.floor(

        Math.random() *
        diceImages.length

    );


}




/* ==================================
   ROLL DICE
================================== */


function rollDice(amount){


    let dice = [];



    for(
        let i = 0;
        i < amount;
        i++
    ){


        dice.push(
            randomDice()
        );


    }



    return dice;


}





/* ==================================
   SHOW DICE
================================== */


function showDice(
    values,
    shaking = false
){


    if(!results)
        return;



    results.innerHTML = "";



    values.forEach(value=>{


        const img =
            document.createElement(
                "img"
            );



        img.src =
            diceImages[value];



        img.className =
            shaking
            ? "dice shake"
            : "dice";



        results.appendChild(
            img
        );


    });


}




/* ==================================
   START ROLL
================================== */


function startDiceRoll(){


    if(
        !diceCount ||
        !rollButton
    )
        return;



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


        clearInterval(
            animation
        );



        showDice(

            rollDice(amount)

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


        // automatic first roll

        startDiceRoll();


    }

);
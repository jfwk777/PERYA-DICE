/* ==================================
   PERYA DICE
================================== */

import { db } from "./firebase.js";

import {
    collection,
    doc,
    setDoc,
    getDocs,
    getDoc,
    query,
    where,
    orderBy,
    limit,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";


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

const gameIdElement =
    document.getElementById("gameId");



/* ==================================
   FIRESTORE
================================== */

const rollsCollection =
    collection(db, "rolls");



/* ==================================
   GAME ID
================================== */

function generateGameId(length = 10){

    const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    const bytes =
        new Uint8Array(length);

    crypto.getRandomValues(bytes);


    return Array.from(
        bytes,
        b => chars[b % chars.length]
    ).join("");

}


const gameId =
    generateGameId();



if(gameIdElement){

    gameIdElement.textContent =
        gameId;

}



/* ==================================
   RANDOM DICE
================================== */

function randomDice(){

    return Math.floor(
        Math.random() * diceImages.length
    );

}



/* ==================================
   CREATE ROLL
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
   DISPLAY DICE
================================== */

function showDice(values, shaking=false){


    if(!results)
        return;


    results.innerHTML = "";


    values.forEach(value=>{


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
   START ROLL
================================== */

async function startDiceRoll(){


    const amount =
        Number(diceCount.value);



    rollButton.disabled = true;


    rollButton.textContent =
        "Rolling...";



    rollSound.currentTime = 0;


    rollSound.play()
    .catch(()=>{});



    const animation =
        setInterval(()=>{


            showDice(

                rollDice(amount),

                true

            );


        },100);



    setTimeout(async()=>{


        clearInterval(animation);



        const finalRoll =
            rollDice(amount);



        showDice(
            finalRoll
        );



        await saveRoll(
            finalRoll
        );



        await loadHistory();



        rollButton.disabled = false;


        rollButton.textContent =
            "🎲 Roll Dice";



    },1900);


}



/* ==================================
   SAVE ROLL
================================== */

async function saveRoll(values){


    await setDoc(

        doc(collection(db,"rolls")),

        {

            gameId: gameId,

            result: values,

            timestamp: serverTimestamp()

        }

    );


}



/* ==================================
   LAST 5 ROLLS
================================== */

async function loadHistory(){


    if(!history)
        return;



    history.innerHTML = "";



    const q = query(

        rollsCollection,

        orderBy(
            "timestamp",
            "desc"
        ),

        limit(5)

    );



    const snapshot =
        await getDocs(q);



    snapshot.forEach(docSnap=>{


        const data =
            docSnap.data();



        const row =
            document.createElement("div");


        row.className =
            "historyRow";



        const id =
            document.createElement("div");


        id.textContent =
            "ID: " + data.gameId;



        row.appendChild(id);



        data.result.forEach(value=>{


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
   VERIFY GAME
================================== */

async function verifyGame(searchId){


    const q = query(

        rollsCollection,

        where(
            "gameId",
            "==",
            searchId
        ),

        orderBy(
            "timestamp",
            "desc"
        )

    );



    const snapshot =
        await getDocs(q);



    if(snapshot.empty){

        return null;

    }



    return snapshot.docs.map(
        doc => doc.data()
    );


}



/* ==================================
   SHOW VERIFIED ROLL
================================== */

function showVerifiedRoll(data){


    if(!results)
        return;


    results.innerHTML = "";


    data.result.forEach(value=>{


        const img =
            document.createElement("img");


        img.src =
            diceImages[value];


        img.className =
            "dice";


        results.appendChild(img);


    });


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
    async ()=>{


        await loadHistory();


        startDiceRoll();


    }
);

/* ==================================
   COPY GAME ID
================================== */

const copyButton =
    document.getElementById("copyGameId");


if(copyButton){

    copyButton.addEventListener(
        "click",
        async ()=>{

            await navigator.clipboard.writeText(gameId);


            copyButton.textContent =
                "✅ Copied";


            setTimeout(()=>{

                copyButton.textContent =
                    "📋 Copy";

            },1500);

        }
    );

}
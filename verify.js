/* ==================================
   PERYA DICE - VERIFY PAGE
================================== */

import { db } from "./firebase.js";

import {
    collection,
    query,
    where,
    orderBy,
    getDocs
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
   HTML ELEMENTS
================================== */

const gameIdInput =
    document.getElementById("gameIdInput");


const verifyButton =
    document.getElementById("verifyButton");


const resultsTable =
    document.getElementById("results");



/* ==================================
   VERIFY GAME
================================== */

async function loadRolls(gameId){


    const q = query(

        collection(db, "rolls"),

        where(
            "gameId",
            "==",
            gameId
        ),

        orderBy(
            "timestamp",
            "desc"
        )

    );



    const snapshot =
        await getDocs(q);



    if(snapshot.empty){


        resultsTable.innerHTML = `

            <tr>

                <td>
                    No rolls found.
                </td>

            </tr>

        `;


        return;

    }



    resultsTable.innerHTML = "";



    let index = 1;



    snapshot.forEach(docSnap => {


        const roll =
            docSnap.data();



        const row =
            document.createElement("tr");



        let diceHTML = "";



        roll.result.forEach(value => {


            diceHTML += `

                <img
                    src="${diceImages[value]}"
                    class="historyDice"
                    alt="Dice">

            `;


        });



        let time = "Unknown";

        if(roll.timestamp){

            time =
                roll.timestamp
                .toDate()
                .toLocaleString();

        }



        row.innerHTML = `

            <td>
                ${index}
            </td>

            <td>
                ${diceHTML}
            </td>

            <td>
                ${time}
            </td>

        `;



        resultsTable.appendChild(row);


        index++;


    });


}



/* ==================================
   VERIFY BUTTON
================================== */


verifyButton.addEventListener(
    "click",
    ()=>{


        const gameId =
            gameIdInput.value.trim();



        if(!gameId){


            resultsTable.innerHTML = `

                <tr>

                    <td>
                        Please enter a Game ID.
                    </td>

                </tr>

            `;


            return;

        }



        loadRolls(gameId);


    }
);

console.log("VERIFY JS LOADED");
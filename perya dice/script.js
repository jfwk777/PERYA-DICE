/* ==================================
   PERYA DICE + WHEEL
   CLEAN REWRITE
================================== */


/* ==================================
   DICE SYSTEM
================================== */


const diceImages = [
    "images/red.png",
    "images/blue.png",
    "images/green.png",
    "images/yellow.png",
    "images/purple.png",
    "images/orange.png"
];


const rollSound =
    new Audio("sounds/dice-roll.mp3");

    const wheelSpinSound =
    new Audio("sounds/wheel-spin.mp3");

wheelSpinSound.volume = 0.7;


rollSound.volume = 0.6;



const rollButton =
    document.getElementById("rollButton");


const diceCount =
    document.getElementById("diceCount");


const results =
    document.getElementById("results");



function randomDice(){

    return Math.floor(
        Math.random() * diceImages.length
    );

}



function rollDice(amount){

    let values = [];

    for(
        let i = 0;
        i < amount;
        i++
    ){

        values.push(
            randomDice()
        );

    }

    return values;

}



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




function startDiceRoll(){

    if(!diceCount || !rollButton)
        return;


    const amount =
        Number(diceCount.value);



    if(amount < 1)
        return;



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


        showDice(
            rollDice(amount)
        );



        rollButton.disabled = false;


        rollButton.textContent =
            "🎲 Roll Dice";



    },1900);


}




if(rollButton){

    rollButton.addEventListener(
        "click",
        startDiceRoll
    );

}




/* ==================================
   WHEEL SYSTEM
================================== */


const canvas =
    document.getElementById("wheel");


const ctx =
    canvas
    ? canvas.getContext("2d")
    : null;



const spinButton =
    document.getElementById("spinWheel");


const addNameButton =
    document.getElementById("addName");


const nameInput =
    document.getElementById("nameInput");


const nameColor =
    document.getElementById("nameColor");


const textColor =
    document.getElementById("textColor");


const nameList =
    document.getElementById("nameList");



/* ==================================
   DEFAULT STARTUP NAMES
================================== */


let names = [

    {
        text:"Light",
        color:"#eeeeee",
        textColor:"#000000",
        percent:50
    },


    {
        text:"Dark",
        color:"#222222",
        textColor:"#ffffff",
        percent:50
    }

];



let currentRotation = 0;


let spinning = false;

/* ==================================
   PERCENTAGE SYSTEM
================================== */


function getTotalPercent(){

    return names.reduce(
        (total,item)=>{

            return total + item.percent;

        },
        0
    );

}




function normalizePercent(){

    const total =
        getTotalPercent();



    if(total <= 0){

        const equal =
            100 / names.length;


        names.forEach(item=>{

            item.percent = equal;

        });


        return;

    }



    names.forEach(item=>{


        item.percent =
            (
                item.percent /
                total
            ) * 100;


    });

}





function getSliceAngle(percent){

    return (
        percent / 100
    ) * Math.PI * 2;

}





function getSliceDegrees(percent){

    return (
        percent / 100
    ) * 360;

}



/* ==================================
   DRAW WHEEL
================================== */


function drawWheel(){

    if(!ctx)
        return;



    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );



    const center =
        canvas.width / 2;



    const radius =
        center - 10;



    let startAngle = 0;



    names.forEach(item=>{


        const slice =
            getSliceAngle(
                item.percent
            );



        const endAngle =
            startAngle + slice;



        // Draw slice

        ctx.beginPath();


        ctx.moveTo(
            center,
            center
        );


        ctx.arc(
            center,
            center,
            radius,
            startAngle,
            endAngle
        );


        ctx.closePath();



        ctx.fillStyle =
            item.color;


        ctx.fill();



        ctx.strokeStyle =
            "white";


        ctx.lineWidth =
            3;


        ctx.stroke();




        // Draw text

        ctx.save();



        ctx.translate(
            center,
            center
        );



        ctx.rotate(
            startAngle +
            slice / 2
        );



        ctx.fillStyle =
            item.textColor;



        ctx.font =
            "bold 28px Arial";



        ctx.textAlign =
            "right";


        ctx.textBaseline =
            "middle";



        ctx.fillText(
            item.text,
            radius - 20,
            0
        );



        ctx.restore();



        startAngle =
            endAngle;


    });


}

/* ==================================
   NAME LIST
================================== */


function updateNameList(){

    if(!nameList)
        return;


    nameList.innerHTML = "";



    names.forEach((item,index)=>{


        const li =
            document.createElement("li");



        li.innerHTML = `

            <span style="
                width:18px;
                height:18px;
                background:${item.color};
                display:inline-block;
                border-radius:3px;
            "></span>


            <span style="
                color:${item.textColor};
                margin-left:8px;
            ">
                ${item.text}
            </span>


            <input
                class="percentInput"
                type="number"
                value="${Math.round(item.percent)}"
                min="1"
                max="100"
            >


            <span>%</span>


            <button class="deleteBtn">
                ❌
            </button>

        `;



        /*
            Change percentage
        */

        const percentInput =
            li.querySelector(".percentInput");



        percentInput.addEventListener(
            "change",
            ()=>{


                const value =
                    Number(
                        percentInput.value
                    );



                if(
                    isNaN(value) ||
                    value <= 0
                ){

                    percentInput.value =
                        Math.round(
                            item.percent
                        );

                    return;

                }



                item.percent =
                    value;



                normalizePercent();


                updateNameList();


                drawWheel();


            }
        );




        /*
            Delete name
        */

        li.querySelector(".deleteBtn")
        .onclick = ()=>{


            if(names.length <= 1){

                alert(
                    "You need at least one slice."
                );

                return;

            }



            names.splice(
                index,
                1
            );



            normalizePercent();


            updateNameList();


            drawWheel();


        };



        nameList.appendChild(li);


    });


}




/* ==================================
   ADD NAME
================================== */


function addName(){


    if(!nameInput)
        return;



    const value =
        nameInput.value.trim();



    if(value === "")
        return;



    names.push({

        text:value,

        color:nameColor.value,

        textColor:textColor.value,

        percent:10

    });



    normalizePercent();


    nameInput.value = "";



    updateNameList();


    drawWheel();


}





if(addNameButton){

    addNameButton.addEventListener(
        "click",
        addName
    );

}




if(nameInput){

    nameInput.addEventListener(
        "keydown",
        event=>{


            if(event.key === "Enter"){

                addName();

            }


        }
    );

}

/* ==================================
   SPIN WHEEL
================================== */


if(spinButton){

    spinButton.addEventListener(
        "click",
        ()=>{


            if(spinning)
                return;



            if(names.length < 1){

                alert(
                    "Add at least one name."
                );

                return;

            }



            const oldPopup =
                document.querySelector(
                    ".winnerPopup"
                );



            if(oldPopup){

                oldPopup.remove();

            }



           spinning = true;

           canvas.classList.add("spinning");

wheelSpinSound.currentTime = 0;

wheelSpinSound
    .play()
    .catch(()=>{});


            const turns =
                6 + Math.random() * 4;



            currentRotation +=
                turns * 360;



            canvas.style.transform =
                `rotate(${currentRotation}deg)`;



            setTimeout(()=>{


                spinning = false;


                showWinner();



            },6000);



        }
    );

}





/* ==================================
   FIND WINNER
================================== */


function showWinner(){


    const rotation =
        currentRotation % 360;



    /*
        Position of pointer
    */

    const pointer =
        (
            360 -
            rotation +
            270
        ) % 360;



    let currentDegree = 0;


    let winner = null;



    names.forEach(item=>{


        const slice =
            getSliceDegrees(
                item.percent
            );



        if(
            pointer >= currentDegree &&
            pointer < currentDegree + slice
        ){

            winner = item;

        }



        currentDegree += slice;


    });



    if(winner){

        showWinnerPopup(
            winner.text
        );

    }


}

/* ==================================
   WINNER POPUP
================================== */


function showWinnerPopup(name){


    const popup =
        document.createElement("div");



    popup.className =
        "winnerPopup";



    popup.innerHTML = `

        <h2>
            🎉 Winner!
        </h2>


        <h1>
            ${name}
        </h1>


        <button>
            OK
        </button>

    `;



    popup.querySelector("button")
    .onclick = ()=>{

        popup.remove();

    };



    const container =
        document.getElementById(
            "wheelContainer"
        );



    if(container){

        container.appendChild(
            popup
        );

    }


}





/* ==================================
   STARTUP
================================== */


window.addEventListener(
    "load",
    ()=>{


        /*
            Default startup names
        */

        names = [

            {
                text:"Light",
                color:"#eeeeee",
                textColor:"#000000",
                percent:50
            },


            {
                text:"Dark",
                color:"#222222",
                textColor:"#ffffff",
                percent:50
            }

        ];



        normalizePercent();


        updateNameList();


        drawWheel();



        if(rollButton){

            startDiceRoll();

        }


    }
);
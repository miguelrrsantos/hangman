/* 
    The (Best) HangMan Game
    by Miguel Real / 2017
*/

// variables declaration
var wordToGuess;       
var attempts;
var numberWrongLetters;
var numberGuessedLetters;
var wordLength;
var lifes;

/* 
    Description:
    This function writes a message in the div with alert id.

    Arguments:
    messageCode is a number representing a code to display a message and format the alert div class.

    Return Values:
    None.
*/
function alertMessage (messageCode)
{
    var div = document.getElementById('alert');
    switch(messageCode) {
        case 0: // initial message
            {
                div.innerHTML="Click on a letter to guess the word that your opponent entered.";
                div.className="alert";
                break; 
            }
        case 1: // letter already clicked
            {
                div.innerHTML="You already clicked on that letter!";
                div.className="alert alert-warning";
                break; 
            }
        case 2: // letter guessed
            {
                div.innerHTML="Well done, a new letter was guessed!";
                div.className="alert alert-success";
                break; 
            }
        case 3: // letter do not belong to word
            {
                div.innerHTML="Bad luck, that letter do not belong to the word!";
                div.className="alert alert-danger";
                break; 
            }
        case 4: // game over
            {
                div.innerHTML="You have been hanged. Game over!";
                div.className="alert alert-danger";
                break; 
            }
        case 5: // word guessed
            {
                div.innerHTML="Congratulations. You have escaped!";
                div.className="alert alert-success";
                break; 
            }                           
        default:
            {
                div.innerHTML="";
                div.className="alert";
                break; 
            }    
    }
}


/* 
    Description:
    This function validates the string entered in the prompt.

    Arguments:
    wordToValidate is a string that will be tested againts a regular expression that checks if it has only letters. 

    Return Values:
    A boolean: true if wordToValidate has only letters, false otherwise.
*/
function validate (wordToValidate)
{
    // RegExp could be changed to A-Z since the word is changed to Uppercase when prompted
    // it lacks the verification for locale characters like ç, à, á, ã, etc... 
    // preciso de adicionar À-ú à regexp mas implica adicionar botões com todos os acentos e cedilhas
    var regularExpression = new RegExp("^[A-Z]+$"); 
    if (regularExpression.test(wordToValidate))
    {
        return true;
    }
    else
    {
        alert('Invalid word: '+wordToValidate); /* in the future it could open a modal */
        return false;
    }
}


/* 
    Description:
    This function receives a letter and checks if that letter is contained in the word to guess.

    Arguments:
    letter is a char.

    Return Values:
    An array with the positions where the letter is present in the word to guess.
*/
function letterInWord (letter) 
{
    var letterPositions = [];
    for(var pos=0; pos<wordToGuess.length; pos++) {
        if (wordToGuess[pos] === letter) 
            letterPositions.push(pos);
    }
    return letterPositions;
}


/* 
    Description:
    This function receives the clicked button.

    Arguments:
    clickedButton is a button from the letters group.

    Return Values:
*/
function submitLetter (letterEvent)
{
    // currentTarget is the parent div 
    // if the event occurrs in the children then a letter button was clicked
    if (letterEvent.target !== letterEvent.currentTarget)
    {
        var clickedButton = letterEvent.target;

        // check if the letter has already been submitted (button already clicked)
        if (clickedButton.value == "not_clicked") 
        {
            // verifiy if letter (that is the value of button id) is in word
            var letterPositions = letterInWord (clickedButton.id);

            // if letterPositions length > 0 then the letter was found on word
            if (letterPositions.length > 0)
            {
                // updates alert div message
                alertMessage(2);

                // updates letter button class and value
                clickedButton.className="btn btn-success";
                clickedButton.value="guessed";

                // updates statistics variables
                numberGuessedLetters+=letterPositions.length;

                // insert the letter guessed in the word buttons
                for(var pos=0; pos < letterPositions.length; pos++)
                {
                    document.getElementById(letterPositions[pos]).innerHTML=clickedButton.id;
                }

                // updates statistics table
                document.getElementById('lettersguessednumber').innerHTML=numberGuessedLetters;
                document.getElementById('letterremainingnumber').innerHTML=wordLength-numberGuessedLetters;
            }
            else // letter was not found on word
            {
                // updates alert div message
                alertMessage(3);

                // updates letter button class and value
                clickedButton.className="btn btn-danger";
                clickedButton.value="not_guessed";

                // updates statistics variables
                numberWrongLetters++;
                lifes--;

                // updates statistics table
                document.getElementById('failednumber').innerHTML=numberWrongLetters;
                document.getElementById('lifesnumber').innerHTML=lifes;

                // draw one more piece of the hangman
            }

            // updates statistics variables and table
            attempts++;
            document.getElementById('attemptsnumber').innerHTML=attempts;

            //checks if its the end of game (lifes = 0 or all the letters guessed)
            if (lifes == 0 || numberGuessedLetters == wordLength)
            {
                if (lifes == 0)
                {
                    alertMessage(4); // game over
                } 
                else
                {
                    alertMessage(5); // word guessed
                }

                // remove listeners for letter buttons
                removeLetterButtonsListener();
            }
           

            // TO DO:
            /* create and update progress bar */
            
        } 
        else 
        {
            alertMessage(1);
        }
    }
    letterEvent.stopPropagation();
}


/*
    Description:
    Initializes the game variables.

    Arguments:
    None. 

    Return Values:
    None.    
*/
function initializeGameVariables ()
{
    // initializes variables
    wordLength = wordToGuess.length;
    numberWrongLetters = 0;
    numberGuessedLetters = 0;
    attempts = 0;
    lifes=9;
}


/*
    Description:
    Initializes the statistics table values.

    Arguments:
    None. 

    Return Values:
    None.    
*/
function initializeStatisticsTable ()
{
    document.getElementById('attemptsnumber').innerHTML=attempts;
    document.getElementById('failednumber').innerHTML=numberWrongLetters;
    document.getElementById('lifesnumber').innerHTML=lifes;
    document.getElementById('wordlettersnumber').innerHTML=wordLength;
    document.getElementById('lettersguessednumber').innerHTML=numberGuessedLetters;
    document.getElementById('letterremainingnumber').innerHTML=wordLength-numberGuessedLetters;    
}


/*
    Description:
    Add an event listener to the parent div of letter buttons.

    Arguments:
    None. 

    Return Values:
    None.    
*/
function addLetterButtonsListener ()
{
    // add listener to letter buttons div 
    var letterButtonsDiv = document.getElementById('letterButtons');
    letterButtonsDiv.addEventListener("click", submitLetter, false);
}


/*
    Description:
    Remove an event listener to the parent div of letter buttons.

    Arguments:
    None. 

    Return Values:
    None.    
*/
function removeLetterButtonsListener ()
{
    // add listener to letter buttons div 
    var letterButtonsDiv = document.getElementById('letterButtons');
    letterButtonsDiv.removeEventListener("click", submitLetter, false);
}


/*
    Description:
    Initialize the letter buttons class and value.

    Arguments:
    None. 

    Return Values:
    None.    
*/
function initializeLetterButtons ()
{
    var letterButtons = document.getElementById('letterButtons').children;
    for (var pos=0; pos < letterButtons.length; pos++)
    {
        letterButtons[pos].className="btn btn-default";
        letterButtons[pos].value="not_clicked";
    }
}


/*
    Description:
    Draws the buttons for the word to guess.

    Arguments:
    None. 

    Return Values:
    None.    
*/
function drawWordButtons ()
{
    // draw buttons for word to guess
    var wordDiv = document.getElementById('word');
    wordDiv.innerHTML = "";
    for (var pos=0; pos < wordLength; pos++)
    {
        wordDiv.innerHTML+='<button type="button" class="btn btn-default" id="'+pos+'">&nbsp;</button>';
    }    
}


/*
    Description:
    Starts a new game.

    Arguments:
    None. 

    Return Values:
    None.    
*/
function newGame () 
{

    // prompt the user for the word to guess and forces validation
    do {
        wordToGuess = prompt("Introduza uma palavra: ");
        if (wordToGuess != null)
            wordToGuess = wordToGuess.toUpperCase();
    }
    while (!validate(wordToGuess) || wordToGuess == null);

    // initialize game variables
    initializeGameVariables();

    // display the initial instruction in alert div
    alertMessage(0);

    // draw buttons for word to guess
    drawWordButtons();

    // add event listener to letter buttons
    addLetterButtonsListener();

    // initializes statistics table counters
    initializeStatisticsTable();

    // initialize letter buttons class and values
    initializeLetterButtons();

}

//adds click event on new game button
document.getElementById("newGame").addEventListener("click",newGame,false);
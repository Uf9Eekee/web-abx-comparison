//Implements an ABX listening test environment.

var audioA = document.getElementById("audioA");
var audioB = document.getElementById("audioB");
var audioX = document.getElementById("audioX");
var playPauseToggleButton = document.getElementById("playPauseToggleButton");
var progressBar = document.getElementById("progressBar");
var progressMarker = document.getElementById("progressMarker");
var loopTargetToggleButton = document.getElementById("loopTargetToggleButton");
var audioTrackA = "audio/a.flac";
var audioTrackB = "audio/128.flac";
audioA.addEventListener("timeupdate", updateProgressBar);
progressBar.addEventListener("click", function(event){seek(event)});

var correctSelections = 0;
var totalIterations = 20;
var completeIterations = 0;
var currentLoopTarget = -1;
var xIsCurrently = "";
initializePage();

function initializePage(){
    document.getElementById("abx").style.display = "none";
}
//Initiates the test by hiding the elements of the intro page and setting up the audio.
function startABX(incomingBitrate){
    var currentTestInfo = "Current MP3 bitrate: " + incomingBitrate + " kbps.";
    document.getElementById("currentTestInfo").innerHTML = currentTestInfo;
    document.getElementById("introduction").style.display = "none";
    document.getElementById("startButton128").style.display = "none";
    document.getElementById("startButton160").style.display = "none";
    document.getElementById("startButton192").style.display = "none";
    document.getElementById("abx").style.display = "block";
    bitrate = incomingBitrate;
    if(bitrate === "128")
{        audioTrackB = "audio/128.flac";
    }
    if(bitrate === "160"){
        audioTrackB = "audio/160.flac";
    }
    if(bitrate === "192"){
        audioTrackB = "audio/192.flac";
    }

    audioA.setAttribute("src", audioTrackA);
    audioB.setAttribute("src", audioTrackB);
    muteAll();
    startNewIteration();
}
//Toggles between play and pause as well as changes the text of the button accordingly.
function playPauseToggle(){
    if (audioA.paused){
        playPauseToggleButton.setAttribute("value", "Pause");
        play();
    }
    else if(!audioA.paused){
        playPauseToggleButton.setAttribute("value", "Play");
        pause();


    }
}
function playPauseReset(){
    playPauseToggleButton.setAttribute("value", "Play");
    playPause = "play";
}
//Plays the track, from currentLoopTarget if set.
function play(){
    if(currentLoopTarget >=0){
        skipTo(currentLoopTarget);
    }
    audioA.play();
    audioB.play();
    audioX.play();
}

function pause(){
    audioA.pause();
    audioB.pause();
    audioX.pause();
}
function stop(){
    pause();
    audioA.currentTime = 0;
    audioB.currentTime = 0;
    audioX.currentTime = 0;
}
function skipTo(time){
    audioA.currentTime = time;
    audioB.currentTime = time;
    audioX.currentTime = time;
}

function selectA(){
    muteAll();
    setStartPosition();
    audioA.muted = false;
    
}
function selectB(){
    muteAll();
    setStartPosition();
    audioB.muted = false;
    
}
function selectX(){
    muteAll();
    setStartPosition()
    audioX.muted = false;

}
function muteAll(){
    audioA.muted = true;
    audioB.muted = true;
    audioX.muted = true;
}

function setStartPosition(){
    if(currentLoopTarget >= 0){
        skipTo(currentLoopTarget);
    }
}
//Starts a new test iteration by randomizing the X channel and preserves the position.
function startNewIteration(){
    var channelX = randomizeX();
    xIsCurrently = channelX;
    setupChannelX(channelX);
    setStartPosition();
}
//Randomizes channel X to either the A stream or the B stream.
function randomizeX(){
    var rnd = Math.floor(Math.random() * 2);
    var channelX = "";
    if(
        rnd === 0){channelX = "A";
    }
    if(
        rnd === 1){channelX = "B";
    }
    return channelX;
}

function setupChannelX(xIsCurrently){
    if(xIsCurrently === "A"){
        audioX.setAttribute("src", audioTrackA);
    }
    if(xIsCurrently === "B"){
        audioX.setAttribute("src", audioTrackB);
    }
}
//Saves the submitted answer by incrementing correctSelections if correct, increments completeIterations, and starts new iteration or finishes the test.
function submitAnswer(answer){
    stop();
    playPauseReset();
    if(answer === xIsCurrently){
        correctSelections++;
    }
    completeIterations++;
    updateProgress();
    if(completeIterations < totalIterations){
        startNewIteration();
    }
    else{
        showFinalResult();
        stopTest();
    }
}
function updateProgress(){
    var progress = "Progress: " + completeIterations + "/" + totalIterations + " test iterations completed.";
    document.getElementById("progressLabel").innerHTML = progress;
}
function showFinalResult(){
    var result = "You had " + correctSelections + " correct answers out of " + totalIterations + ".";
    alert(result);
}
function stopTest(){
    correctSelections = 0;
    completeIterations = 0;
    currentLoopTarget = -1;
    updateProgress();

    document.getElementById("introduction").style.display = "block";
    document.getElementById("startButton128").style.display = "block";
    document.getElementById("startButton160").style.display = "block";
    document.getElementById("startButton192").style.display = "block";
    document.getElementById("abx").style.display = "none";
}

//Updates the position of the progress bar by addEventListener on line 11.
function updateProgressBar(){
    var currentTime = audioA.currentTime;
    var totalTime = audioA.duration;
    var progressBarTarget = (currentTime / totalTime * 100) + "%";
    progressMarker.style.setProperty("left", progressBarTarget);
}

//On clicking the progress bar, determines the position of the cursor and translates this to a track position.
function seek(event){
    var target = event.offsetX / progressBar.offsetWidth;
    skipTo(target * audioA.duration);
}
//Toggles whether a loop target is active (signified by currentLoopTarget >= 0) or not (signified by -1), as well as the name of the button.
function loopTargetToggle(){
    if(currentLoopTarget === -1){
        loopTargetToggleButton.setAttribute("value", "Remove start marker");
        currentLoopTarget = audioA.currentTime;
    }
    else{
        loopTargetToggleButton.setAttribute("value", "Set start marker");
        currentLoopTarget = -1;
    }

}

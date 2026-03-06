const mic = document.getElementById("mic");
const display = document.getElementById("display");

const historyBox = document.getElementById("history");
const waves = document.getElementById("waves");

// speech recognition setup
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.lang = "en-US";
recognition.continuous = false;
recognition.interimResults = false;

// start listening when mic is clicked
mic.onclick = function(){

display.innerHTML = "Listening...";
mic.classList.add("listening");

recognition.start();

};

// when speech is detected
recognition.onresult = function (event) {

    const speech = event.results[0][0].transcript;

    display.innerHTML = "You said: " + speech;

    const result = calculate(speech);

    display.innerHTML += "<br>Result: " + result;

    // add to history
    const item = document.createElement("div");
    item.innerText = speech + " = " + result;
    historyBox.prepend(item);

    speak(result);
};

recognition.onend = function(){

mic.classList.remove("listening");

};

// calculate expression
function calculate(text){

    text = text.toLowerCase();

    // remove common words
    text = text.replace("what is","")
    text = text.replace("tell me","")
    text = text.replace("calculate","")

    // handle percent symbol
    if(text.includes("%")){
        let parts = text.split("%")

        let a = parseFloat(parts[0])
        let b = parseFloat(parts[1])

        return (a/100) * b
    }

    // percent phrase
    if(text.includes("percent of")){
        let parts = text.split("percent of")

        let a = parseFloat(parts[0])
        let b = parseFloat(parts[1])

        return (a/100) * b
    }

    // square root
    if(text.includes("square root of")){
        let num = parseFloat(text.replace("square root of",""))
        return Math.sqrt(num)
    }

    // power
    if(text.includes("power")){
        let parts = text.split("power")

        let base = parseFloat(parts[0])
        let exp = parseFloat(parts[1])

        return Math.pow(base,exp)
    }

    // math symbols
    text = text.replace(/plus/g,"+")
    text = text.replace(/minus/g,"-")
    text = text.replace(/times/g,"*")
    text = text.replace(/multiplied by/g,"*")
    text = text.replace(/into/g,"*")
    text = text.replace(/x/g,"*")
    text = text.replace(/divided by/g,"/")

    text = text.replace(/\s+/g,"")

    try{
        return eval(text)
    }catch{
        return "Cannot calculate"
    }
}

// voice response
function speak(message){

    const speech = new SpeechSynthesisUtterance("The answer is " + message);

    const voices = window.speechSynthesis.getVoices();

    // try to select a female voice
    for(let i = 0; i < voices.length; i++){
        if(
            voices[i].name.toLowerCase().includes("female") ||
            voices[i].name.toLowerCase().includes("zira") ||
            voices[i].name.toLowerCase().includes("samantha") ||
            voices[i].name.toLowerCase().includes("google uk english female")
        ){
            speech.voice = voices[i];
            break;
        }
    }

    speech.rate = 1;
    speech.pitch = 1.2;

    window.speechSynthesis.speak(speech);
}

// debug helpers
recognition.onstart = () => {
    console.log("Voice recognition started");
};

recognition.onerror = (event) => {
    console.log("Error:", event.error);
};

window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices();
};
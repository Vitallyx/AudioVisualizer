// Manipulation de l'audio.
let audio = new Audio("Sped.mp3");
const container = document.getElementById("container");

// Manipulation du canvas.
const canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Gestion du volume
function volume() {
    audio.volume = document.getElementById("vol_control").value / 100; // Volume par défaut

    window.setVolume = function(val) {
        audio.volume = val / 100;
    }
}
volume()

// Gestion de la lecture de l'audio.
container.onclick = () => {
    if (audio.paused) {
        audio.play();
        test()
    } else {
        audio.pause();
    }

}

function test() {

    var context = new AudioContext();

    var src = context.createMediaElementSource(audio);

    // Crée un nœud capable de fournir des informations d'analyse de fréquence (FFT) et de domaine temporel en temps réel.
    var analyser = context.createAnalyser();

    // Connexion entre l'audio et l'analyseur.
    src.connect(analyser);

    // Connexion entre l'analyseur et la sortie finale de l'audio (Haut parleur).
    analyser.connect(context.destination);

    /*
    Context --> Source Audio --> (Analyse) --> Destination Finale.

    L'analyse ne provoque aucun changement sur le son.
    */

    /* (Taille mémoire Tampon)
    fftSize est un nombre  en puissance de 2, qui représente la taille de la fréquence que l'on souhaite récolté sur un intervalle compris entre 32 et 32 768. (Par défaut 2048).
    */
    analyser.fftSize = 2048 * 2;

    /* (Longueur Tampon)
    Toujours égale a la moitié de la fftSize.
    */
    var bufferLength = analyser.frequencyBinCount;

    var dataArray = new Uint8Array(bufferLength);

    var WIDTH = canvas.width;
    var HEIGHT = canvas.height;

    // Taille et hauteur des barres.
    var barWidth = (WIDTH / bufferLength);
    var barHeight;

    // x sert a se reperer sur l'axe des abscisses.
    var x = 0;

    function renderFrame() {
        requestAnimationFrame(renderFrame);

        x = 0;

        analyser.getByteFrequencyData(dataArray);

        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        // Pour chaque fréquence. 
        for (var i = 0; i < bufferLength; i++) {

            // Attribue une hauteur #10 px de base + la valeur 
            barHeight = dataArray[i] + 10;

            var r = barHeight + (25 * (i / bufferLength));
            var g = 250 * (i / bufferLength);
            var b = 50;

            ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";

            // Dessine un réctangle selon les données (x, y, largeur, hauteur).
            ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

            // Espacemment entre les barres
            x += barWidth + 5;

        }
    }
    renderFrame();
}
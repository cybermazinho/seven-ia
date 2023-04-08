const modal = document.getElementById("modal");
const button = document.getElementById("button");
let aprendizado = false;
let perguntaTemp = "";
let palavras = JSON.parse(localStorage.getItem("palavras"));

if (palavras === null) {
  palavras = [];
}

function pensando(pergunta) {
  let lembranca = "";
  palavras.forEach((palavra) => {
    if (palavra.pergunta === pergunta) {
      lembranca = palavra.resposta;
    }
  });
  if (aprendizado === false) {
    if (lembranca !== "") {
      respondendo(lembranca);
    } else {
      respondendo("Não sei responder a isso!");
      perguntaTemp = pergunta;
    }
  } else {
    respondendo("Modo aprendizado confirmado, prossiga!");
  }
}

function aprendendo(pergunta, resposta) {
  palavras.push({ pergunta: pergunta, resposta: resposta });
  respondendo("Informação aprendida!");
  localStorage.setItem("palavras", JSON.stringify(palavras));
  aprendizado = false;
  perguntaTemp = "";
  setTimeout(() => {
    recognition.start();
  }, 3500);
}

function respondendo(fala) {
  const speak = new SpeechSynthesisUtterance(fala);
  window.speechSynthesis.speak(speak);
  setTimeout(() => {
    recognition.start();
  }, 3500);
}

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.onresult = (event) => {
  const voz = event.results[0][0].transcript;
  let aprendido = false;

  if (aprendizado === true) {
    aprendendo(perguntaTemp, voz);
    aprendido = true;
  }

  if (voz === "modo aprendizado") {
    aprendizado = true;
  }

  if (aprendido === false) {
    pensando(voz);
  }
};

button.addEventListener("click", () => {
  document.body.removeChild(modal);
  setTimeout(() => {
    recognition.start();
  }, 3500);
});

# TicTacToe-Web
Jogo da Velha com o algoritmo de inteligência artifical para jogos 1x1 [MiniMax](https://pt.wikipedia.org/wiki/Minimax), feito na Web a partir da manipulação da DOM com JavaScript. Jogo feito para um confronto do usuário e a máquina, entretanto, a partir do algoritmo, é impossível o usuário ganhar uma partida.

![Exemplo de um jogo](https://i.ibb.co/NFF9x1y/tictactoe.gif)

## Funcionalidades

A primeira página do jogo serve para o player selecionar com qual letra irá jogar. O título da página modifica-se dinamicamente conforme o necessário, e as opções são acrescentadas pelo *JavaScript*. Quando clicadas, acionam o evento, e dependendo da letra selecionada, determina quem irá começar, levando em consideração que o *X* sempre começa. A tela HTML da parte da tabela é limpa e as nove casas do jogo é adicionadas.

```javascript
// Carregando a tela do jogo
function loadGame(e) {
  // Pegando qual jogador irá jogar
  user = e.srcElement.textContent

  // Limpando o conteúdo
  table.innerHTML = ""

  for(var i = 0; i < 3; i++) {
    var div = document.createElement('div')
    div.className = 'line'
    for(var j = 0; j < 3; j++) {
      div.appendChild(buttons[i*3+j])
    }
    table.appendChild(div)
  }

  if(user === X) title.innerHTML = "Jogue X"
  else tictactoe(0)
}
```

A função **tictactoe** é a principal, sendo ela acionada toda vez que uma jogada é realizada, seja pela máquina ou pelo usuário. Quando o usuário realiza a jogada, é acrescentado um elemento visual para identificação e chamado a função novamente para a máquina realizar a contra-ação.

Quando o jogo acaba, é informado quem ganhou, e acionado um timer de 2s, para poder reiniciar o arquivo e começar um outro jogo novamente. 

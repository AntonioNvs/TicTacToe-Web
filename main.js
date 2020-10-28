// Elemento de título para ser mudado dinamicamente
var title = document.getElementById('title')

// Elemento div da tabela
var table = document.getElementById('table')

// Definição de qual usuário irá jogar
var user = "X"

// Players
const X = "X"
const O = "O"

// Se a IA tem que jogar
var ia_turn = false

// Estado inicial da tabela
var board = initial_state()

// Variáveis de controle
var buttons = []
var adc = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

// Adicionando os botões no vetor
for(var i = 1; i <= 9; i++) {
  var btn = document.createElement('div')

  btn.className = "square"
  btn.id = i
  btn.onclick = onClickButton

  buttons.push(btn)
}

// Inicializando a tela
loadWhatPlayer()

// Função que carrega os elementos de seleção de jogador
function loadWhatPlayer() {
  title.innerHTML = "Selecione um Jogador"

  // Criação de duas divs e seus respectivos conteúdos
  var firstDiv = document.createElement('div')
  var secondDiv = document.createElement('div')
  var firstH1 = document.createElement('h1')
  var secondH1 = document.createElement('h1')

  firstDiv.onclick = loadGame
  firstDiv.id = "X"

  secondDiv.onclick = loadGame
  secondDiv.id = "O"

  firstH1.textContent = "X"
  secondH1.textContent = "O"

  firstDiv.appendChild(firstH1)
  secondDiv.appendChild(secondH1)

  table.appendChild(firstDiv)
  table.appendChild(secondDiv)
}

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
  else {
    ai_turn = true
    tictactoe(0)
  }
}

// Função a ser ativada quando o botao for clicado
function onClickButton(e) {
  // Identificando o id do elemento
  var i = Number(e.srcElement.id) - 1

  // Caso o botão não foi clicado ainda, faça a ação dele
  if(adc[i] == 0) {

    // Criando o elemento de visualização da casa
    var h1 = document.createElement('h1')
    h1.innerHTML = player(board)

    // Adicionando o elemento ao botão
    buttons[i].appendChild(h1)
    adc[i] = 1

    // Ativando a lógica do jogo
    tictactoe(i)
  }
  
}

async function tictactoe(indice) {
  // Vendo se o jogo acabou
  var game_over = terminal(board)

  // Definindo de quem é a jogada agora
  var jogador = player(board)

  // Caso o jogo tenha terminado
  if(game_over) {
    // Vendo quem ganhou
    var win = winner(board)

    // Se ningúem ganhou, o jogo deu velha
    if(win == undefined) title.innerHTML = "Jogo acabou: Velha"

    // Se não, mostrando quem foi o ganhador
    else title.innerHTML = `Jogo acabou: ${win} ganhou.`

     // Caso o jogo tenha acabado, espera um tempo e reinicie a pagina para um outro jogo
    await sleep(2000)
    window.location.reload()

  }

  // Se o jogo não acabou, mostra uma mensagem dizendo qual jogador é a vez 
  else if(user == jogador) title.innerHTML = `Jogue ${user}`
  else title.innerHTML = "Computador está pensando..."

  // Vendo se é a vez da IA jogar
  if(user != jogador && !game_over) {
    // Ativando o algoritmo MiniMax e retorna a jogada analisada
    var move = minimax(board)

    // Adicionando essa jogada no quadro atual
    board = result(board, move[0], move[1])

    // Definindo qual botão é a da jogada e adicionando o elemento de visualização
    var i = move[0] * 3 + move[1]
    var h1 = document.createElement('h1')
    h1.innerHTML = jogador

    // Adicionando o elemento
    adc[i] = 1
    buttons[i].appendChild(h1)
    title.innerHTML = `Jogue ${user}`

    game_over = terminal(board)

    if(game_over) {
      // Vendo quem ganhou
      var win = winner(board)

      // Se ningúem ganhou, o jogo deu velha
      if(win == undefined) title.innerHTML = "Jogo acabou: Velha"

      // Se não, mostrando quem foi o ganhador
      else title.innerHTML = `Jogo acabou: ${win} ganhou.`

      // Caso o jogo tenha acabado, espera um tempo e reinicie a pagina para um outro jogo
      await sleep(2000)
      window.location.reload()
    }
  }

  if(user == jogador && !game_over) {
    var i = Math.trunc(indice / 3)
    var j = indice - i*3

    board = result(board, i, j)
    tictactoe(indice)
  }
}

// Função de aguardo
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Funções do algoritmo MiniMax

// Estado inicial
function initial_state() {
  return [[undefined, undefined, undefined], [undefined, undefined, undefined], [undefined, undefined, undefined]]
}

// De qual jogador é a vez
function player(board) {
  var quant_player_1 = 0;
  var quant_player_2 = 0;

  for(var i = 0; i < 3; i++) {
    for(var j = 0; j < 3; j++) {
      if(board[i][j] === X) quant_player_1++
      else if(board[i][j] === O) quant_player_2++
    }
  }
  if(quant_player_1 > quant_player_2) return O
  else return X
}

// Possíveis ações a partir de determinado estado
function actions(board) {
  var acoes = new Set()
  for(var i = 0; i < 3; i++) {
    for(var j = 0; j < 3; j++) {
      if(board[i][j] == undefined) acoes.add([i, j])
    }
  }

  return acoes
}

// Adicionando a board a jogada realizada
function result(board, i, j) {
  var board_copy = JSON.parse(JSON.stringify(board))
  var jogador = player(board_copy)

  board_copy[i][j] = jogador
  return board_copy
}

// Visualizando se alguem ganhou a partida e quem ganhou
function winner(board) {
  for(var i = 0; i < 3; i++) {
    if(board[i][0] == X && board[i][1] == X && board[i][2] == X) return X
  }

  for(var i = 0; i < 3; i++) {
    if(board[i][0] == O && board[i][1] == O && board[i][2] == O) return O
  }

  for(var i = 0; i < 3; i++) {
    if(board[0][i] == X && board[1][i] == X && board[2][i] == X) return X
  }

  for(var i = 0; i < 3; i++) {
    if(board[0][i] == O && board[1][i] == O && board[2][i] == O) return O
  }

  if(board[0][0] == X && board[1][1] == X && board[2][2] == X) return X

  if(board[0][0] == O && board[1][1] == O && board[2][2] == O) return O

  if(board[0][2] == X && board[1][1] == X && board[2][0] == X) return X

  if(board[0][2] == O && board[1][1] == O && board[2][0] == O) return O

  return undefined

}

// Verificando se o estado atual é um estado terminal
function terminal(board) {
  if(winner(board) != undefined) return true

  var e = true
  for(var i = 0; i < 3; i++) {
    for(var j = 0; j < 3; j++) {
      if(board[i][j] == undefined) e = false
    }
  }

  return e
}

// Vendo a utilidade do estado atual
function utilily(board) {
  if(winner(board) == X) return 1
  else if(winner(board) == O) return -1
  else return 0
}

// Menor valor
function Min_Value(board) {
  if(terminal(board)) return utilily(board)

  var v = Number.POSITIVE_INFINITY
  var acoes = actions(board)
  acoes.forEach(acao => {
    v = Math.min(v, Max_Value(result(board, acao[0], acao[1])))
  })

  return v
}

// Maior valor
function Max_Value(board) {
  if(terminal(board)) return utilily(board)

  var v = Number.NEGATIVE_INFINITY

  var acoes = actions(board)
  acoes.forEach(acao => {
    v = Math.max(v, Min_Value(result(board, acao[0], acao[1])))
  })
  
  return v
}

// Gerenciador do algoritmo
function minimax(board) {
  if(player(board) == X) {
    var valor = Number.NEGATIVE_INFINITY
    var action = [-1, -1]

    var acoes = actions(board)

    acoes.forEach(acao => {
      var minv = Min_Value(result(board, acao[0], acao[1]))

      if(minv > valor) {
        valor = minv
        action = acao
      }
    })
    
    return action

  } else {
    var valor = Number.POSITIVE_INFINITY

    var action = [-1, -1]
    var acoes = actions(board)

    acoes.forEach(acao => {
      var maxv = Max_Value(result(board, acao[0], acao[1]))
      if(maxv < valor) {
        valor = maxv
        action = acao
      }
    })

    return action
  }
}
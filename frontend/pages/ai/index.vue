<template>
    <div>
        <h1 class="text-5xl text-center text-bold my-5">Entrainement du model</h1>
        <NameSelector v-if="gameSelection" />
        <ColorSelector v-if="colorSelection" :playersList="players" />
        <VictoryScreen v-if="gameOver" :color="winner?.color" :name="winner?.name" @start-new-game-event="restartGame"/>
        <PlayScreen :color="currentPlayer?.color" :name="currentPlayer?.name" />
        <Grid :color="currentPlayer?.color" :grid="grid" @drop-event="gameEvent" />
        <div v-for="(row, index) in grid" :key="index">
            {{ row }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, Ref } from 'vue';

interface Players {
    id: number;
    name: string;
    color: string;
}

const board: Ref<string[][]> = ref([
    ["E", "E", "E", "E", "E", "E", "E"],
    ["E", "E", "E", "E", "E", "E", "E"],
    ["E", "E", "E", "E", "E", "E", "E"],
    ["E", "E", "E", "E", "E", "E", "E"],
    ["E", "E", "E", "E", "E", "E", "E"],
    ["E", "E", "E", "E", "E", "E", "E"]
]);

const grid: Ref<string[][]> = ref([
    ["E", "E", "E", "E", "E", "E", "E"],
    ["E", "E", "E", "E", "E", "E", "E"],
    ["E", "E", "E", "E", "E", "E", "E"],
    ["E", "E", "E", "E", "E", "E", "E"],
    ["E", "E", "E", "E", "E", "E", "E"],
    ["E", "E", "E", "E", "E", "E", "E"]
]);

const players: Ref<Players[] | undefined> =  ref()
const gameSelection: Ref<boolean> = ref(false);
const colorSelection: Ref<boolean> = ref(false);
const gameOver: Ref<boolean> = ref(false);
const gameMode: Ref<string> = ref('pve');
const currentPlayer: Ref<Players | undefined> = ref();
const nextPlayer: Ref<Players | undefined> = ref();
const winner: Ref<Players | undefined> = ref();

const COLORS = {
    YELLOW: 'Y',
    RED: 'R',
    PURPLE: 'P'
} 

players.value = [
    {id: 1, name:'Marc', color: COLORS.YELLOW},
    {id: 2, name:'Marco', color: COLORS.RED},
    {id: 3, name:'AI', color: COLORS.PURPLE}
]


function gameEvent(stateOfPlay: { color: string; row: number; col: number }): void {
    console.log('stateOfPlay: ', stateOfPlay);
    grid.value[stateOfPlay.row][stateOfPlay.col] = stateOfPlay.color;
    if(!isGameOver()) {
        // if (checkVictory(grid.value, stateOfPlay.row, stateOfPlay.col, stateOfPlay.color)) {
        //     gameOver.value = true;
        //     winner.value = currentPlayer.value;
        //     currentPlayer.value = undefined;
        //     console.log(`Le joueur ${stateOfPlay.color} a gagné !`);
        // }
        // else {
            if (currentPlayer.value) {
                const oldPlayer = currentPlayer.value;
                currentPlayer.value = undefined;
                nextPlayer.value = hasPlayed(oldPlayer);
                if(nextPlayer.value?.color == COLORS.PURPLE){
                    currentPlayer.value = nextPlayer.value
                    setTimeout(() => selectAction(), 1000)
                } else {
                    currentPlayer.value = nextPlayer.value
                }
                console.log('new current player ', currentPlayer.value)
            }
        // }
    } else {
        gameOver.value = true;
        currentPlayer.value = undefined;
    }
    
}

function isGameOver(): boolean {
    for (let col = 0; col < grid.value[0].length; col++) {
        if (grid.value[0][col] === "E") {
            return false;
        }
    }

    gameOver.value = true;
    console.log('Game Over!');

    return true;
}

function hasPlayed(hasPlayedPlayer: Players): undefined | Players {
    if (gameSelection.value) {
        return;
    }
    if (colorSelection.value) {
        return;
    }
    if(players.value) {
        if(gameMode.value == 'pve') {
            console.log('pve - hasPlayed ', hasPlayedPlayer)
            if(hasPlayedPlayer.color === COLORS.PURPLE ) {
                console.log('pve - next player', players.value.find(p => p.color == COLORS.YELLOW))
                return players.value.find(p => p.color == COLORS.YELLOW)
            } else {
                console.log('pve - next player', players.value.find(p => p.color == COLORS.PURPLE))
                return players.value.find(p => p.color == COLORS.PURPLE)
            }
        } else if(gameMode.value == 'pvp') {
            console.log('pvp - hasPlayed ', hasPlayedPlayer)
            if(hasPlayedPlayer.color === COLORS.RED ) {
                console.log('pvp - next player', players.value.find(p => p.color == COLORS.YELLOW))
                return players.value.find(p => p.color == COLORS.YELLOW)
            } else {
                console.log('pvp - next player', players.value.find(p => p.color == COLORS.RED))
                return players.value.find(p => p.color == COLORS.RED)
            }   
        }
    }
}

function restartGame(): void {
    console.log("Starting new game...");
    // copie profonde (deep copy) des tableaux à l'intérieur de board.value avant de les assigner à grid.value
    // Pour éviter que la Référence en mémoire modifie la valeur de board.value
    grid.value = JSON.parse(JSON.stringify(board.value));

    console.log('board: ', board.value)

    if(players.value) {

        if(gameMode.value == 'pvp') {
            currentPlayer.value = players.value.find(p => p.color !== winner?.value?.color);
        } else {
            currentPlayer.value = players.value.find(p => p.color == COLORS.YELLOW)
        }

        gameOver.value = false;
        
        winner.value = undefined;
    }
}

function checkVictory(grid: string[][], row: number, col: number, player: string): boolean {
    // Vérification en hauteur
    for (let i = 0; i <= grid.length - 4; i++) {
        if (
            grid[i][col] === player &&
            grid[i + 1][col] === player &&
            grid[i + 2][col] === player &&
            grid[i + 3][col] === player
        ) {
            return true;
        }
    }

    // Vérification en largeur
    for (let j = 0; j <= grid[row].length - 4; j++) {
        if (
            grid[row][j] === player &&
            grid[row][j + 1] === player &&
            grid[row][j + 2] === player &&
            grid[row][j + 3] === player
        ) {
            return true;
        }
    }

    // Vérification en diagonale (bas gauche vers haut droite)
    for (let i = 3; i < grid.length; i++) {
        for (let j = 0; j <= grid[i].length - 4; j++) {
            if (
                grid[i][j] === player &&
                grid[i - 1][j + 1] === player &&
                grid[i - 2][j + 2] === player &&
                grid[i - 3][j + 3] === player
            ) {
                return true;
            }
        }
    }

    // Vérification en diagonale (haut gauche vers bas droite)
    for (let i = 0; i <= grid.length - 4; i++) {
        for (let j = 0; j <= grid[i].length - 4; j++) {
            if (
                grid[i][j] === player &&
                grid[i + 1][j + 1] === player &&
                grid[i + 2][j + 2] === player &&
                grid[i + 3][j + 3] === player
            ) {
                return true;
            }
        }
    }

    return false;
}

// *******************************************************
// *******************************************************
// *******************************************************
// MODEL
// *******************************************************
// *******************************************************
// *******************************************************

import * as tf from '@tensorflow/tfjs';

// Définissez les récompenses
const WIN_REWARD = 1;
const LOSE_REWARD = -1;
const STEP_REWARD = -0.1; // Récompense négative pour chaque étape

// Définissez les actions possibles
const ACTIONS: number[] = Array.from({ length: grid.value[0].length }, (_, index) => index); // Indices de colonnes

// Créez un modèle séquentiel
const model = tf.sequential();

const inputShape: number[] = [grid.value.length, grid.value[0].length];

// Ajoutez des couches au modèle
model.add(tf.layers.dense({ inputShape: inputShape, units: ACTIONS.length, activation: 'relu' }));
// Ajoutez plus de couches si nécessaire, en fonction de la complexité de votre problème

// Compilez le modèle avec une fonction de perte appropriée et un optimiseur
model.compile({ loss: 'meanSquaredError', optimizer: 'adam' });

function randomIntFromInterval(min: number, max: number) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

// function selectAction() {
//     const colIndex = ACTIONS[randomIntFromInterval(0, grid.value[0].length - 1)]
//     console.log(colIndex)
//     const column = grid.value.map(row => row[colIndex]);
//     const row = column.lastIndexOf('E');
//     grid.value[row][colIndex] = 'P';
//     console.log(grid.value)
// }

// selectAction();


function selectAction(): void {
    if(players.value){
        currentPlayer.value = players.value[2]
        console.log('currentPlayer.value', currentPlayer.value)
        const colIndex = ACTIONS[randomIntFromInterval(0, grid.value[0].length - 1)];
        console.log("Colonne choisie au hasard : " + colIndex);
        
        // Trouver l'index du dernier 'E' dans la colonne sélectionnée
        let rowIndex = -1;
        for (let i = grid.value.length - 1; i >= 0; i--) {
            if (grid.value[i][colIndex] === 'E') {
                rowIndex = i;
                break;
            }
        }
        
        // Mettre 'P' dans la dernière case 'E' de la colonne sélectionnée
        if (rowIndex !== -1) {
            gameEvent({color: COLORS.PURPLE, row: rowIndex, col: colIndex})
            console.log('reward : ', 1)
        } else {
            selectAction()
            console.log('reward : ', -1)
        }
    }
}

selectAction();



// // Définissez votre modèle de réseau neuronal ici

// // Fonction pour sélectionner une action en fonction de l'état actuel (politique epsilon-greedy)
// function selectAction(state: string[][], epsilon: number) {
//     if (Math.random() < epsilon) {
//         // Exploration : choisissez une action aléatoire
//         return ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
//     } else {
//         // Exploitation : choisissez l'action avec la plus grande valeur Q prédite
//         // Utilisez votre modèle pour prédire les valeurs Q pour chaque action et retournez l'indice de l'action avec la plus grande valeur
//         // (utilisez le modèle.predict() de TensorFlow.js ou l'équivalent dans votre bibliothèque)
//         // Ne pas oublier de prétraiter l'état en fonction de votre représentation (par exemple, encoder l'état en tant que tenseur)
//     }
// }

// // Fonction pour mettre à jour les valeurs Q en fonction de l'expérience de l'agent
// function updateQValues(state: string[][], action: number, reward: number, nextState: string[][]): void {
//     // Utilisez votre modèle pour prédire les valeurs Q pour l'état actuel et l'état suivant
//     // Mettez à jour les valeurs Q en fonction de l'algorithme Q-Learning
//     // (par exemple, utilisez la formule Q(s, a) = Q(s, a) + alpha * (reward + gamma * max(Q(s', a')) - Q(s, a))
//     // Entraînez votre modèle avec les nouvelles valeurs Q (utilisez la méthode model.fit() de TensorFlow.js ou l'équivalent dans votre bibliothèque)
// }

// Fonction pour jouer un épisode du jeu
// function playEpisode(epsilon: number): void {
//     // Réinitialisez votre environnement (grille) ici

//     // Boucle de l'épisode
//     while (true) {
//         // Sélectionnez une action en fonction de l'état actuel
//         const action = selectAction(grid.value, epsilon);

//         // Appliquez l'action et obtenez la récompense et le nouvel état
//         // (mettez à jour la grille en fonction de l'action choisie et obtenez la récompense et le nouvel état)

//         // Mettez à jour les valeurs Q en fonction de l'expérience de l'agent
//         //! TODO updateQValues(grid.value, action, reward, newGridState);

//         // Vérifiez si le jeu est terminé (victoire, défaite ou match nul)
//         if (gameOver) {
//             break;
//         }
//     }
// }

// // Appel de la fonction playEpisode avec un epsilon approprié pour l'exploration/exploitation
// const epsilon = 0.1; // Par exemple, 10% de chances d'explorer
// playEpisode(epsilon);


</script>
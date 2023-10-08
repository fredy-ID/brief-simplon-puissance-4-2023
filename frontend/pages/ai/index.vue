<template>
    <div>
        <div class="flex flex-col items-center justify-center my-5">
            <h1 class="text-5xl text-center text-bold my-5">Entrainement du model</h1>
            <div class="w-32">
                <button class="flex justify-center column w-full m-0 p-0 btn btn-info">Entraîner</button>
            </div>
        </div>
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
import { ref, Ref, onMounted } from 'vue';

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

const WIN_REWARD = 6;
const DRAW_REWARD = 12;
const NORMAL_REWARD = 1;
const LOSE_REWARD = -6;
const OUT_OF_BOUND = -1;
const STEP_REWARD = 0.1;


function gameEvent(stateOfPlay: { color: string; row: number; col: number }, gridState: string[][] | null = null): {game: string[][], reward: number} {
    console.log('stateOfPlay: ', stateOfPlay);
    let game = grid.value
    if(gridState !== null) {
        game = gridState;
    }
    game[stateOfPlay.row][stateOfPlay.col] = stateOfPlay.color;
    if(!isGameOver()) {
        if (checkVictory(game, stateOfPlay.row, stateOfPlay.col, stateOfPlay.color)) {
            gameOver.value = true;
            winner.value = currentPlayer.value;
            currentPlayer.value = undefined;
            console.log(`Le joueur ${stateOfPlay.color} a gagné !`);

            return {game: game, reward: WIN_REWARD }
        }
        else {
            if (currentPlayer.value) {
                const oldPlayer = currentPlayer.value;
                currentPlayer.value = undefined;
                nextPlayer.value = hasPlayed(oldPlayer);
                if(nextPlayer.value?.color == COLORS.PURPLE){
                    currentPlayer.value = nextPlayer.value
                    if(gridState !== null) {
                        // selectAction()
                        setTimeout(() => selectAction(), 1000)
                    }else 
                    {
                        setTimeout(() => selectAction(), 1000)
                    }
                } else {
                    currentPlayer.value = nextPlayer.value
                }
                console.log('new current player ', currentPlayer.value)
            }
            return {game: game, reward: NORMAL_REWARD }
        }
    } else {
        gameOver.value = true;
        currentPlayer.value = undefined;

        return {game: game, reward: DRAW_REWARD }
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


// Définissez les actions possibles
const ACTIONS: number[] = Array.from({ length: grid.value[0].length }, (_, index) => index); // Indices de colonnes

// Create the model
// Input
//? [batch d'état: null, nombre d'etat : taille de la grid ]
const input = tf.input({batchShape: [null, grid.value.length * grid.value[0].length]});
// Hidden layer
const layer = tf.layers.dense({useBias: true, units: 32, activation: 'relu'}).apply(input) as tf.SymbolicTensor;
// Output layer
const output = tf.layers.dense({useBias: true, units: 7, activation: 'linear'}).apply(layer) as tf.SymbolicTensor;
// Create the model
const model = tf.model({inputs: input, outputs: output});
// Optimize
let model_optimizer = tf.train.adam(0.01);

// Loss of the model
function model_loss(tf_states: any, tf_actions: any, Qtargets: any){
    return tf.tidy(() => {
        // valeur
        return model.predict(tf_states).sub(Qtargets).square().mul(tf_actions).mean();
    });
}

// function model_loss(tf_states: any, tf_actions: any, Qtargets: any): tf.Tensor {
//     return tf.tidy(() => {
//         // Calculez la perte en utilisant l'erreur quadratique moyenne
//         const loss = tf.losses.meanSquaredError(Qtargets, model.predict(tf_states));
//         // Appliquez la pénalité pour les actions non prises
//         const maskedLoss = loss.mul(tf_actions);
//         // Retournez la perte finale
//         return maskedLoss.mean();
//     });
// }

function randomIntFromInterval(min: number, max: number): number { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function grid_tensor(grid: string[][]): tf.Tensor {
    // Par exemple, convertissez la grille de chaînes en tableau de nombres (0 pour "E", 1 pour "Y", -1 pour "R", ou quelque chose de similaire)
    const encodedGrid = grid.map(row => row.map(cell => (cell === 'E' ? 0 : cell === 'Y' ? 1 : cell === 'R' ? 1 : 2)));
    // const inputTensor = tf.tensor(encodedGrid, [1, encodedGrid.length * encodedGrid[0].length]);
    const flattenedGrid = encodedGrid.flat();
    console.log('flattenedGrid', [flattenedGrid])
    const inputTensor = tf.tensor([flattenedGrid]);
    // const inputTensor = tf.tensor([flattenedGrid], [grid[0].length, 42]);
    return  inputTensor

}


async function action(state: string[][], epsilon: number): Promise<number> {
    const st_tensor: tf.Tensor = grid_tensor(state)
    let act: number;
    if (Math.random() < epsilon) {
        // Exploration : choisissez une action aléatoire
        act = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
        return act
    } else {
        console.log('st_tensor', st_tensor)
        const result = model.predict(st_tensor) as tf.Tensor;
        const argMax = result.argMax(1)
        const buffer = await argMax.buffer();
        const actionIndex = argMax.dataSync()[0];
        // TODO : Regarder à quoi correspond buffer
        act = buffer.values[0];
        argMax.dispose();
        result.dispose();
    }
    st_tensor.dispose();
    return act;
}   

async function selectAction(gameType: string = 'normal', gridState: string[][] | null = null, epsilon: number = 0.0): Promise<{action: null | number, gameState: {game: string[][], reward: number}}> {
    let player = null

    let game = grid.value
    if(gridState !== null) {
        game = gridState;
    }
    
    if(players.value){
        if(gameType == 'train') {
            player = players.value[2]
        } else {
            player = currentPlayer.value 
        }
        currentPlayer.value = player
        console.log('currentPlayer.value', currentPlayer.value)
        const colIndex = await action(game, epsilon)
        console.log("Colonne choisie au hasard : " + colIndex);
        
        // Trouver l'index du dernier 'E' dans la colonne sélectionnée
        let rowIndex = -1;
        for (let i = game.length - 1; i >= 0; i--) {
            if (game[i][colIndex] === 'E') {
                rowIndex = i;
                break;
            }
        }

        let gameState: {game: string[][], reward: number};
        
        // Mettre 'P' dans la dernière case 'E' de la colonne sélectionnée
        if (rowIndex !== -1) {
            gameState = gameEvent({color: COLORS.PURPLE, row: rowIndex, col: colIndex}, gridState)
            console.log('reward : ', 0)
            return {action: colIndex, gameState: gameState};
        } else {
            // selectAction()
            console.log('reward : ', -1)
            return {action: colIndex, gameState: {game: game, reward: -1}};
        }
    } else {
        return {action: null, gameState: {game: game, reward: 0}};
    }
    
}

onMounted(() => {
    let rwd = selectAction();
});

async function stepAction(grid: string[][], epsilon: number): Promise<{action: null | number, gameState: {game: string[][], reward: number}}> {
    const reward = await selectAction('train', grid, epsilon);
    return reward;
}

function mean(array: number[]){
    if (array.length == 0)
        return null;
    var sum = array.reduce(function(a, b) { return a + b; });
    var avg = sum / array.length;
    return avg;
}

async function train(grid: string[][]) {

    let eps = 1.0;
    // Used to store the experiences
    let states: tf.Tensor[] = [];
    let rewards: number[][] = [];
    let reward_mean: number[] = [];
    let next_states: tf.Tensor[] = [];
    let actions: number[][] = [];

    // Get the current state of the lidar
    let st: tf.Tensor = grid_tensor(grid);
    let st2: tf.Tensor;

    for (let epi=0; epi < 150; epi++){
        let reward: number = 0;
        let step: number = 0;
        while (step < 400){
            // pick an action
            // let act = pickAction(st, eps);
            let stepActionResult = await stepAction(grid, eps)
            if(stepActionResult.action == null) {
                return;
            }
            let act: number = stepActionResult.action
            reward = stepActionResult.gameState.reward
            st2 = grid_tensor(stepActionResult.gameState.game)

            let mask: number[] = Array.from({ length: grid[0].length }, (_, index) => 0);
            mask[act] = 1;

            // Randomly insert the new transition tuple
            let index: number = Math.floor(Math.random() * states.length);
            states.splice(index, 0, st);
            rewards.splice(index, 0, [reward]);
            reward_mean.splice(index, 0, reward)
            next_states.splice(index, 0, st2);
            actions.splice(index, 0, mask);
            // Be sure to keep the size of the dataset under 10000 transitions
            if (states.length > 10000){
                states = states.slice(1, states.length);
                rewards = rewards.slice(1, rewards.length);
                reward_mean = reward_mean.slice(1, reward_mean.length);
                next_states = next_states.slice(1, next_states.length);
                actions = actions.slice(1, actions.length);
            }

            st = st2;
            step += 1;
        }
        // Decrease epsilon
        eps = Math.max(0.1, eps*0.99);

        // Train model every 5 episodes
        if (epi % 5 == 0){
            console.log("---------------");
            console.log("rewards mean", mean(reward_mean));
            console.log("episode", epi);
            await train_model(states, actions, rewards, next_states);
            await tf.nextFrame();
        }
    }

};

    // Train the model
function train_model(states: any, actions:any, rewards:any, next_states:any){
    var size = next_states.length;
    // Transform each array into a tensor
    // let tf_states = tf.tensor2d(states, shape=[states.length, 42]);
    // let tf_rewards = tf.tensor2d(rewards, shape=[rewards.length, 1]);
    // let tf_next_states = tf.tensor2d(next_states, shape=[next_states.length, 42]);
    // let tf_actions = tf.tensor2d(actions, shape=[actions.length, 3]);
    // Get the list of loss to compute the mean later in this function
    let tf_states = states;
    let tf_rewards = rewards;
    let tf_next_states = next_states;
    let tf_actions = actions;
    // Get the list of loss to compute the mean later in this function
    let losses: any = []

    // Get the QTargets
    const Qtargets = tf.tidy(() => {
        let Q_stp1 = model.predict(tf_next_states);
        let Qtargets = tf.tensor2d(Q_stp1.max(1).expandDims(1).mul(tf.scalar(0.99)).add(tf_rewards).buffer().values, shape=[size, 1]);
        return Qtargets;
    });

    // Generate batch of training and train the model
    let batch_size = 32;
    for (var b = 0; b < size; b+=32) {

        // Select the batch
        let to = (b + batch_size < size) ?  batch_size  : (size - b);
        const tf_states_b = tf_states.slice(b, to);
        const tf_actions_b = tf_actions.slice(b, to);
        const Qtargets_b = Qtargets.slice(b, to);

        // Minimize the error
        model_optimizer.minimize(() => {
            const loss = model_loss(tf_states_b, tf_actions_b, Qtargets_b);
            losses.push(loss.buffer().values[0]);
            return loss;
        });

        // Dispose the tensors from the memory
        tf_states_b.dispose();
        tf_actions_b.dispose();
        Qtargets_b.dispose();
    }
    console.log("Mean loss", mean(losses));

    // Dispose the tensors from the memory
    Qtargets.dispose();
    tf_states.dispose();
    tf_rewards.dispose();
    tf_next_states.dispose();
    tf_actions.dispose();
}

train(grid.value);


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
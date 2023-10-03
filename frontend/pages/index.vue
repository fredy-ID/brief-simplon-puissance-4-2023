<template>
    <div>
        <NameSelector />
        <ColorSelector :playersList="players" />
        <PlayScreen :color="currentPlayer?.color" :name="currentPlayer?.name" />
        <VictoryScreen :color="currentPlayer?.color" :name="currentPlayer?.name" />
        <Grid :color="currentPlayer?.color" :grid="grid" @drop-event="gameEvent" />
    </div>
</template>

<script setup lang="ts">
import { ref, Ref } from 'vue';

interface Players {
    id: number;
    name: string;
    color: string;
}

const grid: Ref<string[][]> = ref([
    ["E", "E", "Y", "E", "E", "E", "E"],
    ["E", "E", "E", "E", "E", "Y", "E"],
    ["E", "E", "E", "E", "E", "E", "E"],
    ["E", "E", "E", "E", "E", "E", "E"],
    ["E", "E", "E", "E", "E", "E", "E"],
    ["E", "E", "E", "E", "E", "R", "E"]
]);

const players: Ref<Players[] | undefined> =  ref()
const gameSelection: Ref<boolean> = ref(false);
const colorSelection: Ref<boolean> = ref(false);
const currentPlayer: Ref<Players | undefined> = ref();

players.value = [
    {id: 1, name:'Marc', color: 'Y'},
    {id: 2, name:'Marco', color: 'R'}
]
currentPlayer.value = players.value[0]


function hasPlayed(hasPlayedPlayer: Players) {
    if (gameSelection.value) {
        return;
    }
    if (colorSelection.value) {
        return;
    }
    if(players && players.value) {
        return players.value.find(p => p.color !== hasPlayedPlayer.color);
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

function gameEvent(stateOfPlay: { color: string; row: number; col: number }) {
    console.log('stateOfPlay: ', stateOfPlay);
    grid.value[stateOfPlay.row][stateOfPlay.col] = stateOfPlay.color;
    if (checkVictory(grid.value, stateOfPlay.row, stateOfPlay.col, stateOfPlay.color)) {
        console.log(`Le joueur ${stateOfPlay.color} a gagné !`);
    } else {
        if (currentPlayer && currentPlayer.value) {
            currentPlayer.value = hasPlayed(currentPlayer.value);
        }
    }
}

</script>
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


function playTurn(hasPlayedPlayer: Players) {
    if (gameSelection.value) {
        return;
    }
    if (colorSelection.value) {
        return;
    }
    if(players && players.value) {
        return currentPlayer.value = players.value.find(p => p.color !== hasPlayedPlayer.color);
    }
}

function gameEvent(stateOfPlay: {color: string, row: number, col: number}) {
    console.log('stateOfPlay: ', stateOfPlay)
    grid.value[stateOfPlay.row][stateOfPlay.col] = stateOfPlay.color;
    if(currentPlayer && currentPlayer.value) {
        currentPlayer.value = playTurn(currentPlayer.value)
        
    }

}

</script>
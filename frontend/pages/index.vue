<template>
    <div>
        <NameSelector />
        <ColorSelector :playersList="players" />
        <PlayScreen :color="playerColor" :name="playerName" />
        <VictoryScreen :color="playerColor" :name="playerName" />
        <Grid :color="playerColor" />
    </div>
</template>

<script setup lang="ts">
import { ref, Ref } from 'vue';

interface Players {
    id: number;
    name: string;
    color: string;
}

type PlayersList = Players[];

const players: Ref<PlayersList> = ref([]);

players.value = [
    {id: 1, name:'Marc', color: 'Y'},
    {id: 2, name:'Marco', color: 'R'}
]

const playerColor: Ref<string | undefined> = ref(players.value[1].color);
const playerName: Ref<string | undefined> = ref(players.value[1].name);

// function updatePlayersList(selectedNames: string[]) {
//     // Suppose you have a function to fetch player colors based on selected names
//     // For example, a function called fetchPlayerColors(selectedNames: string[]): Player[]
//     players.value = fetchPlayerColors(selectedNames);
// }


function fetchPlayerColors(selectedNames: string[]): Players[] {
    return selectedNames.map((name, index) => ({
        id: index + 1,
        name: name,
        color: index % 2 === 0 ? 'yellow' : 'red'
    }));
}

</script>
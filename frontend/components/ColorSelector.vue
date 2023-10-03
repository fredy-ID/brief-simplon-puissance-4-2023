<template>
    <div class="flex flex-row gap-x-4">
        <div class="players" v-for="player in playersList" :key="player.id">
            <div class="player flex items-center gap-1">
                {{ player.name }}
                <div v-if="player.color" :class="discColor(player.color)"></div>
            </div>
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

interface PlayerColor {
    color: string;
}

const props = defineProps({
    playersList: {
        type: Array as () => Players[],
        required: true,
    },
});

function discColor(color: string) {
    return `disc disc-${color == "yellow" ? "yellow" : "red"}`;
}
</script>

<style scoped>
.disc{
    background-color: #f6db38;
    box-shadow: inset 0 0 0 3px #97851d;
    border: solid 3px #f6db38;
    outline: solid 1px #97851d;
    width: 20px;
    height: 20px;
    border-radius: 100%;
}

.disc-red{
    background-color: #f63838;
    box-shadow: inset 0 0 0 3px #971d1d;
    border: solid 3px #f63838;
    outline: solid 1px #971d1d;
    width: 20px;
    height: 20px;
    border-radius: 100%;
}
</style>
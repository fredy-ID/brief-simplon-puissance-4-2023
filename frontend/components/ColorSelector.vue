<template>
    <div class="hero bg-base-200">
        <div class="hero-content text-center">
            <div class="flex flex-col">
                <div class="flex flex-row gap-x-4">
                    <div class="players" v-for="player in playersList" :key="player.id">
                        <div class="player flex items-center gap-1">
                            {{ player.name }}
                            <div v-if="player.color" :class="discColor(player.color)"></div>
                        </div>
                    </div>
                </div>
                <div class="mt-2">
                    <h3 class="text-3xl">Selectionnez une couleur</h3>
                    <div class="selector flex gap-2 mt-3">
                        <button v-for="color in colors" :key="color" :class="discColor(color)" @click="selectColor(color)"></button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, Ref } from 'vue';

const props = defineProps({
    playersList: {
        type: Array as () => Players[],
        required: true,
    },
});


interface Players {
    id: number;
    name: string;
    color: string;
}

interface PlayerColor {
    color: string;
}

const emit = defineEmits(['color-choice-event'])
const colors: Ref<string[]> = ref(['yellow', 'red'])


function discColor(color: string) {
    if(color == 'E') {
        return 'disc';
    }
    return `disc disc-${color == "yellow" ? "yellow" : "red"}`;
}

function selectColor(color: string) {
    emit('color-choice-event', { color: color })
}

</script>

<style scoped>
.disc-yellow{
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

.selector .disc {
    margin: 10px;
    transform: scale(2);
}
</style>
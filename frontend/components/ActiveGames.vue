<template>
    <div>
        <div class="mt-10">
            <slot/>
            <div class="flex flex-row items-center justify-center">
                <div v-for="(game, index) in activeGames" :key="index" class="card w-96 m-10 bg-neutral">
                    <div class="flex flex-col p-6 justify-around h-full">
                        <div class="text-left h-32">
                            <ul>
                                <li>Créateur: {{ creator }} </li>
                                <li class="my-2">Challenger: {{ game.challenger }}</li>
                                <li>Référence: {{ game.reference }}</li>
                            </ul>
                        </div>
                        
                        <div :class="'tooltip tooltip-top w-full' + (clickCopyToClipboard ? 'tooltip-open tooltip-success' : '')" :data-tip="(clickCopyToClipboard ? 'Copié!' : 'Copier dans le press papier')">
                            <button class="btn btn-primary w-full" @click="copyToClipboard(game.reference)">Copier la référence</button>
                        </div>
                        <button class="btn btn-primary my-2" @click="play(game.reference)">Rejoindre</button>

                        <button class="btn btn-error" @click="deleteGame(game.id)">Supprimer</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, Ref, watch} from 'vue';
import axiosApiIntance from "@/services/axiosApiIntance"

interface Game {
    id: number;
    reference: string;
    challenger: string;
}

const props = defineProps({
    activeGames: {
        type: Array as () => Game[],
        required: false,
    },
    creator: {
        type: String,
        required: false,
    }
});

const activeGamesCopy = ref(props.activeGames);
const emit = defineEmits(['init-game-event', 'can-play-event'])
const playerName: Ref<string | undefined> = ref();
const error: Ref<string | undefined> = ref();
const clickCopyToClipboard: Ref<boolean> = ref(false)

async function play(reference: string) {

    const data = {
        player: props.creator,
        reference: reference
    }

    await axiosApiIntance.post('/api/user/play', data)
        .then(async (response: any) => {

            if(response.data.canPlay === false) {
                error.value = response.data.message;
            }

            emit('can-play-event', {canPlay: response.data.canPlay})

            })
            .catch((error: Promise<{}>) => {
            console.log("error", error)
        });
}

async function copyToClipboard(reference: string) {
    navigator.clipboard.writeText(reference)
    clickCopyToClipboard.value = true;
    
    setTimeout(() => {
        clickCopyToClipboard.value = false;
    }, 2000);
}


async function deleteGame(gameId: number) {
    try {
        await axiosApiIntance.delete('/api/user/deleteGame/'+gameId);
        emit('init-game-event')
    } catch (error) {
        console.error('Erreur lors de la suppression du jeu :', error);
    }
}

</script>
<template>
    <div>
        <div class="mt-10">
            
            <h3 class="text-3xl text-center">Nouvelle partie !</h3>
            <div class="flex flex-row items-center justify-center">
                <div class="card w-96 h-60 m-10 bg-neutral">
                    <div class="flex flex-col p-6 justify-around h-full">
                        <div class="text-center">Joueur une partie en ligne contre d'autres joueurs</div>
                        <div class="w-full flex flex-col">
                            <button class="btn btn-primary" @click="createNewGame()">Nouvelle partie</button>
                            <button class="btn btn-primary mt-2" @click="joinNewGame()">Rejoindre une nouvelle partie</button>
                        </div>
                    </div>
                </div>
                <div class="card w-96 h-60 my-10 bg-neutral">
                    <div class="flex flex-col p-6 justify-around h-full">
                        <div class="text-center">Profitez de toute la puissance de notre IA</div>
                        <button disabled class="btn btn-primary">Contre IA</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, Ref } from 'vue';
import axiosApiIntance from "@/services/axiosApiIntance"

const emit = defineEmits(['new-game-event', 'join-new-game-event'])
const playerName: Ref<string | undefined> = ref();
const error: Ref<string | undefined> = ref();

async function createNewGame() {

    const data = {creator: localStorage.getItem('player')}

    await axiosApiIntance.post('/api/user/createNewGame', data)
    .then(async (response: any) => {

            console.log(response.data)
            emit('new-game-event', { 
                creator: response.data.creator, 
                creatorName: response.data.name, 
                gameId: response.data.gameId, 
                gameReference: response.data.gameReference
            })

        })
        .catch((error: Promise<{}>) => {
        console.log(error)
    });
}

function joinNewGame() {
    emit('join-new-game-event')
}



</script>
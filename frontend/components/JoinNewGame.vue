<template>
    <div class="hero min-h-screen bg-base-200">
        <div class="hero-content text-center">
            <div class="max-w-md">
                <AlertComponent v-if="error">
                    <p>{{ error }}</p>
                    <div class="pt-8 md:pt-0">
                    <button class="btn btn-outline-neutral btn-sm m-2" @click="closeAlert">x</button>
                    </div>
                </AlertComponent>
                <div class="card w-96 bg-base-100 shadow-xl">
                    <div class="card-body form">
                        <form @submit="handleDeleteMissionSubmit">
                            <div class="form-control w-full max-w-xs">
                                <div class="form-box-input">
                                    <label class="label">
                                        <span class="label-text">Référence de la partie</span>
                                    </label>
                                    <input type="text" placeholder="" class="input input-bordered w-full max-w-xs" v-model="gameReference" />
                                </div>
                            </div>
                            <div class="card-actions justify-end mt-5">
                                <button class="btn btn-primary">Continuer</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
</template>

<script setup lang="ts">
import { ref, Ref } from 'vue';
import axiosApiIntance from "@/services/axiosApiIntance"

const emit = defineEmits(['can-play-event'])
const gameReference: Ref<string | undefined> = ref();
const error: Ref<string | undefined> = ref();

const props = defineProps({
    player: {
        type: String,
        required: false,
    },
});

async function handleDeleteMissionSubmit(event: Event) {
    event.preventDefault();

    if(gameReference.value && gameReference.value != "") {
        console.log(props.player)
        const data = {
            challenger: props.player,
            reference: gameReference.value
        }

        await axiosApiIntance.patch('/api/user/joinNewGame', data)
        .then(async (response: any) => {

            if(response.data.canPlay === false) {
                error.value = response.data.message;
            }

            emit('can-play-event', {canPlay: response.data.canPlay, reference: data.reference})

            })
            .catch((error: Promise<{}>) => {
            console.log("error", error)
        });
    }
    else {
        error.value = "Vous devez entrer une référence correcte";
    }
}

function closeAlert() {
  error.value = undefined;
}




</script>

<style scoped>
form .form-box-input{
    margin: 10px 0 10px 0;
}
</style>
<template>
  <div>
    <AlertComponent v-if="error">
      <p>{{ error }}</p>
      <div class="pt-8 md:pt-0">
        <button class="btn btn-outline-neutral btn-sm m-2" @click="closeAlert">x</button>
      </div>
    </AlertComponent>
    <div class="hero bg-base-200">
      <div class="hero-content text-center">
        <div class="form-control w-full max-w-xs">
          <label class="label">
            <span class="label-text">Sélectionner un pseudo</span>
          </label>
          <form @submit="selectName">
            <input v-model="playerName" type="text" placeholder="Nom du joueur" id="playerName" name="name" class="input input-bordered w-full max-w-xs" required/>
            <button :disabled="active_btn ? false : true" block type="submit" class="btn btn-neutral">Choisir</button>
          </form>
        </div>
        <div>
          <!--  -->
        </div>
      </div>
    </div>
  </div>
  
</template>

<script setup lang="ts">
import { ref, Ref } from 'vue';

const error: Ref<string | undefined> = ref();
const playerName: Ref<string | undefined> = ref();
const active_btn: Ref<boolean> = ref(false);
  
async function selectName(e: Event): Promise<void> {
    e.preventDefault();

    if(!playerName.value || playerName.value.toString().trim() === '') {
      error.value = "Vous devez choisir un pseudo";
      return;
    }

    console.log(playerName.value)
}

function closeAlert() {
  error.value = undefined;
}

</script>
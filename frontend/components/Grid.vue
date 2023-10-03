<template>
    <div>
      <div class="board h-96 w-96">
        <div class="grid relative h-full">
          <div v-for="(row, rowIndex) in grid" :key="rowIndex" class="row border border-2 border-neutral h-full">
            <div v-for="(cell, colIndex) in row" :key="colIndex" class="col border border-2 border-warning h-full w-100">
                <div class="cell h-full">text</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
<script setup lang="ts">
    import { ref, Ref } from 'vue';
    const columns: Ref<number> = ref(7);
    const rows: Ref<number> = ref(6);

    const grid: Ref<string[][]> = ref([
        ["E", "E", "E", "E", "E", "E", "E"],
        ["E", "E", "E", "E", "E", "E", "E"],
        ["E", "E", "E", "E", "E", "E", "E"],
        ["E", "E", "E", "E", "E", "E", "E"],
        ["E", "E", "E", "E", "E", "E", "E"],
        ["E", "E", "E", "E", "E", "E", "E"]
    ]);

</script>
  
<style scoped>
.grid {
    display: grid;
    grid-template-columns: repeat(v-bind('columns'), 1fr);
    grid-template-rows: repeat(v-bind('rows'), 1fr);
    aspect-ratio: v-bind('columns') / v-bind('rows');
    align-items: center;
    justify-content: center;
    border: 15px solid #2a5782;
    background-color: #336dac;
    background: radial-gradient(
        circle, 
        transparent, 
        transparent 50%,
        #336dac 51%, 
        #336dac 68.01%, 
        #2a5782 80%
    );
    background-size: calc(100% / v-bind('columns')) calc(100% / v-bind('rows'));
}


</style>
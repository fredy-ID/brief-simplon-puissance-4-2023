<template>
    <div>
      <div class="relative board h-96 w-96">
        <div class="absolute z-0 c-grid flex h-full w-full"></div>
        <div class="h-full w-full flex flex-col c-cells">
            <div v-for="(col, rowIndex) in grid" :key="rowIndex" class="flex flew-row grow border border2 border-error">
                <div v-for="(row, colIndex) in grid[0]" :key="colIndex" class="grow border border2 border-warning">
                    {{ rowIndex }} - {{ colIndex }}
                </div>
            </div>
        </div>
        
      </div>
    </div>
  </template>
  
<script setup lang="ts">
    import { ref, Ref } from 'vue';

    const grid: Ref<string[][]> = ref([
        ["E", "E", "E", "E", "E", "E", "E"],
        ["E", "E", "E", "E", "E", "E", "E"],
        ["E", "E", "E", "E", "E", "E", "E"],
        ["E", "E", "E", "E", "E", "E", "E"],
        ["E", "E", "E", "E", "E", "E", "E"],
        ["E", "E", "E", "E", "E", "E", "E"]
    ]);

    const columns: Ref<number> = ref(grid.value[0].length);
    const rows: Ref<number> = ref(grid.value.length);

</script>
  
<style scoped>
.c-grid, .c-cells {
    border: 15px solid #2a5782;
}
.c-grid {
    display: grid;
    grid-template-columns: repeat(v-bind('columns'), 1fr);
    grid-template-rows: repeat(v-bind('rows'), 1fr);
    aspect-ratio: v-bind('columns') / v-bind('rows');
    align-items: center;
    justify-content: center;
    
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
    z-index: -1;
    
}

.fff{
    
}

</style>
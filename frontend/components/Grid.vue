<template>
    <div>
      <div class="relative board h-96 w-96">
        <div class="absolute z-0 c-grid flex h-full w-full"></div>
        <div class="h-full w-full flex flex-col c-cells">
            <div v-for="(col, rowIndex) in grid" :key="rowIndex" class="flex flew-row grow border border2 border-neutral">
                <div v-for="(cell, colIndex) in col" :key="colIndex" class="cell grow border border2 border-warning h-full w-full flex items-center justify-center relative">
                    <div :class="discColor(cell)" :style="{'--row': colIndex}">
                    </div>
                </div>
            </div>
        </div>
        
      </div>
    </div>
  </template>
  &
<script setup lang="ts">
    import { ref, Ref } from 'vue';

    const grid: Ref<string[][]> = ref([
        ["E", "E", "Y", "E", "fe", "E", "E"],
        ["E", "E", "E", "E", "E", "Y", "E"],
        ["E", "E", "E", "E", "E", "E", "E"],
        ["E", "E", "E", "E", "E", "E", "E"],
        ["E", "E", "E", "E", "E", "E", "E"],
        ["E", "E", "E", "E", "E", "Y", "E"]
    ]);

    const columns: Ref<number> = ref(grid.value[0].length);
    const rows: Ref<number> = ref(grid.value.length);
    // const row: Ref<number> = ref();

    function discColor(color: string) {
        if(color == 'E') {
            return `disc`;
        }
        return `disc disc-${color == "Y" ? "yellow" : "red"}`;
    }

</script>
  
<style scoped>
.c-grid, .c-cells {
    border: 15px solid #2a5782;
}

.c-cells .disc {
    width: 80% !important;
    height: 80% !important;

    animation: Drop 2s infinite;
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

.cell{
    content: "ddd";
}

.disc-yellow{
    background-color: #f6db38;
    box-shadow: inset 0 0 0 3px #97851d;
    border: solid 3px #f6db38;
    outline: solid 1px #97851d;
    position: absolute;
    width: 20px;
    height: 20px;
    border-radius: 100%;
}

.disc-red{
    background-color: #f63838;
    box-shadow: inset 0 0 0 3px #971d1d;
    border: solid 3px #f63838;
    outline: solid 1px #971d1d;
    position: absolute;
    width: 20px;
    height: 20px;
    border-radius: 100%;
}



.selector .disc {
    margin: 10px;
    transform: scale(2);
}

@keyframes Drop {
    from {
        transform: translateY(calc(-125% * var('--row')));
    }
}

</style>
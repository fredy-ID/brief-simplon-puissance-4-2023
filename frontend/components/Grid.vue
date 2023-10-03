<template>
    <div>
      <div class="relative board h-96 w-96 my-20">
        <div class="absolute c-grid flex h-full w-full"></div>
        <div class="h-full w-full flex flex-col c-cells">
            <div v-for="(col, rowIndex) in grid" :key="rowIndex" class="flex flew-row grow">
                <div v-for="(cell, colIndex) in col" :key="colIndex" class="cell grow h-full w-full flex items-center justify-center relative">
                    <div :class="discColor(cell)" :style="{'--row': rowIndex}">
                    </div>
                </div>
            </div>
        </div>
        <div v-if="color && color!='E'" class="columns absolute flex items-end">
            <button class="flex justify-center column w-full m-0 p-0" v-for="(col, index) in gridDolumns" :key="index" @click="onDrop(index)">
                <div :class="discColor(color)">
                </div>
            </button>
        </div>
      </div>
    </div>
  </template>
  &
<script setup lang="ts">
    import { ref, Ref } from 'vue';

    const props = defineProps({
        color: {
            type: String,
            required: false,
        },
    });


    const grid: Ref<string[][]> = ref([
        ["E", "E", "Y", "E", "fe", "E", "E"],
        ["E", "E", "E", "E", "E", "Y", "E"],
        ["E", "E", "E", "E", "E", "E", "E"],
        ["E", "E", "E", "E", "E", "E", "E"],
        ["E", "E", "E", "E", "E", "E", "E"],
        ["E", "E", "E", "E", "E", "Y", "E"]
    ]);

    const grid2: Ref<string[][]> = ref([
        ["E", "E", "Y"],
        ["E", "Y", "E"],
        ["E", "E", "E"]
    ]);

    const gridDolumns: Ref<number[]> = ref(new Array(grid.value[0].length).fill(1));
    const columns: Ref<number> = ref(grid.value[0].length);
    const rows: Ref<number> = ref(grid.value.length);

    function onDrop(colIndex: number) {
        console.log(colIndex)
    }
    function discColor(color: string) {
        if(color == 'E') {
            return `disc`;
        }
        return `disc disc-${color == "Y" ? "yellow" : "red"}`;
    }

</script>
  
<style scoped>
* {
    box-sizing: border-box;
}

.c-grid, .c-cells {
    border: 15px solid #2a5782;
}

.c-cells .disc {
    width: 74% !important;
    height: 74% !important;
    animation: Drop calc(.20s * var(--row)) both;
  }
.c-grid {
    display: grid;
    grid-template-columns: repeat(v-bind('columns'), 1fr);
    grid-template-rows: repeat(v-bind('rows'), 1fr);
    aspect-ratio: v-bind('columns') / v-bind('rows');
    align-content: center;
    justify-content: center;
    place-items: center;
    place-content: center;
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

.disc {
    width: 20px;
    height: 20px;
    border-radius: 100%;
    z-index: -2;
}

.disc-yellow{
    background-color: #f6db38;
    box-shadow: inset 0 0 0 3px #97851d;
    border: solid 3px #f6db38;
    outline: solid 1px #97851d;
    position: absolute;
}

.disc-red{
    background-color: #f63838;
    box-shadow: inset 0 0 0 3px #971d1d;
    border: solid 3px #f63838;
    outline: solid 1px #971d1d;
    position: absolute;
    
}

.selector .disc {
    margin: 10px;
    transform: scale(2);
}

@keyframes Drop {
    from {
        transform: translateY(calc(-125% * var(--row)));
    }
}

.columns {
    inset: 0;
    border: 15px solid #00000000;
}

.columns .disc {
    width: 40px !important;
    aspect-ratio: 1 / 1;
    height: auto !important;
    animation: Drop calc(.20s * var(--row)) both;
    opacity: 0;
    transition: .3s;
    transform: translateY(-20px);
}

.column {
    height: calc(100% + 100% / v-bind('rows'));
}

.column:hover .disc{
    opacity: 1;
    transform: translateY(6px);
}

</style>
<template>
    <div class="hero bg-base-200">
        <div class="hero-content text-center">
            <div class="relative board h-96 w-96 my-20">
                <div class="absolute c-grid flex h-full w-full"></div>
                <div class="h-full w-full flex flex-col c-cells">
                    <div v-for="(row, rowIndex) in grid" :key="rowIndex" class="flex flew-row grow">
                        <div v-for="(cell, colIndex) in row" :key="colIndex" class="cell grow h-full w-full flex items-center justify-center relative" :data-row="rowIndex" :data-col="colIndex">
                            <div :class="discColor(cell)" :style="{'--row': rowIndex}">
                                <!-- {{ cell }} -->
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="colorProps && colorProps != 'P'" class="columns absolute flex items-end">
                    <button class="flex justify-center column w-full m-0 p-0" v-for="(col, index) in gridDolumns" :key="index" @click="onDrop(index, colorProps)">
                        <div :class="discColor(colorProps)"></div>
                    </button>
                </div>
            </div>
        </div>
    </div>
  </template>

<script setup lang="ts">
    import { ref, Ref, watch } from 'vue';
    
    const props = defineProps({
        color: {
            type: String,
            required: false,
        },
        grid: {
            type: Array as () => string[][],
            required: true,
        },
    });

    // watch works directly on a ref
    

    const colorProps: Ref<string | undefined> = ref(props.color);

    watch(() => ({ color: props.color }), (newColor, oldColor) => {
        colorProps.value = newColor.color;
    })

    const gridDolumns: Ref<number[]> = ref(new Array(props.grid[0].length).fill(1));
    const columns: Ref<number> = ref(props.grid[0].length);
    const rows: Ref<number> = ref(props.grid.length);

    const emit = defineEmits(['drop-event'])
    const colors: Ref<string[]> = ref(['yellow', 'red'])

    function dropEvent(color: string, rowIndex: number, colIndex: number) {
        emit('drop-event', { color: color, row: rowIndex, col: colIndex})
    }


    function onDrop(colIndex: number, color: string) {
        colorProps.value = undefined;
        const column = props.grid.map(row => row[colIndex]);
        const rowIndex = column.lastIndexOf('E');
        if (rowIndex !== -1) {
            dropEvent(color, rowIndex, colIndex);
        }
        colorProps.value = props.color;
    }
    
    function discColor(color: string) {
        if(color == 'E') {
            return `disc`;
        } else if (color == 'P') {
            return `disc disc-purple`;
        }
        else {
            return `disc disc-${color == "Y" ? "yellow" : "red"}`;
        }
    }

</script>

<style scoped>
* {
    box-sizing: border-box;
    transition: all 0.5s;
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

.disc-purple{
    background-color: #91008f;
    box-shadow: inset 0 0 0 3px #5e005d;
    border: solid 3px #91008f;
    outline: solid 1px #5e005d;
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

@keyframes Rise {
    from {
        transform: translateY(100%);
    }
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
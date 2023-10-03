<template>
    <div>
        <h3 v-if="color && name" class="text-3xl flex items-center gap-3">Au tour de {{ name }} <div :class="discColor(color)"></div> de jouer</h3>
    </div>
</template>

<script setup lang="ts">

    const props = defineProps({
        color: {
            type: String,
            required: false,
        },
        name: {
            type: String,
            required: false,
        }
    });

    function discColor(color: string) {
        if(color == 'E') {
            return `disc`;
        }
        return `disc disc-${color == "Y" ? "yellow" : "red"}`;
    }
</script>

<style scoped>
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
</style>
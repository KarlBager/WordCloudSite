<script setup>

const props = defineProps({
    icon: String,
    type: String
});

</script>

<template>
    <div class="button" :class="{ 'btn-ghost': props.type == 'ghost' }">
        <Icon v-if="props.icon" :icon="props.icon"></Icon>
        <slot></slot>
    </div>
</template>

<style>
    .button{
        height: 2.75rem;
        display: inline-flex;
        gap: 0.6rem;
        justify-content: center;
        align-items: center;
        padding-left: 0.75rem;
        padding-right: 0.75rem;
        background-color: #4D4D4D;
        border-radius: 25px;
        color: #BCBCBC;
        cursor: pointer;
        line-height: 0;
    }

    .button:hover{
        background-color: #474747;
    }

    .btn-ghost{
        background: none;
    }
</style>
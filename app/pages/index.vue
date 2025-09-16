<script setup>
import { useLoadData } from '../../composables/useLoadData.js';
const { dataRef, pending, error, loadData, initLoad } = useLoadData();

initLoad();
//loadData();

</script>

<template>
    <div>
        <SubjectCloud></SubjectCloud>
        <PostField></PostField>
    </div>
</template>


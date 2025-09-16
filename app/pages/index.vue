<script setup>
import { useLoadData } from '../../composables/useLoadData.js';
const { dataRef, pending, error, loadData, initLoad } = useLoadData();

import { useCurrentFeed } from '../../composables/useCurrentFeed.js';
const { currentSubjectId, openSubjectFeed, closeFeed } = useCurrentFeed();

initLoad();
//loadData();

</script>

<template>
    <div style="z-index: -2">
        <!-- <SubjectCloud></SubjectCloud> -->
        <SubjectCloudD3 @pick="(s) => openSubjectFeed(s['subject-id'])" />
        <PostField></PostField>
    </div>
    <Transition>
        <SubjectFeed v-if="currentSubjectId" :currentSubjectId="currentSubjectId" @close-feed="closeFeed()"></SubjectFeed>
    </Transition>
</template>



<style>

.v-enter-active,
.v-leave-active {
  transition: opacity 0.25s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

</style>
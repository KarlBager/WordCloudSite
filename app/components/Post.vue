<script setup>
const props = defineProps({
    postData: Object,
    subjectName: String,
});

import { useCurrentFeed } from '../../composables/useCurrentFeed.js';
const { highlightedPost } = useCurrentFeed();

</script>

<template>

    <!-- <h1>{{ props.postData }}</h1> -->

    <div class="post-container" :class="{'highlighted-post': props.postData['post-id'] == highlightedPost}" :id="'post-' + props.postData['post-id']">
        <div class="post-top-container">
            <div class="post-profile-picture"></div>
            <p>{{ props.subjectName + " • 2 t. • @Brugernavn" }}</p>
        </div>

        <div class="post-headline-container">
            <p class="post-headline">{{ props.postData.headline }}</p>
        </div>

        <div class="post-text-container">
            <p class="post-text">{{ props.postData.text }}</p>
        </div>

        <div class="post-button-row">
            <Btn icon="comments">{{ Math.floor(Math.random()*26) }}</Btn>
            <Btn icon="bookmark"></Btn>
            <Btn icon="share">Del</Btn>
        </div>

    </div>

</template>

<style>

.highlighted-post{
    border: 3px solid;
}

.post-container {
    width: 100%;
    background-color: #373737;
    border-radius: 25px;
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
    box-sizing: border-box;
}

.post-profile-picture {
    height: 2rem;
    width: 2rem;
    background-color: red;
    border-radius: 100%;
}

.post-top-container {
    display: flex;
    align-items: center;
    gap: 0.625rem;
}

.post-headline {
    font-size: 1.25rem;
    font-weight: 600;
}

.post-text {
    font-size: 0.875rem;
}

.post-button-row{
    display: flex;
    gap: 0.625rem;
}
</style>
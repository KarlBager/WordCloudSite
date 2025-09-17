<script setup>
const props = defineProps({
    postData: Object,
    subjectName: String,
});

import { useCurrentFeed } from '../../composables/useCurrentFeed.js';
const { highlightedPost } = useCurrentFeed();

import { useLoadData } from '../../composables/useLoadData.js';
const { dataRef, loadData } = useLoadData();

const user = computed(() =>
  dataRef.value.users.find(u => u['user-id'] === props.postData['user-id'])
)

function formatTimestamp(ts) {
  const date = new Date(ts)
  const now = new Date()
  const diffMs = now - date
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffH   = Math.floor(diffMin / 60)
  const diffD   = Math.floor(diffH / 24)

  if (diffD >= 1) {
    return diffD === 1 ? "1 d." : `${diffD} d.`
  }
  if (diffH >= 1) {
    return diffH === 1 ? "1 t." : `${diffH} t.`
  }
  if (diffMin >= 1) {
    return diffMin === 1 ? "1 m." : `${diffMin} m.`
  }
  return diffSec <= 5 ? "lige nu" : `${diffSec} s.`
}

const pastelColors = [
  "#A3C4F3", // blå
  "#B9FBC0", // grøn
  "#FFCFD2", // lyserød
  "#FFE3A3", // gul
  "#D4C2FC", // lilla
  "#C2F0FC", // lyseblå
  "#FFD6E0", // sart pink
]

function pastelForUser(userId) {
  const idx = userId % pastelColors.length
  return pastelColors[idx]
}


const explainWord = ref(false);

</script>

<template>

    <!-- <h1>{{ props.postData }}</h1> -->

    <div class="post-container" :class="{'highlighted-post': props.postData['post-id'] == highlightedPost}" :id="'post-' + props.postData['post-id']">
        <div class="post-top-container">
            <div class="post-profile-picture" :style="{ backgroundColor: pastelForUser(props.postData['user-id']) }"></div>
            <p>{{ props.subjectName }}<span style="color: var(--grå-skrift-2)"> • {{ formatTimestamp(props.postData.timestamp) }} • {{ user?.username }}</span></p>
        </div>

        <div class="post-headline-container">
            <p class="post-headline">{{ props.postData.headline }}</p>
        </div>

        <div class="post-text-container">
          <p @mouseenter="explainWord = true" @mouseleave="explainWord = false" v-if="props.postData['post-id'] == 126" class="post-text">Det er vitterligt kun pga. den <span style="text-decoration: underline; color: lightcoral">negative parlamentarisme</span>, at Regeringen kan blive siddende</p>
          <p v-else class="post-text">{{ props.postData.text }}</p>
        </div>

        <div class="post-button-row">
            <Btn icon="comments">{{ Math.floor(Math.random()*26) }}</Btn>
            <Btn icon="bookmark"></Btn>
            <Btn icon="share">Del</Btn>
        </div>

        <Transition name="fade">
        <div class="post-container word-explanation-container" v-if="explainWord">
            <p><b>Negativ parlamentarisme</b> er et princip i et parlamentarisk demokrati, hvor en regering kan fortsætte, så længe den ikke har et flertal af parlamentet imod sig</p>
        </div>
        </Transition>

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


.word-explanation-container{
  position: absolute;
  width: 30rem;
  bottom: 1rem;
  right: 1rem;
  z-index: 2;
}

.word-explanation-container p{
  font-size: 14px;
}
</style>
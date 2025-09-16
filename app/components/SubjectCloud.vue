<script setup>
import { useLoadData } from '../../composables/useLoadData.js';
import { useCurrentFeed } from '../../composables/useCurrentFeed.js';

const { currentSubjectId, openSubjectFeed, closeFeed } = useCurrentFeed();
const { dataRef, loadData } = useLoadData();

import { gsap } from "gsap"



onMounted(() => {
  window.addEventListener('mousemove', (event) => {

    //Convert mouse position to normalized device coordinates (-1 to +1)
    const mouse = {};
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    shiftGuiWithMouse(mouse);

  });

  function shiftGuiWithMouse(mouse) {
    const strength = 4
    const guiEl = document.querySelector('.cloud-container')

    const xTranslation = mouse.x * strength
    const yTranslation = -mouse.y * strength

    gsap.to(guiEl, {
      x: xTranslation,
      y: yTranslation,
      duration: 0.5,      // hvor "forsinket" bevægelsen skal føles
      ease: "power2.out"  // gør det smooth
    })
  }
});

const totalPoints = ref(0)

// Når dataRef ændrer sig, lav loopet
const minPoints = computed(() => {
  const subjects = dataRef.value?.subjects ?? []
  if (subjects.length === 0) return null
  return Math.min(...subjects.map(s => Number(s.points) || 0))
})

const maxPoints = computed(() => {
  const subjects = dataRef.value?.subjects ?? []
  if (subjects.length === 0) return null
  return Math.max(...subjects.map(s => Number(s.points) || 0))
})

//MIN og MAX fontstørreler i rem
const minFontSize = 1.125;
// const maxFontSize = 8;
const maxFontSize = 5;

const fontSizeSpread = maxFontSize - minFontSize;

const pointSpread = computed(() => {
  if (minPoints.value == null || maxPoints.value == null) return 0
  return maxPoints.value - minPoints.value
})



// stabil “random” rotation pr. item (så det ikke flikker på re-render)
function hashInt(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24) }
  return h >>> 0
}

function isRotated(subject) {
  const tooBig = subject.points > (maxPoints.value * 0.5) // fx over 50% af max
  if (tooBig) return false

  const h = hashInt(String(subject['subject-id'] ?? subject['display-name']))
  return (h % 10) < 3  // stadig ~30% chance
}


const wordColorArray = ["--grå-skrift-3", "--grå-skrift-2", "--grå-skrift-1", "--hvid-skrift-3", "--hvid-skrift-2", "--hvid-skrift-1"];


</script>


<template>
  <div class="cloud-container">
    <h1 class="cloud-words" v-for="subject in (dataRef?.subjects || [])" :style="{fontSize: `${minFontSize + ((subject.points - minPoints) / pointSpread) * fontSizeSpread}rem`, color: `var(${wordColorArray[Math.floor((pointSpread === 0 ? 0.5 : (subject.points - minPoints) / pointSpread) * (wordColorArray.length - 1))]})`}" @click="openSubjectFeed(subject['subject-id'])">
      {{ subject['display-name'] }}
    </h1>
  </div>
  <SubjectFeed v-if="currentSubjectId" :currentSubjectId="currentSubjectId" @close-feed="closeFeed()"></SubjectFeed>
</template>

<style>
.cloud-words {
  text-transform: uppercase;
  line-height: 1;
  margin: 0;
}

.cloud-words.vert {
  writing-mode: vertical-lr;   /* eller vertical-lr */
}

.cloud-words:hover {
  color: #bbbbbb;
  cursor: pointer;
  transition: 0.5s ease;
  scale: 1.03;
}

.cloud-container {
  align-content: center;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  box-sizing: border-box;
  z-index: -2;
  gap: 0.3rem;
}

</style>
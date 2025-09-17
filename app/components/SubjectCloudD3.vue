<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useLoadData } from '../../composables/useLoadData.js'
import { useCurrentFeed } from '../../composables/useCurrentFeed.js';

const { currentSubjectId, openSubjectFeed, closeFeed } = useCurrentFeed();

import { gsap } from 'gsap'
let mounted = false;

// data ind
const { dataRef, loadData } = useLoadData()

// klik-API ud (valgfrit)
const emit = defineEmits(['pick'])

onMounted(() => {
  mounted = true;
  loadData()

  window.addEventListener('mousemove', (event) => {

    //Convert mouse position to normalized device coordinates (-1 to +1)
    const mouse = {};
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    shiftGuiWithMouse(mouse);

  });

  function shiftGuiWithMouse(mouse) {
    const strength = 4
    const guiEl = document.querySelector('.cloud-wrap')

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

// container + svg dims
const wrapEl = ref(null)
const width = ref(800)
const height = ref(500)

const prevById = new Map()
let firstLayoutDone = false

let ro = null

let resizeTimeout
function setupResizeObserver() {
  ro = new ResizeObserver(() => {
    clearTimeout(resizeTimeout)
    resizeTimeout = setTimeout(() => {
      if (!wrapEl.value) return
      width.value = wrapEl.value.clientWidth || 800
      height.value = wrapEl.value.clientHeight || 500
      scheduleLayout()
    }, 200) // først 200 ms efter brugeren stopper
  })
  ro.observe(wrapEl.value)
}

onMounted(setupResizeObserver)
onBeforeUnmount(() => ro?.disconnect())

// subjects, min/max, farver
const subjects = computed(() => dataRef.value?.subjects ?? [])
const minPoints = computed(() => subjects.value.length ? Math.min(...subjects.value.map(s => +s.points || 0)) : 0)
const maxPoints = computed(() => subjects.value.length ? Math.max(...subjects.value.map(s => +s.points || 0)) : 0)
const spread = computed(() => Math.max(1, maxPoints.value - minPoints.value))

const minFontRem = 1.125
const maxFontRem = 5
const remToPx = 16
const minFontPx = minFontRem * remToPx
const maxFontPx = maxFontRem * remToPx

function sizePx(points) {
  const n = (Number(points || 0) - minPoints.value) / spread.value
  return Math.round(minFontPx + n * (maxFontPx - minFontPx))
}

function shouldRotate(s) {
  const isBig = Number(s.points || 0) >= (minPoints.value + 0.5 * spread.value)
  if (isBig) return 0
  let h = 2166136261
  const key = String(s['subject-id'] ?? s['display-name'])
  for (let i = 0; i < key.length; i++) { h ^= key.charCodeAt(i); h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24) }
  return (h % 10) < 3 ? -90 : 0
}

const wordColorArray = [
  "--grå-skrift-3",
  "--grå-skrift-2",
  "--grå-skrift-1",
  "--hvid-skrift-3",
  "--hvid-skrift-2",
  "--hvid-skrift-1"
]
function colorFor(points) {
  const n = spread.value === 0
    ? 0.5
    : (Number(points || 0) - minPoints.value) / spread.value

  const idx = Math.floor(n * (wordColorArray.length - 1))
  const varName = wordColorArray[Math.max(0, Math.min(wordColorArray.length - 1, idx))]

  return `var(${varName})`
}

const layoutWords = ref([])

let layoutRunning = false
let rerunRequested = false
let cloud = null // <-- vi loader d3-cloud herinde

const fontFamily = "Roboto, sans-serif";


async function runLayout() {
  if (!mounted) return
  if (layoutRunning) { rerunRequested = true; return }
  layoutRunning = true
  rerunRequested = false

  if (!cloud) {
    // lazy-import kun på client
    const mod = await import('d3-cloud')
    cloud = mod.default || mod
  }

  const w = Math.max(100, width.value)
  const h = Math.max(100, height.value)

  const words = subjects.value.map(s => ({
    text: String(s['display-name']).toUpperCase(),  // 👈 uppercase her
    size: sizePx(s.points),
    rotate: shouldRotate(s),
    datum: s
  }))

  cloud()
    .size([w, h])
    .words(words)
    .padding(4)
    .rotate(d => d.rotate)
    .font('inherit')
    .font(fontFamily)
    .fontSize(d => d.size)
    .on('end', placed => {
      // 1. find bounding box
      const minX = Math.min(...placed.map(w => w.x))
      const maxX = Math.max(...placed.map(w => w.x))
      const minY = Math.min(...placed.map(w => w.y))
      const maxY = Math.max(...placed.map(w => w.y))

      // 2. regn offset til center
      const offsetX = (minX + maxX) / 2
      const offsetY = (minY + maxY) / 2

      // 3. flyt ordene så center = (0,0)
      placed.forEach(w => {
        w.x -= offsetX
        w.y -= offsetY
      })

      // 4. sæt dem i din reactive ref
      layoutWords.value = placed

      layoutRunning = false
      if (rerunRequested) runLayout()
    })
    .start()
}

const scheduleLayout = async () => { await nextTick(); runLayout() }

watch([subjects, width, height], scheduleLayout, { immediate: false })

watch(layoutWords, async (newWords) => {
  if (!mounted) return
  await nextTick()

  newWords.forEach(w => {
    const id = String(w.datum['subject-id'] ?? w.text)
    const el = document.querySelector(`text[data-id="${id}"]`)
    if (!el) return

    const prev = prevById.get(id)

    // Første gang vi ser ordet eller første layout nogensinde:
    if (!firstLayoutDone || !prev) {
      // sæt det direkte på plads (ingen spring fra midten)
      gsap.set(el, {
        attr: { transform: `translate(${w.x}, ${w.y}) rotate(${w.rotate})` },
        fontSize: w.size,
        opacity: 0
      })
      gsap.to(el, { opacity: 1, duration: 0.4, ease: 'power2.out' })
    } else {
      // start fra tidligere state og tween til ny
      gsap.set(el, {
        attr: { transform: `translate(${prev.x}, ${prev.y}) rotate(${prev.rotate})` },
        fontSize: prev.size
      })
      gsap.to(el, {
        duration: 0.6,
        ease: 'power2.out',
        attr: { transform: `translate(${w.x}, ${w.y}) rotate(${w.rotate})` },
        fontSize: w.size
      })
    }

    // opdatér prev for næste runde
    prevById.set(id, { x: w.x, y: w.y, rotate: w.rotate, size: w.size })
  })

  firstLayoutDone = true
}, { deep: true })


</script>


<template>
  <div ref="wrapEl" class="cloud-wrap">
    <!-- vi renderer som SVG, centreret i containeren -->
    <svg :width="width" :height="height" class="cloud-svg">
      <g :transform="`translate(${width / 2}, ${height / 2})`">
        <text v-for="w in layoutWords" :data-key="w.text" :key="w.datum['subject-id']" :data-id="w.datum['subject-id']"
          class="cloud-words" :font-size="w.size" :fill="colorFor(w.datum.points)" text-anchor="middle"
          :style="{ 'font-family': fontFamily, 'font-weight': 600 }" style="cursor:pointer; user-select:none;"
          @click="openSubjectFeed(w.datum['subject-id']); animateWordUp(w.datum['subject-id']);">
          {{ w.text }}
        </text>
      </g>
    </svg>
  </div>
</template>

<style scoped>
.cloud-wrap {
  position: absolute;
  width: 100vw;
  height: 70vh;
}

.cloud-words:hover {
  color: #bbbbbb;
  cursor: pointer;
  transition: 0.5s ease;
  scale: 1.03;
}

.cloud-svg {
  display: block;
  width: 100%;
  height: 100%;
}
</style>

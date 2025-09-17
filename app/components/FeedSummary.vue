<script setup>

const fullText = `Da Israel blev oprettet i 1948, mistede mange palæstinensere deres hjem, og lige siden har der været uenighed. Israel mener, at området er deres historiske hjemland, mens palæstinenserne kæmper for at få deres egen stat med hovedstad i Østjerusalem. Der er stadig kæmpe uenighed om grænser, bosættelser og hvem der har ret til at vende tilbage, og derfor bliver konflikten ved med at skabe krig og uretfærdighed for begge parter.`

const displayedText = ref("")
const typingSpeed = 15 // ms per character

onMounted(() => {
  let i = 0
  const interval = setInterval(() => {
    displayedText.value += fullText[i]
    i++
    if (i >= fullText.length) {
      clearInterval(interval)
    }
  }, typingSpeed)
})

</script>

<template>
    <div class="post-container summary-container">
        <div class="post-top-container">
            <h2 style="margin: 0; font-size: 32px;">Opsummering</h2>
        </div>

        <div class="post-headline-container">
            <p class="post-headline">Konflikten om Palæstina handler om, hvem der har ret til at bo og styre i området, hvor Israel, Gaza og Vestbredden ligger i dag.</p>
        </div>

        <div class="post-text-container">
            <p class="post-text">{{ displayedText }}</p>
      <!-- valgfri "blinking cursor" -->
      <span v-if="displayedText.length < fullText.length" class="cursor"></span>
        </div>

        <div class="post-button-row">

            <p>Læs mere
                <svg width="5" height="9" viewBox="0 0 5 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.625 8.25L4.375 4.5L0.625 0.75" stroke="white" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </p>

            <!-- <Btn icon="comments">{{ Math.floor(Math.random()*26) }}</Btn>
            <Btn icon="bookmark"></Btn>
            <Btn icon="share">Del</Btn> -->
        </div>
    </div>
</template>

<style>
.summary-container{
    margin-bottom: 2rem;
}
</style>
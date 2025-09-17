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


const petitionSubmitted = ref(false);

function submitPetition(){
    petitionSubmitted.value = true;
}

</script>

<template>
    <div class="post-container summary-container">
        <div class="post-top-container">
            <h2 style="margin: 0; font-size: 32px;">Afstemning</h2>
        </div>

        <div class="post-headline-container">
            <p class="post-headline">Synes du, at elever skal have lov til at diskutere Palæstina/Israel-konflikten i forbindelse med skolevalg?</p>
        </div>

        <div class="post-button-row">
  
            <p>Svarmuligheder:
            </p>
  
            <!-- <Btn icon="comments">{{ Math.floor(Math.random()*26) }}</Btn>
            <Btn icon="bookmark"></Btn>
            <Btn icon="share">Del</Btn> -->
        </div>

        <div class="petiton-option-container">
            <div v-if="!petitionSubmitted">
                <Btn style="color: white;" @click="submitPetition()">Ja, det skal de have lov til</Btn>
            </div>
            <div v-if="!petitionSubmitted">
                <Btn style="color: white;" @click="submitPetition()">Nej, det skal de ikke have lov til</Btn>
            </div>

            <div v-else class="percentage-bar">
                <div class="yes" style="width: 60%">Ja | 60%</div>
                <div class="no" style="width: 40%">Nej | 40%</div>
            </div>
        </div>

    </div>
</template>

<style>
.summary-container{
    margin-bottom: 2rem;
}

.petiton-option-container{
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.percentage-bar {
  display: flex;
  width: 100%;
  height: 30px;
  border-radius: 6px;
  overflow: hidden;
  font-size: 14px;
  color: white;
  text-align: center;
}

.percentage-bar .yes {
  background-color: #3b82f6; /* blå */
  display: flex;
  align-items: center;
  justify-content: center;
}

.percentage-bar .no {
  background-color: #ef4444; /* rød */
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
<script setup>
import { createCompletionsChat } from '../gpt.js';

import { useLoadData } from '../../composables/useLoadData.js';
const { dataRef, loadData } = useLoadData();

import { useCurrentFeed } from '../../composables/useCurrentFeed.js';
const { currentSubjectId, openSubjectFeed, closeFeed, highlightPost } = useCurrentFeed();

const emit = defineEmits(['goToPost'])


// Byg listen reaktivt, når dataRef.subjects ændrer sig
const subjectNames = computed(() => {
    const subjects = dataRef.value?.subjects ?? []
    return subjects.map(s => `[${s['subject-id']}]: ${s['display-name']}`)
})


const newPost = ref('')

//FÅ GPT TIL AT TAGE STILLING TIL EMNE – OM DER MÅSKE SKAL LAVES NYT?
const systemPrompt = computed(() => `
  Du er hjernen i et socialt medie i stil med reddit.
  Brugeren har skrevet dette indlæg.
  Din rolle er at gruppere dette indlæg i et af disse emner.
  Hvis indlægget er bedre egnet i et helt nyt emne, er det også i din magt at oprette det nye emne.
  Derfor skal du besvare med et af følgende tal i følgende format: "x", hvis du vil vælge et af de eksisterende emner.

  ${subjectNames.value.join('\n')}

  Hvis du derimod gerne vil oprette et nyt emne skal du blot svare navnet på det nye emne.

  Find også på en passende titel til postet. Dit svar skal formateres således:
  '[Emne/Nummer på eksisterende emne], [Titel]'
  Mange tak!
`)

//TESTRUN
//const res = await createCompletionsChat("Jeg hører stemmer og der er års ventetid på psykolog", systemPrompt);

function goToPost(post){
    emit('goToPost', post);
    openSubjectFeed(post.row['subject-id']);
    highlightPost(post.id);
    setTimeout(()=>{
            const el = document.getElementById(`post-${post.id}`)
            if (el) {
                el.scrollIntoView({ behavior: 'smooth' }) // smooth = glidende scroll
            }
        }, 1000
    )
}


async function insertData(resource = 'posts', data){
    // eksempel: opret et indlæg
    return await $fetch('/api/insert', {
    method: 'POST',
    body: {
        resource: resource,
        data: data,
        returnRow: true
    }
    })
}


async function promptPost(post){
    //const raw = '[3], ["Test titel fra GPT"]';

    // 1) Få svar fra GPT (to felter: emne + titel)
    const raw = await createCompletionsChat(post, systemPrompt.value)
    const res = raw.value;

    // 2) Parse svaret robust (tillad små afvigelser)
    let subjectAnswer = '';
    let title = '';

    // Forventet format: "['Emne'], ['Titel']"
    const m = res.match(/^\s*\[\s*['"]?(.*?)['"]?\s*\]\s*,\s*\[\s*['"]?(.*?)['"]?\s*\]\s*$/)
    if (m) {
        subjectAnswer = m[1]
        title = m[2]
    } else {
        // Fallback: split på komma og strip []/'"
        const parts = res
        .replace(/^"|"$/g, '')
        .split(',')
        .map(s => s.trim().replace(/^[\['"]|[\]']$/g, ''))
        subjectAnswer = parts[0] || res
        title = parts[1] || ''
    }

    console.log(subjectAnswer, title);

    const num = Number(subjectAnswer)

    if(!Number.isInteger(num)){
        const newSubject = await insertData('subjects', { 'display-name': subjectAnswer, 'points': 8 });
        const newPost = await insertData('posts', { 'subject-id': newSubject.id, 'user-id': 1, 'text': post, 'headline': title, 'points': 8 });
        //console.log(newSubject, newPost);
        loadData();
        goToPost(newPost);
    }

    if(Number.isInteger(num)){
        const subjectId = subjectAnswer;
        const newPost = await insertData('posts', { 'subject-id': subjectId, 'user-id': 1, 'text': post, 'headline': title, 'points': 8 });
        //console.log(subjectId, newPost);
        loadData();
        goToPost(newPost);
    }

    newPost.value = '';
}

</script>

<template>
    <div class="post-field">
        <div>
            <Icon icon="comments"></Icon>
            <input name="post" placeholder="Hvad har du på hjerte?" v-model="newPost" @keyup.enter="promptPost(newPost)"></input>
        </div>
        <div>
            <Icon icon="mic"></Icon>
            <Icon icon="close"></Icon>
        </div>
    </div>
    <!-- <input class="post-field-button" @click="promptPost(newPost)" type="submit"></input> -->
</template>


<style>

.post-field{
    width: 37.5rem;
    height: 3.125rem;
    background-color: #373737;
    border-radius: 38px;
    border-style: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    box-sizing: border-box;
    position: fixed;
    bottom: 5rem;
    left: 6.25rem;
    z-index: -2;
}

.post-field div{
    display: flex;
    gap: 1rem;
}

.post-field div input{
    width: 28rem;
    background: none;
    border: none;
    color: white;
}

.post-field div input:focus{
    border: none;
}

input{
    font-size: 1rem;
}

</style>
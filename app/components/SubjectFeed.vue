<script setup>
import { computed } from 'vue'

import { useLoadData } from '../../composables/useLoadData.js';
const { dataRef, loadData } = useLoadData();

const props = defineProps({
  data: Object,
  currentSubjectId: Number
})

// Posts som matcher subject
const subjectPosts = computed(() =>
  dataRef.value.posts.filter(
    (p) => p['subject-id'] === props.currentSubjectId
  )
)

// subject som matcher subject
const subject = computed(() =>
  dataRef.value.subjects.filter(
    (p) => p['subject-id'] === props.currentSubjectId
  )
)

// Comments som matcher de posts
const subjectComments = computed(() =>
  dataRef.value.comments.filter((c) =>
    subjectPosts.value.some((p) => p['post-id'] === c['post-id'])
  )
)


onMounted(() => {
  //console.log(dataRef);
})

const emit = defineEmits(['closeFeed']);
</script>

<template>
  <div class="feed-section">
    <div class="feed-container container">
      <div class="feed-header-container">

        <div>
          <Btn icon="back" type="ghost" @click="emit('closeFeed')">Tilbage</Btn>
        </div>

        <div>
          <h1>{{ subject[0]['display-name'] }}</h1>
        </div>

        <div></div>
      </div>

      <div>
        <div class="feed-body-container">
          <div class="feed-sidebar-container">
            <Btn icon="home-you" type="ghost">For you</Btn>
            <Btn icon="petitions" type="ghost">Afstemninger</Btn>
            <Btn icon="explore" type="ghost">Udforsk</Btn>
            <Btn icon="bookmark" type="ghost">Gemt</Btn>
          </div>
            <div class="feed-posts-container">
              <FeedPetition v-if="subject[0]['subject-id'] == 33"></FeedPetition>
              <FeedSummary v-if="subject[0]['subject-id'] == 33"></FeedSummary>

              <Post v-for="post in subjectPosts" :key="post" :postData="post"
                :subjectName="subject[0]['display-name']"></Post>
            </div>
          <div></div>
        </div>
      </div>
    </div>

    <div class="top-gui">
      <div class="top-gui-button-container">
        <Btn color="var(--box)" icon="comments"></Btn>
      </div>
      <div class="post-placeholder"></div>
      <div class="top-gui-notice-container">
        <p>Grimt sprog, diskrimination eller anden krænkende adfærd fjernes af vores moderatorer.</p>
      </div>
    </div>
  </div>


 

</template>

<style>

.post-placeholder{
  width: 41.5rem;
}

.top-gui{
  position: fixed;
  bottom: 5rem;
  left:0;
  width: 100vw;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  justify-content: space-between;
  box-sizing: border-box;
  padding-left: 6.25rem;
  padding-right: 6.25rem;
  pointer-events: none;
}

.top-gui-button-container{
  pointer-events: auto;
}

.top-gui-notice-container p{
  color: var(--grå-skrift-2);
}
.top-gui-notice-container{
  padding-left: 6.25rem;
}

.feed-section {
  background-color: #212121;
  height: 100%;
  min-height: 100vh;
  position: relative;
}

.feed-posts-container {
  width: 41.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.feed-body-container{
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}

.feed-header-container{
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  padding-top: 2.875rem;
  padding-bottom: 2.875rem;
}

.feed-header-container h1{
  text-align: center;
  text-transform: uppercase;
  font-size: 6rem;
  line-height: 1;
  margin: 0;
}

.feed-sidebar-container{
  display: flex;
  flex-direction: column;
  align-items: baseline;
}
</style>

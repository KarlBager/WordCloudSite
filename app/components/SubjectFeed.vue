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
              <Post v-for="post in subjectPosts" :key="post" :postData="post"
                :subjectName="subject[0]['display-name']"></Post>
            </div>
          <div></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.feed-section {
  background-color: #212121;
  height: 100%;
  min-height: 100vh;
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

const currentSubjectId = ref();
const highlightedPost = ref();

export const useCurrentFeed = () => {

    const openSubjectFeed = (id) => {
        console.log('åbner:' + id)
        currentSubjectId.value = id;
    }

    const closeFeed = () => {
        currentSubjectId.value = false;
    }

    const highlightPost = (id) => {
        highlightedPost.value = id;
    }

    return { currentSubjectId, closeFeed, openSubjectFeed, highlightedPost, highlightPost }
}
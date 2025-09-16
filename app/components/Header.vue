<script setup>
import { useCurrentFeed } from '../../composables/useCurrentFeed.js';
const { currentSubjectId, openSubjectFeed, closeFeed } = useCurrentFeed();

const loginDropdown = ref(false);

function showLoginDropDown(){
    loginDropdown.value = true;
}

function hideLoginDropDown(){
    loginDropdown.value = false;
}

</script>


<template>
    <div class="header-container container">
        <div class="nav-container">
            <div class="primary-nav">
                <Btn type="ghost">For you</Btn>
                <Btn type="ghost">Afstemninger</Btn>
                <Btn type="ghost">Udforsk</Btn>
            </div>
            <div class="secondary-nav">
                <div class="login-button-container" @mouseleave="hideLoginDropDown()">
                <Btn id="login-button" @mouseover="showLoginDropDown()" type="ghost">Log ind</Btn>
                    <Transition>
                        <div v-if="loginDropdown" class="login-dropdown">
                            <div class="login-buttons mit-id-button"></div>
                            <div class="login-buttons uni-login-button"></div>
                        </div>
                    </Transition>
                </div>

                <Btn icon="darkmode" type="ghost"></Btn>
                <Btn icon="search" type="ghost"></Btn>
                <Btn icon="menu" type="ghost"></Btn>
            </div>
        </div>

        <div class="logo-container">
            <img @click="closeFeed" src="/logo.png"></img>
        </div>
    </div>
</template>

<style>

.login-dropdown{
    position: absolute;
    background-color: var(--box);
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    padding: 5px;
    gap: 6px;
}

.mit-id-button{
    background-image: url(/mitid.jpg);
}
.uni-login-button{
    background-image: url(/unilogin.png);
    background-color: white;
}

.login-buttons{
    height: 2.75rem;
    width: 2.75rem;
    display: inline-flex;
    gap: 0.6rem;
    justify-content: center;
    align-items: center;
    padding-left: 0.75rem;
    padding-right: 0.75rem;
    border-radius: 25px;
    color: #BCBCBC;
    cursor: pointer;
    line-height: 0;
    background-position: center;
    background-size: cover;
}


.login-button-container{
    position: relative;
}


.header-container{
    position: relative;
    margin: 2.5rem 6.25rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.nav-container{
    width: 100%;
    display: flex;
    gap: 1.875rem;
    justify-content: space-between;
    color: var(--grå-skrift-2);
    z-index: 1;
}

.primary-nav{
    display: flex;
    gap: 0.375rem;
    justify-content: left;
    align-items: center;
}

.secondary-nav{
    display: flex;
    gap: 0.375rem;
    justify-content: right;
    align-items: center;
}

.logo-container{
    width: 100%;
    display: flex;
    justify-content: center;
    position: absolute;
    top: 0;
    pointer-events: none;
}

.logo-container img{
    position: absolute;
    pointer-events: auto;
}

</style>
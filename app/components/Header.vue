<script setup>
</script>


<template>
    <div class="header-container container">
        <div class="nav-container">
            <div class="primary-nav">
                <Btn type="ghost">Underside 1</Btn>
                <Btn type="ghost">Underside 2</Btn>
                <Btn type="ghost">Underside 3</Btn>
            </div>
            <div class="secondary-nav">
                <Btn type="ghost">Log ind</Btn>
                <Btn icon="darkmode" type="ghost"></Btn>
                <Btn icon="search" type="ghost"></Btn>
                <Btn icon="menu" type="ghost"></Btn>
            </div>
        </div>

        <div class="logo-container">
            <img src="/logo.png"></img>
        </div>
    </div>
</template>

<style>

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
    color: #909090;
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
}

</style>
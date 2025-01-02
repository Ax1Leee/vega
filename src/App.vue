<script setup>
import AppHeader from "@/components/AppHeader.vue";
</script>

<template>
    <app-header></app-header>
    <keep-alive :include="['Home']">
        <router-view/>
    </keep-alive>
</template>

<style scoped>

</style>

<script setup>
import {defineProps, onMounted, ref} from "vue";
import service from "@/api/axios";
import {ElNotification} from "element-plus";

// Props
const props = defineProps({
    genre: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    }
});

// Data
const titles = ref(null);
const fetching = ref(true);

// Methods
const fetchData = async () => {
    try {
        const response = await service.get('/movie/list', {
            params: {
                genre: props.genre,
                category: props.category,
                field: 'title'
            }
        });
        if (response['code'] === 200) {
            titles.value = response.data['titles'];
        } else {
            ElNotification({
                title: "Error",
                message: response['message'],
                type: "error"
            });
        }
    } catch (error) {
        console.log(error);
    } finally {
        fetching.value = false;
    }
};

// Mounted
onMounted(() => {
    fetchData();
});
</script>

<template>
    <el-card id="movie-list" style="max-width: 400px;" shadow="hover">
        <template #header>
            <p>{{ genre }}</p>
            <p>{{ category }}</p>
        </template>
        <p v-for="(title, index) in titles" :key="index">
            {{ index + 1 }} {{ title }}
        </p>
    </el-card>
</template>

<style scoped>

</style>
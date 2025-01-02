<script setup>
import {defineProps, onMounted, ref} from "vue";
import service from "@/api/axios";
import {ElNotification} from "element-plus";

// Props
const props = defineProps({
    reviewId: {
        type: Number,
        required: true,
        default: 0,
    }
})

// Data
const user = ref(null);
const review = ref(null);
const fetching = ref(true);

// Methods
const fetchData = async () => {
    try {
        const response = await service.get('/review/movie', {
            params: {
                reviewId: props.reviewId
            }
        });
        if (response['code'] === 200) {
            user.value = response.data['user'];
            review.value = response.data['review'];
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
    <el-card id="movie-review" style="max-width: 400px;">
        <template #header>
            {{ user.name }}
        </template>
        <p>
            <el-rate v-model="review.rating" :max="10" disabled/> {{ review.date }}
        </p>
        <p>{{ review.content }}</p>
    </el-card>
</template>

<style scoped>

</style>
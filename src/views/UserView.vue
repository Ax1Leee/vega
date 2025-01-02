<script setup>
import {computed, onMounted, ref} from "vue";
import service from "@/api/axios";
import {ElMessage, ElNotification} from "element-plus";
import UserReview from "@/components/UserReview.vue";

// Data
const user = ref(null);
const reviews = ref(null);
const total = ref(null);
const fetching = ref(true);
const count = ref(0);
const loading = ref(false);
const action = process.env.VUE_APP_BACKEND_API + '/user/avatar';
const uploading = ref(false);

// Computed
const disabled = computed(() => {
    return fetching.value || loading.value || !(count.value < total.value);
});

// Methods
const fetchUserData = async () => {
    try {
        count.value = 10;
        const response = await service.get('/user/reviews', {
            params: {
                count: count.value
            }
        });
        if (response['code'] === 200) {
            user.value = response.data['user'];
            reviews.value = response.data['reviews'];
            total.value = response.data['total'];
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
const loadReviews = async () => {
    try {
        loading.value = true;
        count.value += 10;
        const response = await service.get('/user/reviews', {
            params: {
                count: count.value
            }
        });
        if (response['code'] === 200) {
            user.value = response.data['user'];
            reviews.value = response.data['reviews'];
            total.value = response.data['total'];
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
        loading.value = false;
    }
};
const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
        ElMessage.error('The file type must be image!');
        return false;
    }
    if (file.size / 1024 / 1024 > 1) {
        ElMessage.error('The file size must be less than 1MB!');
        return false;
    }
    uploading.value = true;
    return true;
};
const handleSuccess = (response) => {
    response = response.data;
    if (response['code'] === 200) {
        uploading.value = false;
        ElMessage.success('Successfully uploaded!');
    } else {
        ElNotification({
            title: "Error",
            message: response['message'],
            type: "error"
        });
    }
};
const handleError = (error) => {
    uploading.value = false;
    ElMessage.error('Failed to upload!');
    console.log(error);
};

// Mounted
onMounted(() => {
    fetchUserData();
});
</script>

<template>
    <el-menu default-active="/user" mode="horizontal" router>
        <el-menu-item index="/">Home</el-menu-item>
        <el-menu-item index="/recommendation">Recommendation</el-menu-item>
        <el-menu-item index="/user">User</el-menu-item>
    </el-menu>
    <el-empty v-if="user === null" description="Sign In" />
    <main v-else>
        <el-descriptions title="User Info" direction="vertical" :column="4" v-loading="fetching">
            <el-descriptions-item label="Avatar" :rowspan="2" :span="2">
                <el-avatar :src="user.avatar" shape="square" />
                <el-upload
                    :action="action"
                    :show-file-list="false"
                    :before-upload="beforeUpload"
                    :on-success="handleSuccess"
                    :on-error="handleError"
                    :disabled="uploading"
                    accept="image/*"
                >
                    <el-button type="primary" :loading="uploading">
                        {{ uploading ? 'Uploading...' : 'Upload New Avatar' }}
                    </el-button>
                </el-upload>
            </el-descriptions-item>
            <el-descriptions-item label="Name">{{ user.name }}</el-descriptions-item>
            <el-descriptions-item label="Gender">{{ user.gender }}</el-descriptions-item>
            <el-descriptions-item label="Birth Date">{{ user.date }}</el-descriptions-item>
            <el-descriptions-item label="Location">{{ user.location }}</el-descriptions-item>
            <el-descriptions-item label="Bio" :span="4">{{ user.bio }}</el-descriptions-item>
        </el-descriptions>
        <el-divider />
        <ul v-infinite-scroll="loadReviews" :infinite-scroll-disabled="disabled">
            <user-review v-for="reviewId in reviews" :key="reviewId" :review-id="reviewId" />
        </ul>
        <p v-if="loading">Loading...</p>
    </main>
</template>

<style scoped>

</style>
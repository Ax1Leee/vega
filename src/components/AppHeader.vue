<script setup>
import {ArrowDown, Search} from "@element-plus/icons-vue";
import {onMounted, reactive, ref} from "vue";
import service from "@/api/axios";
import {ElNotification} from "element-plus";
import {removeToken, saveToken} from "@/utils/auth";

// Data
const key = ref("");
const signedIn = ref(false);
const user = ref(null);
const fetching = ref(true);
const signInFormData = reactive({
    username: "",
    password: ""
});
const signInFormRef = ref(null);
const signUpFormData = reactive({
    username: "",
    password: "",
    checkPassword: ""
});
const signUpFormRef = ref(null);
const signInDialogVisible = ref(false);
const signUpDialogVisible = ref(false);
const signOutDialogVisible = ref(false);

// Methods
const fetchData = async () => {
    try {
        const response = await service.get('/user');
        if (response['code'] === 200) {
            signedIn.value = true;
            user.value = response.data;
        }
    } catch (error) {
        console.log(error);
    } finally {
        fetching.value = false;
    }
};
function handleSearch() {
    // TODO
}
function handleCommand(command) {
    switch (command) {
        case "close":
            signOutDialogVisible.value = true;
    }
}
const submitSignInForm = async () => {
    try {
        const response = await service.post('/user/signIn', signInFormData);
        if (response['code'] === 200) {
            signedIn.value = true;
            user.value = response.data['user'];
            saveToken(response.data['token']);
        } else {
            ElNotification({
                title: "Error",
                message: response['message'],
                type: "error"
            });
        }
    } catch (error) {
        console.log(error);
    }
}
const submitSignUpForm = async () => {
    try {
        const response = await service.post('/user/signUp', signUpFormData);
        if (response['code'] === 200) {
            signedIn.value = true;
            user.value = response.data['user'];
            saveToken(response.data['token']);
        } else {
            ElNotification({
                title: "Error",
                message: response['message'],
                type: "error"
            });
        }
    } catch (error) {
        console.log(error);
    }
}
function resetForm(formRef) {
    formRef.value.resetFields();
}
function signOut() {
    signedIn.value = false;
    user.value = null;
    removeToken();
    signOutDialogVisible.value = false;
    // TODO
}

// Mounted
onMounted(() => {
    fetchData();
});
</script>

<template>
    <div id="app-header">
        <el-row justify="space-between">
            <el-col :span="4">
                <el-link type="primary" :underline="false" href="/" />
            </el-col>
            <el-col :span="4">
                <el-input v-model="key" @keyup.enter="handleSearch">
                    <template #prefix>
                        <el-icon><Search /></el-icon>
                    </template>
                </el-input>
            </el-col>
            <el-col :span="4">
                <div class="logged-in" v-if="signedIn">
                    <el-avatar :src="user.avatar" shape="square" />
                    <el-dropdown trigger="click" @command="handleCommand">
                        {{ user.nickname }}<el-icon><arrow-down /></el-icon>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item command="close" icon="Close">注销</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
                <div class="not-logged-in" v-else>
                    <el-button @click="signInDialogVisible = true" text>登录</el-button>
                     |
                    <el-button @click="signUpDialogVisible = true" text>注册</el-button>
                </div>
            </el-col>
        </el-row>
        <el-dialog v-model="signInDialogVisible" title="Sign In" center>
            <el-form :model="signInFormData" label-width="auto" ref="signInFormRef">
                <el-form-item label="Username">
                    <el-input v-model="signInFormData.username" />
                </el-form-item>
                <el-form-item label="Password">
                    <el-input type="password" v-model="signInFormData.password" show-password />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="resetForm(signInFormRef)">Reset</el-button>
                <el-button type="primary" @click="submitSignInForm">Sign In</el-button>
            </template>
        </el-dialog>
        <el-dialog v-model="signUpDialogVisible" title="Sign Up" center>
            <el-form :model="signUpFormData" label-width="auto" ref="signUpFormRef">
                <el-form-item label="Username">
                    <el-input v-model="signUpFormData.username" />
                </el-form-item>
                <el-form-item label="Password">
                    <el-input type="password" v-model="signUpFormData.password" show-password />
                </el-form-item>
                <el-form-item label="Check Password">
                    <el-input type="password" v-model="signUpFormData.checkPassword" show-password />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="resetForm(signUpFormRef)">Reset</el-button>
                <el-button type="primary" @click="submitSignUpForm">Sign Up</el-button>
            </template>
        </el-dialog>
        <el-dialog v-model="signOutDialogVisible" title="Sign Out">
            <span>Are you sure to sign out?</span>
            <template #footer>
                <el-button @click="signOutDialogVisible = false">Cancel</el-button>
                <el-button type="primary" @click="signOut">Confirm</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<style scoped>

</style>
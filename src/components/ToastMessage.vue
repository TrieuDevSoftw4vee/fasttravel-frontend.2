<script setup>import {useToast} from '../stores/toast.js';const{message}=useToast();</script>
<template><div v-if="message" class="toast" @click="message=''">{{message}}</div></template>

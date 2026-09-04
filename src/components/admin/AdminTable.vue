<script setup>
import {computed} from 'vue'
const props=defineProps({rows:{type:Array,default:()=>[]},resource:String,editable:Boolean})
const emit=defineEmits(['status','edit','remove'])
const columns=computed(()=>Object.keys(props.rows[0]||{}).filter(k=>k!=='passwordHash').slice(0,9))
const mutable=['provinces','stations','vehicles','routes','addons','promotions']
const canDelete=computed(()=>['provinces','stations','vehicles','routes','trips','trip-stops','addons','promotions'].includes(props.resource))
const display=v=>typeof v==='object'&&v?(v.name||v.code||v.fullName||('#'+(v.id||''))):String(v??'')
</script>
<template><div class="admin-table card"><table><thead><tr><th v-for="column in columns" :key="column">{{column}}</th><th>Thao tác</th></tr></thead><tbody><tr v-for="row in rows" :key="row.id"><td v-for="column in columns" :key="column"><span v-if="column==='active'" :class="['status-badge',row.active?'is-active':'is-inactive']">{{row.active?'Đang hoạt động':'Đã tắt'}}</span><template v-else>{{display(row[column])}}</template></td><td><div class="action-buttons"><select v-if="resource==='users'" :value="row.status" @change="emit('status',row,$event.target.value)"><option>ACTIVE</option><option>LOCKED</option><option>INACTIVE</option></select><select v-else-if="resource==='trips'" :value="row.status" @change="emit('status',row,$event.target.value)"><option>SCHEDULED</option><option>BOARDING</option><option>RUNNING</option><option>FINISHED</option><option>CANCELLED</option></select><button v-if="mutable.includes(resource)&&Object.prototype.hasOwnProperty.call(row,'active')" class="btn-action toggle" @click="emit('status',row,!row.active)">{{row.active?'Tắt active':'Bật active'}}</button><button v-if="editable" class="btn-action edit" @click="emit('edit',row)">Chỉnh sửa</button><button v-if="canDelete" class="btn-action delete" @click="emit('remove',row.id)">Xóa</button></div></td></tr></tbody></table><div v-if="!rows.length" class="empty">Chưa có dữ liệu</div></div></template>
<style scoped>
.action-buttons{display:flex;align-items:center;gap:7px;flex-wrap:wrap;min-width:260px}.btn-action{border:0;border-radius:7px;padding:7px 10px;color:#fff;cursor:pointer;font-size:12px;font-weight:600}.toggle{background:#d97706}.edit{background:#0284c7}.delete{background:#dc2626}.status-badge{display:inline-block;border-radius:999px;padding:4px 9px;font-size:12px;font-weight:700}.is-active{color:#047857;background:#d1fae5}.is-inactive{color:#b91c1c;background:#fee2e2}
</style>

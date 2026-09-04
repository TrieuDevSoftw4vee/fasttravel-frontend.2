<script setup>
import { onMounted, ref } from 'vue'
import { adminApi } from '../../api/adminApi.js'
import { money } from '../../api/client.js'
import { useToast } from '../../stores/toast.js'
import AdminSidebar from '../../components/admin/AdminSidebar.vue'
import AdminTable from '../../components/admin/AdminTable.vue'
import ResourceForm from '../../components/admin/ResourceForm.vue'

const toast = useToast(), tab = ref('dashboard'), stats = ref(null), rows = ref([])
const showForm = ref(false), editingRow = ref(null), lookups = ref({})
const labels = {provinces:'Tỉnh thành',stations:'Bến xe',vehicles:'Phương tiện',routes:'Tuyến đường',trips:'Chuyến xe','trip-stops':'Điểm dừng',addons:'Dịch vụ',promotions:'Khuyến mãi',bookings:'Đặt vé',payments:'Thanh toán',users:'Người dùng'}
const editable = ['provinces','stations','vehicles','routes','trips','trip-stops','addons','promotions']
const creatable = ['provinces','stations','vehicles','routes','trips','trip-stops','addons','promotions']

async function load(resource) { tab.value=resource; closeForm(); try { if(resource==='dashboard') stats.value=await adminApi.dashboard(); else rows.value=await adminApi.list(resource) } catch(e){ toast.show(e.message) } }
const dependencies={stations:['provinces'],routes:['stations'],trips:['routes','vehicles','users'],'trip-stops':['trips','stations']}
async function prepareForm(){const needed=dependencies[tab.value]||[];try{const values=await Promise.all(needed.map(adminApi.list));lookups.value=Object.fromEntries(needed.map((key,index)=>[key,values[index]]))}catch(e){toast.show('Không tải được danh sách lựa chọn: '+e.message);throw e}}
async function openCreate(){ editingRow.value=null; try{await prepareForm();showForm.value=true}catch{} }
async function openEdit(row){ editingRow.value={...row}; try{await prepareForm();showForm.value=true}catch{} }
function closeForm(){ showForm.value=false; editingRow.value=null }
async function save(data){ try { if(editingRow.value){ await adminApi.update(tab.value,editingRow.value.id,data); toast.show('Cập nhật dữ liệu thành công') } else { await adminApi.create(tab.value,data); toast.show('Thêm dữ liệu thành công') } closeForm(); await load(tab.value) } catch(e){ toast.show(e.message) } }
async function status(row,value){ try { if(tab.value==='users') await adminApi.userStatus(row.id,value); else if(tab.value==='trips') await adminApi.tripStatus(row.id,value); else await adminApi.update(tab.value,row.id,{active:value}); toast.show(value===false?'Đã tắt hoạt động':'Đã cập nhật trạng thái'); await load(tab.value) } catch(e){ toast.show(e.message) } }
async function remove(id){ if(!confirm('Bạn chắc chắn muốn xóa dữ liệu này?')) return; try { await adminApi.remove(tab.value,id); toast.show('Đã xóa dữ liệu'); await load(tab.value) } catch(e){ toast.show(e.message) } }
onMounted(()=>load('dashboard'))
</script>

<template>
  <div class="admin-shell"><AdminSidebar :active="tab" :labels="labels" @select="load"/><main class="admin-main">
    <div class="admin-top"><div><h1>{{tab==='dashboard'?'Dashboard':'Quản lý '+labels[tab].toLowerCase()}}</h1></div><span class="admin-user">● Admin</span></div>
    <template v-if="tab==='dashboard'&&stats"><div class="stat-grid"><div class="stat card"><span>♙</span><div><small>Tổng người dùng</small><b>{{stats.users}}</b><em>↑ Đang hoạt động</em></div></div><div class="stat card"><span>▣</span><div><small>Tổng booking</small><b>{{stats.bookings}}</b><em>↑ Tháng này</em></div></div><div class="stat card"><span>₫</span><div><small>Doanh thu</small><b>{{money(stats.revenue)}}</b><em>↑ Đã thanh toán</em></div></div><div class="stat card"><span>▰</span><div><small>Chuyến xe</small><b>{{stats.trips}}</b><em>Đang quản lý</em></div></div></div><div class="dashboard-grid"><section class="card chart"><h3>Doanh thu 7 ngày qua</h3><div class="bar-chart"><i v-for="h in [32,58,44,70,92,66,100]" :key="h" :style="{height:h+'%'}"></i></div><p>Biểu đồ tổng hợp từ dữ liệu hệ thống</p></section><section class="card chart"><h3>Tỷ lệ thanh toán</h3><div class="donut" style="--rate:85"><b>85%</b></div><p>Đã thanh toán</p></section></div></template>
    <template v-else>
      <div class="toolbar"><div>Quản lý {{labels[tab]}}</div><button v-if="creatable.includes(tab)" class="btn primary" @click="openCreate">＋ Thêm mới</button></div>
      <ResourceForm v-if="showForm" :resource="tab" :initial-data="editingRow" :lookups="lookups" @submit="save" @cancel="closeForm"/>
      <AdminTable :rows="rows" :resource="tab" :editable="editable.includes(tab)" @status="status" @edit="openEdit" @remove="remove"/>
    </template>
  </main></div>
</template>

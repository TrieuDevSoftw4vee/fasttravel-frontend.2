<script setup>
import {onMounted,ref} from 'vue';
import {useRoute} from 'vue-router';
import {bookingApi} from '../../api/bookingApi.js';

const route=useRoute();
const success=ref(false);
const loading=ref(true);
const message=ref('Đang xác nhận giao dịch VNPay...');

const responseMessages={
  '00':'Giao dịch thành công.',
  '07':'Giao dịch bị nghi ngờ. Vui lòng liên hệ hỗ trợ.',
  '09':'Thẻ/tài khoản chưa đăng ký Internet Banking.',
  '10':'Xác thực thông tin thẻ/tài khoản sai quá số lần cho phép.',
  '11':'Đã hết hạn chờ thanh toán.',
  '12':'Thẻ/tài khoản bị khóa.',
  '13':'Sai OTP.',
  '24':'Bạn đã hủy giao dịch.',
  '51':'Tài khoản không đủ số dư.',
  '65':'Vượt quá hạn mức giao dịch trong ngày.',
  '75':'Ngân hàng đang bảo trì.',
  '79':'Nhập sai mật khẩu thanh toán quá số lần quy định.'
};

onMounted(async()=>{
  try{
    const code=route.query.vnp_ResponseCode;
    if(code && code!=='00') throw new Error(responseMessages[code]||`VNPay từ chối giao dịch (mã ${code}).`);
    await bookingApi.vnpayReturn(route.query);
    success.value=true;
    message.value='Giao dịch đã được VNPay và backend FastTravel xác nhận.';
  }catch(e){
    message.value=e.message||'Không thể xác nhận giao dịch VNPay.';
  }finally{
    loading.value=false;
  }
});
</script>

<template>
  <section class="section">
    <div class="card empty">
      <h2>{{loading?'Đang xác nhận thanh toán':success?'Thanh toán thành công':'Thanh toán chưa thành công'}}</h2>
      <p>{{message}}</p>
      <p>Mã đặt vé: {{route.query.vnp_TxnRef||route.query.bookingCode||'—'}}</p>
      <p v-if="route.query.vnp_TransactionNo">Mã giao dịch VNPay: {{route.query.vnp_TransactionNo}}</p>
      <RouterLink class="btn primary" :to="success?'/account':'/'">{{success?'Xem vé của tôi':'Về trang chủ'}}</RouterLink>
    </div>
  </section>
</template>

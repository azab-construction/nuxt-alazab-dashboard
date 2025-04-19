import { ref } from 'vue' import { showSuccess, showError } from '@/utils/toast'
const sending = ref(false) async function sendWelcome() { if (!request?.email) {
showError('لا يوجد بريد إلكتروني لهذا المستخدم') return } sending.value = true
try { await $fetch('/api/send-welcome-email', { method: 'POST', body: { email:
request.email, username: request.name || 'المستخدم', request_url:
`https://azab.services/requests/${request.id}`, request_status: request.status,
request_number: request.id } }) showSuccess('✅ تم إرسال البريد بنجاح') } catch
(err) { console.error(err) showError('❌ فشل في إرسال البريد') } finally {
sending.value = false } }

<script setup lang="ts">
import { useFetch, useToast } from "#app";
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";

// المتغيرات الأساسية
const input = ref("");
const loading = ref(false);
const speechEnabled = ref(true);
const isDarkMode = ref(false);
const isTyping = ref(false);
const chatContainer = ref<HTMLElement | null>(null);
const connectionStatus = ref<"connected" | "connecting" | "disconnected">(
  "connected",
);
const isListening = ref(false);
const isSpeechRecognitionSupported = ref(false);
const toast = useToast();

// محتوى المحادثة
const messages = ref<
  { role: "user" | "assistant"; content: string; timestamp: number }[]
>([
  {
    role: "assistant",
    content: "مرحبًا 👋 أنا مساعد Azab الذكي، كيف يمكنني خدمتك؟",
    timestamp: Date.now(),
  },
]);

// التحقق من دعم التعرف الصوتي
onMounted(() => {
  if (typeof window !== "undefined") {
    // استيراد إعدادات المستخدم من التخزين المحلي
    const savedTheme = localStorage.getItem("azab-assistant-theme");
    if (savedTheme) {
      isDarkMode.value = savedTheme === "dark";
      applyTheme();
    }

    const savedSpeech = localStorage.getItem("azab-assistant-speech");
    if (savedSpeech) {
      speechEnabled.value = savedSpeech === "enabled";
    }

    // استيراد المحادثة المحفوظة
    const savedMessages = localStorage.getItem("azab-assistant-messages");
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        if (Array.isArray(parsed) && parsed.length > 0) {
          messages.value = parsed;
        }
      } catch (e) {
        console.error("فشل في استيراد المحادثة المحفوظة:", e);
      }
    }

    // التحقق من دعم التعرف الصوتي
    isSpeechRecognitionSupported.value =
      "SpeechRecognition" in window || "webkitSpeechRecognition" in window;

    // مراقبة حالة الاتصال
    window.addEventListener("online", handleConnectionChange);
    window.addEventListener("offline", handleConnectionChange);

    // التحقق من حالة الاتصال الحالية
    handleConnectionChange();
  }
});

onBeforeUnmount(() => {
  if (typeof window !== "undefined") {
    window.removeEventListener("online", handleConnectionChange);
    window.removeEventListener("offline", handleConnectionChange);
  }
});

// مراقبة التغييرات في المحادثة
watch(
  messages,
  (val) => {
    // تشغيل النص الصوتي
    const last = val[val.length - 1];
    if (last?.role === "assistant" && speechEnabled.value) {
      speakText(last.content);
    }

    // حفظ المحادثة في التخزين المحلي
    if (typeof window !== "undefined") {
      localStorage.setItem("azab-assistant-messages", JSON.stringify(val));
    }

    // التمرير إلى آخر رسالة
    scrollToBottom();
  },
  { deep: true },
);

// وظائف المساعد
async function sendMessage() {
  if (!input.value.trim()) return;
  if (loading.value) return; // منع الإرسال المتعدد

  // إضافة رسالة المستخدم
  const userMessage = input.value.trim();
  messages.value.push({
    role: "user",
    content: userMessage,
    timestamp: Date.now(),
  });
  input.value = "";

  // مؤشر التحميل
  loading.value = true;
  isTyping.value = true;
  await scrollToBottom();

  try {
    // إرسال الطلب إلى الخادم
    const { data, error } = await useFetch("/api/chat", {
      method: "POST",
      body: {
        messages: messages.value.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        userPreferences: {
          language: "ar",
          theme: isDarkMode.value ? "dark" : "light",
        },
      },
      timeout: 30000, // 30 ثانية كحد أقصى
    });

    isTyping.value = false;

    if (error.value || !data.value) {
      messages.value.push({
        role: "assistant",
        content: "❌ حدث خطأ في الاتصال بالمساعد. يرجى المحاولة مرة أخرى.",
        timestamp: Date.now(),
      });
    } else {
      messages.value.push({
        role: "assistant",
        content: data.value.reply,
        timestamp: Date.now(),
      });
    }
  } catch (e) {
    console.error("خطأ في إرسال الرسالة:", e);
    isTyping.value = false;
    messages.value.push({
      role: "assistant",
      content: "❌ عذراً، حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى لاحقاً.",
      timestamp: Date.now(),
    });
  } finally {
    loading.value = false;
    await scrollToBottom();
  }
}

// استخدام اقتراح جاهز
function useSuggestion(text: string) {
  input.value = text;
  sendMessage();
}

// تفعيل/إيقاف الصوت
function toggleSpeech() {
  speechEnabled.value = !speechEnabled.value;
  if (typeof window !== "undefined") {
    localStorage.setItem(
      "azab-assistant-speech",
      speechEnabled.value ? "enabled" : "disabled",
    );
  }

  // إيقاف النطق الحالي إذا تم تعطيل الصوت
  if (
    !speechEnabled.value &&
    typeof window !== "undefined" &&
    "speechSynthesis" in window
  ) {
    window.speechSynthesis.cancel();
  }
}

// تشغيل الصوت عند الرد
function speakText(text: string) {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ar-SA";
    // البحث عن صوت عربي مناسب
    const voices = window.speechSynthesis.getVoices();
    const arabicVoice = voices.find(
      (voice) => voice.lang.includes("ar") || voice.name.includes("Arabic"),
    );
    if (arabicVoice) {
      utterance.voice = arabicVoice;
    }

    utterance.rate = 1.0; // سرعة النطق
    utterance.pitch = 1.0; // درجة الصوت

    window.speechSynthesis.cancel(); // إيقاف أي نطق سابق
    window.speechSynthesis.speak(utterance);
  }
}

// إرسال المحادثة إلى البريد
async function sendTranscriptByEmail() {
  try {
    const transcript = messages.value
      .map(
        (msg) =>
          `${msg.role === "user" ? "👤 المستخدم" : "🤖 المساعد"} (${formatTime(msg.timestamp)}): ${msg.content}`,
      )
      .join("\n\n");

    const { error } = await useFetch("/api/send-assistant-transcript", {
      method: "POST",
      body: {
        subject: `محادثة جديدة من مساعد Azab - ${new Date().toLocaleDateString("ar-SA")}`,
        content: transcript,
        metadata: {
          timestamp: Date.now(),
          messageCount: messages.value.length,
          platform: navigator?.userAgent || "غير معروف",
        },
      },
    });

    if (error.value) {
      showNotification("❌ فشل إرسال المحادثة عبر البريد");
    } else {
      showNotification("✅ تم إرسال المحادثة إلى البريد الإلكتروني للمسؤول");
    }
  } catch (e) {
    console.error("خطأ في إرسال المحادثة:", e);
    showNotification("❌ حدث خطأ أثناء محاولة إرسال المحادثة");
  }
}

// مسح المحادثة
async function clearConversation() {
  const { $confirm } = useNuxtApp();
  if (await $confirm("هل أنت متأكد؟")) {
    messages.value = [
      {
        role: "assistant",
        content: "تم مسح المحادثة. كيف يمكنني مساعدتك اليوم؟",
        timestamp: Date.now(),
      },
    ];

    if (typeof window !== "undefined") {
      localStorage.setItem(
        "azab-assistant-messages",
        JSON.stringify(messages.value),
      );
    }

    showNotification("تم مسح المحادثة بنجاح");
  }
}

// تبديل المظهر (فاتح/داكن)
function toggleTheme() {
  isDarkMode.value = !isDarkMode.value;
  applyTheme();

  if (typeof window !== "undefined") {
    localStorage.setItem(
      "azab-assistant-theme",
      isDarkMode.value ? "dark" : "light",
    );
  }
}

// تطبيق المظهر على العناصر
function applyTheme() {
  if (typeof document !== "undefined") {
    if (isDarkMode.value) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }
}

// التمرير إلى أسفل نافذة المحادثة
async function scrollToBottom() {
  await nextTick();
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
}

// تنسيق الوقت
function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString("ar-SA", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// عرض إشعار للمستخدم
function showNotification(message: string) {
  toast.info(message);
}

// التعامل مع تغيرات الاتصال
function handleConnectionChange() {
  if (typeof navigator !== "undefined") {
    connectionStatus.value = navigator.onLine ? "connected" : "disconnected";
  }
}

// وظائف التعرف الصوتي
function toggleMic() {
  if (!isSpeechRecognitionSupported.value) return;

  if (isListening.value) {
    stopListening();
  } else {
    startListening();
  }
}

function startListening() {
  if (typeof window === "undefined") return;

  try {
    // إنشاء كائن التعرف الصوتي
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = "ar-SA";
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => {
      isListening.value = true;
      showNotification("بدء الاستماع... تحدث الآن");
    };

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join("");

      input.value = transcript;
    };

    recognition.onerror = (event) => {
      console.error("خطأ في التعرف الصوتي:", event.error);
      isListening.value = false;
      showNotification(`خطأ في التعرف الصوتي: ${event.error}`);
    };

    recognition.onend = () => {
      isListening.value = false;
      // إرسال تلقائي بعد انتهاء التعرف الصوتي إذا كان هناك نص
      if (input.value.trim()) {
        sendMessage();
      }
    };

    recognition.start();
  } catch (e) {
    console.error("فشل في بدء التعرف الصوتي:", e);
    isListening.value = false;
  }
}

function stopListening() {
  if (typeof window === "undefined") return;

  try {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.stop();
    isListening.value = false;
  } catch (e) {
    console.error("فشل في إيقاف التعرف الصوتي:", e);
  }
}
</script>

<template>
  <div
    class="mx-auto max-w-3xl min-h-screen rounded bg-white px-6 py-10 shadow"
  >
    <h1
      class="mb-4 flex items-center justify-between text-2xl text-blue-700 font-bold"
    >
      🤖 مساعد Azab الذكي
      <div class="flex items-center gap-2">
        <UTooltip text="تغيير المظهر">
          <UButton size="xs" variant="soft" color="gray" @click="toggleTheme">
            {{ isDarkMode ? "🌙" : "☀️" }}
          </UButton>
        </UTooltip>
        <UTooltip :text="speechEnabled ? 'إيقاف الصوت' : 'تفعيل الصوت'">
          <UButton size="xs" variant="soft" color="gray" @click="toggleSpeech">
            {{ speechEnabled ? "🔊" : "🔇" }}
          </UButton>
        </UTooltip>
      </div>
    </h1>

    <!-- رسالة حالة الاتصال -->
    <UAlert
      v-if="connectionStatus !== 'connected'"
      :color="connectionStatus === 'connecting' ? 'yellow' : 'red'"
      class="mb-4"
    >
      <div class="flex items-center gap-2">
        <div v-if="connectionStatus === 'connecting'">
          ⏳ جاري الاتصال بالخادم...
        </div>
        <div v-else>
          📶 فقدنا الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت.
        </div>
      </div>
    </UAlert>

    <!-- نافذة المحادثة -->
    <div
      ref="chatContainer"
      class="max-h-[65vh] overflow-y-auto border rounded p-4 transition-colors duration-300 space-y-4"
      :class="
        isDarkMode
          ? 'bg-gray-800 border-gray-700'
          : 'bg-gray-50 border-gray-200'
      "
    >
      <div
        v-for="(msg, index) in messages"
        :key="index"
        class="flex gap-2"
        :class="msg.role === 'user' ? 'justify-end' : 'justify-start'"
      >
        <div
          class="max-w-[80%] rounded-xl p-3 transition-colors duration-300"
          :class="[
            msg.role === 'user'
              ? isDarkMode
                ? 'bg-blue-800 text-right text-white'
                : 'bg-blue-100 text-right'
              : isDarkMode
                ? 'bg-gray-700 text-left text-white'
                : 'bg-gray-200 text-left',
          ]"
        >
          {{ msg.content }}
          <div
            class="mt-1 text-xs opacity-70"
            :class="msg.role === 'user' ? 'text-left' : 'text-right'"
          >
            {{ formatTime(msg.timestamp) }}
          </div>
        </div>
      </div>

      <!-- مؤشر الكتابة -->
      <div v-if="isTyping" class="flex justify-start">
        <div
          class="flex items-center gap-1 rounded-xl bg-gray-200 p-3 text-left"
          :class="isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200'"
        >
          <div class="typing-dot" />
          <div class="typing-dot" />
          <div class="typing-dot" />
        </div>
      </div>
    </div>

    <!-- نموذج إرسال الرسائل -->
    <form class="mt-6 flex gap-2" @submit.prevent="sendMessage">
      <UInput
        v-model="input"
        placeholder="اكتب سؤالك هنا..."
        class="flex-1"
        :ui="{
          base: 'transition-colors duration-300',
          input: {
            base: isDarkMode ? 'bg-gray-800 text-white border-gray-700' : '',
          },
        }"
        @keydown.enter="sendMessage"
      />
      <UButton :loading="loading" type="submit" color="primary">
        <span v-if="!loading">إرسال</span>
        <UIcon v-else name="i-heroicons-arrow-path" class="animate-spin" />
      </UButton>
      <UButton
        v-if="isSpeechRecognitionSupported"
        type="button"
        color="gray"
        :variant="isListening ? 'solid' : 'outline'"
        @click="toggleMic"
      >
        <UIcon
          :name="
            isListening
              ? 'i-heroicons-microphone-solid'
              : 'i-heroicons-microphone'
          "
          class="text-lg"
          :class="isListening ? 'text-red-500 animate-pulse' : ''"
        />
      </UButton>
    </form>

    <!-- الاقتراحات السريعة -->
    <div class="mt-4 flex flex-wrap gap-2">
      <UButton
        size="xs"
        variant="solid"
        color="green"
        @click="sendTranscriptByEmail"
      >
        📧 إرسال المحادثة للمسؤول
      </UButton>
      <UButton
        size="xs"
        variant="outline"
        :class="isDarkMode ? 'text-white' : ''"
        @click="clearConversation"
      >
        🗑️ مسح المحادثة
      </UButton>
      <UPopover>
        <UButton
          size="xs"
          variant="outline"
          :class="isDarkMode ? 'text-white' : ''"
        >
          💬 اقتراحات سريعة
        </UButton>

        <template #panel="{ close }">
          <div class="w-64 p-2 space-y-2">
            <UButton
              block
              size="xs"
              variant="outline"
              @click="
                () => {
                  useSuggestion('كيف أرسل طلب صيانة؟');
                  close();
                }
              "
            >
              📥 كيف أرسل طلب صيانة؟
            </UButton>
            <UButton
              block
              size="xs"
              variant="outline"
              @click="
                () => {
                  useSuggestion('ما هي حالة الطلب رقم 102؟');
                  close();
                }
              "
            >
              📊 ما حالة الطلب 102؟
            </UButton>
            <UButton
              block
              size="xs"
              variant="outline"
              @click="
                () => {
                  useSuggestion('هل يمكنني طباعة تقرير شهري؟');
                  close();
                }
              "
            >
              🖨 طباعة تقرير شهري
            </UButton>
            <UButton
              block
              size="xs"
              variant="outline"
              @click="
                () => {
                  useSuggestion('كيف يمكنني تغيير كلمة المرور؟');
                  close();
                }
              "
            >
              🔑 تغيير كلمة المرور
            </UButton>
            <UButton
              block
              size="xs"
              variant="outline"
              @click="
                () => {
                  useSuggestion('ما هي ساعات العمل؟');
                  close();
                }
              "
            >
              🕒 ساعات العمل
            </UButton>
          </div>
        </template>
      </UPopover>
    </div>
  </div>
</template>

<style>
/* أنيميشن نقاط الكتابة */
.typing-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: currentColor;
  opacity: 0.7;
  animation: typing 1.4s infinite both;
}

.typing-dot:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%,
  60%,
  100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-4px);
  }
}

/* تعديلات للوضع الداكن */
:root.dark {
  --bg-main: #111827;
  --text-main: #e5e7eb;
}

:root.dark body {
  background-color: var(--bg-main);
  color: var(--text-main);
}

/* تحسين الاستجابة للشاشات الصغيرة */
@media (max-width: 640px) {
  .max-w-3xl {
    max-width: 100%;
  }

  h1 {
    font-size: 1.25rem;
  }
}
</style>

<style lang="ts" scoped>
// تعريف الأنواع الخاصة بالنافذة للتعرف الصوتي
declare global {
  interface Window {
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
  }
}
</style>

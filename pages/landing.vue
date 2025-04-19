<script setup>
definePageMeta({
  layout: "landing",
});

const TeamImg1 = "https://source.unsplash.com/IF9TK5Uy-KI";
const TeamImg2 = "https://source.unsplash.com/iEEBWgY_6lA";
const TeamImg3 = "https://source.unsplash.com/ZHvM3XIOHoE";

const team = [
  {
    name: "Janette Lynch",
    title: "Senior Director",
    avatar: {
      src: TeamImg1,
      width: 480,
      height: 560,
    },
  },
  {
    name: "Marcell Ziemann",
    title: "Principal Strategist",
    avatar: {
      src: TeamImg2,
      width: 580,
      height: 580,
    },
  },
  {
    name: "Robert Palmer",
    title: "Marketing Engineer",
    avatar: {
      src: TeamImg3,
      width: 580,
      height: 580,
    },
  },
];

useHead({
  script: [
    {
      src: "https://cdn.jotfor.ms/s/umd/latest/for-embedded-agent.js",
    },
  ],
});
</script>

<script>
if (import.meta.client) {
  window.addEventListener("DOMContentLoaded", () => {
    window.AgentInitializer?.init({
      agentRenderURL:
        "https://agent.jotform.com/0194abdee59871f7b73e2eae35ed720e8ce0",
      rootId: "JotformAgent-0194abdee59871f7b73e2eae35ed720e8ce0",
      formID: "0194abdee59871f7b73e2eae35ed720e8ce0",
      queryParams: ["skipWelcome=1", "maximizable=1"],
      domain: "https://www.jotform.com",
      isDraggable: false,
      background: "linear-gradient(180deg, #C8CEED 0%, #C8CEED 100%)",
      buttonBackgroundColor: "#0a1551",
      buttonIconColor: "#fff",
      variant: false,
      customizations: {
        greeting: "Yes",
        greetingMessage: "مرحباً",
        openByDefault: "Yes",
        pulse: "Yes",
        position: "right",
        autoOpenChatIn: "1",
      },
      isVoice: false,
    });
  });
}
</script>

<template>
  <LandingContainer>
    <LandingSectionhead>
      <template #title> The Azab App </template>
      <template #desc>
        Your gateway to smart, modern architectural services.
      </template>
    </LandingSectionhead>

    <div class="mx-auto mt-12 max-w-4xl flex flex-col gap-4 text-center">
      <h2 class="text-3xl text-gray-800 font-bold">
        Designed for Architectural Excellence
      </h2>
      <p class="text-lg text-slate-600 leading-relaxed">
        The Azab app was created to streamline architectural services with ease
        and efficiency. We're currently in the internal testing phase and
        getting ready for public launch.
      </p>
      <p class="text-md text-slate-500">
        We know you're excited about this experience—and so are we! A special
        announcement meeting will be held soon to explain how to use the app.
        <br />
        Our goal is, and always has been, to build and strengthen bridges of
        communication.
      </p>
      <p class="mt-4 text-orange-600 font-semibold">
        Thank you, our dear customers...<br />— Mohamed Azab.
      </p>
    </div>

    <div class="mt-20 rounded-xl bg-slate-50 px-6 py-16 shadow-sm">
      <div class="mx-auto max-w-3xl text-center">
        <h3 class="text-2xl text-gray-800 font-semibold">
          Getting Started: Warehouse Preview
        </h3>
        <p class="text-md mt-2 text-slate-600">
          Everything you need to start operating and maintaining architectural
          warehouses.
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 mx-auto mt-20 max-w-6xl gap-10 md:grid-cols-3">
      <div v-for="person in team" :key="person.name" class="text-center">
        <img
          :src="person.avatar.src"
          :alt="person.name"
          :width="person.avatar.width"
          :height="person.avatar.height"
          class="mx-auto mb-4 rounded-xl shadow-md"
        />
        <h4 class="text-lg text-gray-700 font-semibold">
          {{ person.name }}
        </h4>
        <p class="text-sm text-slate-500">
          {{ person.title }}
        </p>
      </div>
    </div>
  </LandingContainer>
</template>

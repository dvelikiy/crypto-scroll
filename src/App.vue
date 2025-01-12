<script setup lang="ts">
import { ref } from 'vue'
import { nanoid } from 'nanoid/non-secure'
import { useInfiniteScroll } from './useInfiniteScroll';
import { APIMultipleUsersResponse, APIUser, User } from './crypto-scroll';

/**
 * 
 * @description fetches n users from the Random User API and adds them to the users array
 * @param n number of users to fetch
 * @returns void
 */
const fetchNUsers = async (n: number): Promise<void> => {
  /**
   * 
   * @description Raw data from the Random User API
   * @type {Response}
   */
  const response = await fetch(`https://randomuser.me/api/?results=${n}`);

  /**
   * 
   * @description Parsed data from the Random User API
   * @type {APIMultipleUsersResponse}
   */
  const data: APIMultipleUsersResponse = await response.json();

  /**
   * 
   * @description Maps the API data to the {@link User} data structure
   * @type {User[]}
   */
  const result: User[] = data.results.map((user: APIUser) => {
    return {
      id: nanoid(),
      name: user.name.first,
      email: user.email,
      picture: user.picture.large
    }
  })
  users.value.push(...result);
}

/**
 * 
 * @description Ref of the users array
 * @type {Ref<User[]>}
 */
const users = ref<User[]>([]);

/**
 * 
 * @description Template Ref of the observer element
 * @type {Ref<HTMLElement | null>}
 */
const observerEl = ref<HTMLElement | null>(null);

/**
 * 
 * @description Ref of the loading state
 * @type {Ref<boolean>}
 */
const isLoading = ref(false);

useInfiniteScroll(observerEl, async () => {
  isLoading.value = true;
  await fetchNUsers(10);
  isLoading.value = false;
})
</script>

<template>
  <div class="count">
    {{ users.length }}
  </div>
  <TransitionGroup name="list" tag="div" class="wrapper">
    <div v-for="user in users" :key="user.id" class="user">
      <img :src="user.picture" alt="user" class="user__picture">
      <div class="user__name">
        {{ user.name }}
      </div>
      <a class="user__email" :href="`mailto:${user.email}`">
        {{ user.email }}
      </a>
    </div>
  </TransitionGroup>
  <div class="observer" ref="observerEl" />
  <div v-if="isLoading" class="loader animate__animated animate__pulse animate__infinite">
    Loading...
  </div>
</template>

<style scoped>
.count {
  position: fixed;
  top: 10px;
  left: 10px;
  font-size: 24px;
  font-weight: bold;
  color: #fff;
  z-index: 10;
}

.wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.user {
  margin-bottom: 10px;
  padding: 10px;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  border: 1px solid white;
}

.user__picture {
  border-radius: 50%;
}

.user__name {
  font-weight: 500;
}

.user__email {
  display: block;
  width: 230px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.list-enter-active,
.list-leave-active {
  transition: transform 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>

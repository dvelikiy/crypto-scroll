import { onMounted, onUnmounted } from 'vue';
import type { Ref } from 'vue';

/**
 * 
 * @description useInfiniteScroll composable will start observing target element on component mount and call the loadMore function when el is in the viewport. It will also disconnect the observer when the component is unmounted. This is a simple infinite scroll implementation using native IntersectionObserver.
 * @param el ref of the HTML element that will be observed
 * @param loadMore function that will be called when the element is in the viewport
 * @returns void
 */
export const useInfiniteScroll = (el: Ref<HTMLElement | null>, loadMore: () => void) => {
  /**
   * 
   * @description observer will observe the element and call the loadMore function when it is in the viewport
   * @type {IntersectionObserver}
   */
  const observer: IntersectionObserver = new IntersectionObserver((entries) => {
    const firstEntry = entries[0];
    if (firstEntry.isIntersecting) {
      loadMore();
    }
  });

  onMounted(() => {
    observer.observe(el.value!);
  });

  onUnmounted(() => {
    observer.disconnect();
  });
}
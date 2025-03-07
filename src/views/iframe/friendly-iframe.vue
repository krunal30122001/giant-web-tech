<template>
    <div class="vue-friendly-iframe"></div>
  </template>
  
  <script>
  import { defineComponent, ref, watch, onMounted } from "vue";
  import { v1 as uuidV1 } from "uuid";
  
  function debounce(func, wait, immediate) {
    let timeout;
    return function () {
      const context = this;
      const args = arguments;
      const later = function () {
        timeout = null;
        if (!immediate) {
          func.apply(context, args);
        }
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) {
        func.apply(context, args);
      }
    };
  }
  
  function generateGuid() {
    return uuidV1();
  }
  
  export default defineComponent({
    name: "FriendlyIframe",
    props: {
      src: {
        type: String,
        required: true,
      },
      className: {
        type: String,
        required: false,
      },
    },
    setup(props, { emit }) {
      const iframeEl = ref(null);
      const iframeLoadedMessage = `IFRAME_LOADED_${generateGuid()}`;
      const iframeOnReadyStateChangeMessage = `IFRAME_ON_READ_STATE_CHANGE_${generateGuid()}`;
  
      const removeIframe = () => {
        const el = iframeEl.value;
        if (el && el.parentNode) {
          el.parentNode.removeChild(el);
        }
      };
  
      const setIframeUrl = () => {
        if (!iframeEl.value) return;
        const iframeDoc = iframeEl.value.contentWindow.document;
        iframeDoc.open().write(`
          <body onload="window.location.href='${props.src}'; parent.postMessage('${iframeLoadedMessage}', '*')"></body>
          <script>
            window.document.onreadystatechange = function () {
              if (window.document.readyState === 'complete') {
                parent.postMessage('${iframeOnReadyStateChangeMessage}', '*')
              }
            };
          <\/script>
        `);
        iframeDoc.close(); // Trigger iframe onload event
      };
  
      const initIframe = () => {
        iframeEl.value = document.createElement("iframe");
        iframeEl.value.setAttribute("crossorigin", "anonymous");
        iframeEl.value.setAttribute("target", "_parent");
        iframeEl.value.setAttribute(
          "style",
          "visibility: hidden; position: absolute; top: -99999px"
        );
        iframeEl.value.setAttribute("marginwidth", "0");
        iframeEl.value.setAttribute("marginheight", "0");
        iframeEl.value.setAttribute("frameborder", "0");
        iframeEl.value.setAttribute("scrolling", "no");
        if (props.className) {
          iframeEl.value.setAttribute("class", props.className);
        }
        document.querySelector(".vue-friendly-iframe").appendChild(iframeEl.value);
        setIframeUrl();
      };
  
      const reinitIframe = debounce(() => {
        removeIframe();
        initIframe();
      }, 200);
  
      const listenForEvents = () => {
        const eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
        const messageEvent = eventMethod === "attachEvent" ? "onmessage" : "message";
        window[eventMethod](
          messageEvent,
          (event) => {
            if (event.data === iframeLoadedMessage) {
              emit("iframe-load");
              iframeEl.value.setAttribute("style", "visibility: visible;");
            }
            if (event.data === iframeOnReadyStateChangeMessage) {
              emit("document-load");
              emit("load");
            }
          },
          false
        );
      };
  
      watch(() => props.src, () => {
        reinitIframe();
      });
  
      onMounted(() => {
        listenForEvents();
        initIframe();
      });
  
      return {
        iframeEl,
      };
    },
  });
  </script>
  
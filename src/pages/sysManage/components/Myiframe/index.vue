<template>
  <!-- <iframe src="http:/www.ihaunglimin.com" class="iframe" ref="iframe"></iframe> -->
  <a-spin tip="正在加载..." :spinning="spinning" style="height: 100%;" size="large">
  <iframe :src="urlPath" class="iframe" ref="iframe"></iframe>
  </a-spin>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style
export default {
  name: "nxframe",
  data() {
    return {
      urlPath: '' ,// iframe src 路径
	  spinning:false
    };
  },
  created() {
    console.log(this.$route);
    // NProgress.configure({ showSpinner: false });
  },
  mounted() {
    this.load();
    this.resize();
  },
  watch: {
    $route: function() {
      this.load();
    }
  },
  components: {
   
  },
  methods: {
    // 显示等待框
    show() {
      // NProgress.start();
	  this.spinning=true
    },
    // 隐藏等待狂
    hide() {
      // NProgress.done();
	   this.spinning=false
    },
    // 加载浏览器窗口变化自适应
    resize() {
      window.onresize = () => {
        this.iframeInit();
      };
    },
    // 加载组件
    load() {
		console.log(this.$route.meta.url)
		this.urlPath=this.$route.meta.url;
      this.show();
      let time = 3;
      const timeFunc = setInterval(() => {
        time--;
        if (time === 0) {
          this.hide();
          clearInterval(timeFunc);
        }
      }, 1000);
      this.iframeInit();
    },
    // iframe窗口初始化
    iframeInit() {
      const iframe = this.$refs.iframe;
      const clientHeight = document.documentElement.clientHeight - 0;
      iframe.style.height = `${clientHeight}px`;
      if (iframe.attachEvent) {
        iframe.attachEvent("onload", () => {
          this.hide();
        });
      } else {
        iframe.onload = () => {
          this.hide();
        };
      }
    },
   //  getUrlPath: function() {
   //    // 获取 iframe src 路径
   //    let url = window.location.href;
	  // console.log(url,url);
   //    console.log("url:" + url);
   //    if (url.indexOf("myhttp/") >= 0) {
   //      url = "http://" + url.split("myhttp/")[1];
   //    }
   //    if (url.indexOf("myhttps/") >= 0) {
   //      console.log(url.split("myhttps//")[1]);
   //      url = "https://" + url.split("myhttps/")[1];
   //    }
   //    console.log(url);
   //    return url;
   //  }
  }
};
</script>

<style lang="scss">
.iframe {
  width: 100%;
  height: 100%;
  border: 0;
  overflow: hidden;
  box-sizing: border-box;
}
</style>
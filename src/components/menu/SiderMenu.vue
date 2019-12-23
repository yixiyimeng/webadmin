<template>
	<a-layout-sider collapsible width="200px" class="layoutSilder" :class="{light:theme=='light'}" v-model="collapsed">
		<div class="userinfo flex flex-align-center" :class="{'hide-userinfo':collapsed}">
			<div class="thumb" @click="setuploadInfo">
				<img alt="" :src="fileUrl+userInfo.picUrl"  v-if="userInfo.picUrl"/>
				<img alt="" src="../../assets/img/thumb.png"  v-if="!userInfo.picUrl"/>
				</div>
			<div class="flex-1">
				<p class="name" @click="setuploadInfo">{{userInfo.name}}</p>
				<div>
					<a href="javascript:;" class="online">
						<i class="material-icons icon iconfont ">radio_button_checked</i>
						<span>在线</span>
					</a>
					<a href="javascript:;" class="exit ml10" @click="sendMessage"><i class="material-icons icon iconfont ">exit_to_app</i>
						<span>注销</span></a>
				</div>
			</div>

		</div>
		<s-menu :collapsed="collapsed" :menu="menus" :theme="theme" @select="onSelect" :mode="mode" style="padding: 0; text-align: left; border-right: 0;"></s-menu>
	</a-layout-sider>
</template>

<script>
	import ALayoutSider from 'ant-design-vue/es/layout/Sider';
	import SMenu from './index';
	import {
		updateTheme
	} from '@/components/SettingDrawer/settingConfig'
	import {
		fileUrl
	} from '@/utils/base'
	export default {
		name: 'SiderMenu',
		components: {
			ALayoutSider,
			SMenu
		},
		props: {
			mode: {
				type: String,
				required: false,
				default: 'inline'
			},
			// theme: {
			// 	type: String,
			// 	required: false,
			// 	default: 'dark'
			// },
			collapsible: {
				type: Boolean,
				required: false,
				default: false
			},
			// 		collapsed: {
			// 			type: Boolean,
			// 			required: false,
			// 			default: false
			// 		},
			menus: {
				type: Array,
				required: true
			}
		},
		data() {
			return {
				collapsed: false,
				userInfo: {},
				theme: localStorage.getItem('navTheme') || 'dark',
				fileUrl
			}
		},
		created() {
			this.getUserInfo();
		},
		mounted() {
			const $me = this;
			/* 接受消息 */
			window.addEventListener("message", function(event) {
				var data = event.data;
				console.log(data)
				switch (data.cmd) {
					case 'uploadUserInfo':
						// 处理业务逻辑
						$me.getUserInfo();
						break;
					case 'uploadColor':
						updateTheme(data.params.color)
						break;
					case 'uploadTheme':
						$me.theme = data.params.theme
						break;
				}
			});
		},
		computed: {
			// 		isMobile() {
			// 			return this.$store.state.app.device !== 'desktop';
			// 		}
		},
		methods: {
			onSelect(obj) {
				this.$emit('menuSelect', obj);
			},
			getUserInfo() {
				try {
					if (JSON.parse(localStorage.getItem('userInfo'))) {
						this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
					}
				} catch (e) {
					//TODO handle the exception
				}
			},
			sendMessage() {
				// 向父vue页面发送信息
				window.parent.postMessage({
					cmd: 'exitApp',
					params: {}
				}, '*');
			},
			setuploadInfo() {
				window.parent.postMessage({
					cmd: 'uploadInfo',
					params: {}
				}, '*');
			}
		}
	};
</script>
<style lang="less" scoped="scoped">
	.logo h1 {
		color: #fff;
	}

	.userinfo {
		margin: 24px 13px 10px;
		color: #f0f2f5;

		.thumb {
			width: 45px;
			height: 45px;
			border-radius: 100%;
			cursor: pointer;
			overflow: hidden;

			img {
				display: block;
				width: 100%;
				height: 100%;
				position: relative;

				&:after {
					content: "";
					display: inline-block;
					position: absolute;
					z-index: 2;
					top: 0;
					left: 0;
					width: 100%;
					height: 100%;
					background-image: url(../../assets/img/thumb.png);
					background-size: cover;
					background-color: none;
				}
			}
		}

		.flex-1 {
			margin-left: 17px;
			text-align: left;
			transition: all .3s;
			overflow: hidden;
			white-space: nowrap;
		}

		&.hide-userinfo .flex-1 {
			height: 0;
			margin-left: 0;
		}

		.name {
			font-size: 16px;
			font-weight: bold;
			margin-bottom: 0;
			cursor: pointer;
		}

		a {
			color: #f0f2f5;
			font-size: 12px;
			font-size: 12px;

			i,
			span {
				display: inline-block;
				vertical-align: middle;
				font-size: 12px;
			}

			&.online i {
				color: #00baad;
				margin-right: 2px;
			}

			&.exit i {
				color: #960101;
				margin-right: 2px;
			}
		}
	}

	/deep/ .iconfont {
		font-size: 14px;
		margin-right: 5px;
	}

	/deep/ .ant-menu-inline-collapsed>.ant-menu-item .iconfont+span,
	/deep/ .ant-menu-inline-collapsed>.ant-menu-item-group>.ant-menu-item-group-list>.ant-menu-item .iconfont+span,
	/deep/ .ant-menu-inline-collapsed>.ant-menu-item-group>.ant-menu-item-group-list>.ant-menu-submenu>.ant-menu-submenu-title .iconfont+span,
	/deep/ .ant-menu-inline-collapsed>.ant-menu-submenu>.ant-menu-submenu-title .iconfont+span {
		display: inline-block;
		max-width: 0;
		opacity: 0;
	}

	/* .ant-layout-sider-trigger{
		bottom:25px;
		} */
	.layoutSilder {
		overflow: auto;
		height: 100%;
	}

	.light.layoutSilder {
		background: #e8ebef;
	}

	.light.layoutSilder .userinfo {
		color: #333;

		a {
			color: #333;
		}
	}

	.light /deep/ .ant-menu {
		background: #e8ebef;
	}
</style>

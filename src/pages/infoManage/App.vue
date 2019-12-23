<template>
	<a-locale-provider :locale="locale">
		<div id="app" style="height: 100%;"><route-view></route-view></div>
	</a-locale-provider>
</template>

<script>
    import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN';
    import RouteView from '@/layouts/RouteView';
    import {GetQueryString} from '@/utils/base'
    import store from './store/index'
    import router from './router'
    import {
        getlistLevelOtherMenu
    } from '@/api'
	import {
			updateTheme
		} from '@/components/SettingDrawer/settingConfig'
    export default {
        name: 'app',
        components: {
            RouteView
        },
        computed: {},
        data() {
            return {
                locale: zhCN
            };
        },
        computed: {},
        created() {
			updateTheme(localStorage.getItem('primaryColor') || '#125fc9');
            /* 获取菜单 */
            let menuId = GetQueryString('menuId');
			this.$store.commit('SET_menuId', menuId);
            //console.log(menuId)
            if(menuId&&menuId!="undefined"){
                getlistLevelOtherMenu({
                    'menuId': menuId
                }).then(da => {
                    let menulist = da.data;
                    console.log(menulist);
                    store.dispatch('GenerateRoutes', {
                        menulist
                    }).then(() => {
                        router.addRoutes(store.getters.addRouters)
                    })
                    sessionStorage.setItem('subMenu[' + menuId + ']', JSON.stringify(menulist))
                })
            }
        }
    };
</script>

<style scoped="scoped" lang="less">
	
	#app {
		font-family: 'Avenir', Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		/* text-align: center; */
		color: #2c3e50;
		/deep/ .ant-btn{
			border-radius: 2px;
		}
		/deep/ .ant-table-thead>tr>th {
			background: #fafafa !important;
		}
		/deep/ .table-wrapper .operation {
			line-height: 1;
			a {
				font-size: 20px;
				margin: 0 10px;
				
		
				&.del {
					color: #d43030;
				}
		
				&.add {
					color: #00baad;
				}
			}
		}
	}
	p {
		margin-bottom: 0;
	}
	/deep/ .viewlist {
		.topbar {
			border-top: 1px solid #ddd;
			padding-top: 25px;
			.handlerbtn {
				// width: 250px;
				text-align: right;
				.ant-btn {
					margin: 5px 10px;
				}
			}
		}
		.table-wrapper {
			background: #fff;
			box-shadow: 0 0 10px rgba(181, 181, 181, 0.5);
			margin-bottom: 20px;
			border-radius: 2px;
			overflow: hidden;

		}
		/deep/ .ant-card-body {
			padding: 0 20px;
		}
		/deep/ .ant-pagination-total-text {
			position: absolute;
			left: 8px;
		}
	}
</style>
<style lang="less">
	// @import '../../assets/m.less';
	@import '../../assets/reset.css';
</style>
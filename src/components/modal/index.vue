<template>
	<a-modal :visible="visible" :width="bodywidth" :bodyStyle="{height:isMax?(maxheight+'px'):'auto',display:bodydisplay}"
	 @ok="handleOk" @cancel="cancel" :centered="isMax">
		<template slot="title">
			<div class="flex flex-pack-justify title">
				<div>{{ title }}</div>
				<div>
					<a-icon type="minus" @click="handleClickToggleMin" />
					<a-icon :type="isMax?'fullscreen-exit':'fullscreen'" @click="handleClickToggleFullScreen" />
				</div>
			</div>
		</template>
		
		<template>
		</template>
	</a-modal>
</template>

<script>
	export default {
		name: 'SMenu',
		props: {
			visible: {
				type: Boolean,
				default: false

			},
			width: {
				type: String,
				default: '800px'
			},
			// style: {
			// 	type: Object,
			// 	default: {}
			// },
			title: {
				type: String,
				default: '新增'
			}
		},
		data() {
			return {
				bodywidth: this.width,
				maxheight: 100,
				isMax: false,
				bodydisplay: 'block',
			}
		},
		mounted() {

		},
		methods: {
			handleOk() {

			},
			cancel() {},
			handleClickToggleFullScreen() {
				this.isMax = !this.isMax;
				this.bodywidth = this.isMax ? '100%' : this.width;
				this.maxheight = document.body.offsetHeight - 110;
				this.bodydisplay = 'block';
			},
			handleClickToggleMin() {
				this.maxheight = 0;
				this.bodywidth = 300;
				this.bodydisplay = "none";
			}

		}
	}
</script>

<style scoped="scoped" lang="less">
	.title {
		margin-right: 30px;

		.anticon {
			color: rgba(0, 0, 0, .45);
			cursor: pointer;
			margin: 0 2px;

			&:hover {
				color: rgba(0, 0, 0, .8);
			}
		}
	}
</style>

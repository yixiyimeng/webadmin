<template>
	<div class="company">
		<div class="title">公司简介</div>
		<div class="info">{{companyinfo.info}}</div>
		<a :href="companyinfo.url" class="link">{{companyinfo.companyname}}</a>
	</div>
</template>

<script>
	export default {
		name: "company",
		props: {
		  companyinfo: Object
		}
	}
</script>

<style scoped="scoped" lang="less">
	.company{
		padding: 20px 10px;
	}
	.company .title{
		color: #333;
		font-size: 18px;
		font-weight: bold;
		margin-bottom: 5px;
	}
	.info,.link{
		position: relative;
		line-height: 25px;
	}
	.info:before,.link:before{
		position: absolute;
		height: 5px;
		width: 5px;
		background: #263949;
		border-radius: 100%;
		content: '';
		display: block;
		top: 10px;
		left: -13px;
	}
	.info{
		color: #808080;
		
	}
	.link{
		color: #125fc9;
	}
</style>

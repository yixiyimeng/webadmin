<template>
	<transition name="page-toggle">
		<keep-alive v-if="$route.meta.keepAlive">
			<router-view></router-view>
		</keep-alive>
		<router-view v-else></router-view>
	</transition>
</template>

<script>
	export default {
		name: "RouteView"
	}
</script>

<style scoped>

</style>
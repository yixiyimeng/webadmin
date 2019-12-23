export const rowSelection = {
	data() {
		return {
			selectedRowKeys: []
		}
	},
	computed: {
		
	},
	created() {
		
	},
	methods: {
		/* 选中checkbox */
		onSelectChange(selectedRowKeys) {
			this.selectedRowKeys = selectedRowKeys
		}
	}
};
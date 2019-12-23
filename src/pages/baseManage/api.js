export const baseManageapi = {
	/* 获取数据字典 */
	getdictList: '/plat/common/dict/list',
	/* 新增数据字典 */
	addDict: '/plat/common/dict/save',
	/* 编辑数据字典 */
	updateDict: '/plat/common/dict/update',
	/* 批量删除数据字典  */
	batchRemoveDict: '/plat/common/dict/batchRemove',
	/* 删除数据字典 */
	removeDict: '/plat/common/dict/remove',
	/* 获取版本列表 */
	getVersionManage: '/plat/common/versionManage/list',
	/* 新增版本列表 */
	addVersionManage: '/plat/common/versionManage/save',
	/* 编辑版本列表  */
	updateVersionManage: '/plat/common/versionManage/update',
	/* 批量删除版本列表   */
	batchRemoveVersionManage: '/plat/common/versionManage/batchRemove',
	/* 删除版本列表  */
	removeVersionManage: '/plat/common/versionManage/remove',
	/*版本下载的查询*/
	getVersionDownload: '/plat/common/versionDownload/list_download',
	fileUpload: '/plat/common/versionManage/fileUpload',
	checkFileMd5: '/plat/common/versionManage/checkFileMd5',
	updateVersion: '/plat/common/versionManage/update',
	addVersion: '/plat/common/versionManage/save',
	/* 文件断点续传 */
	checkFile: '/plat/common/versionManage/chunk',
	/* 文件合并 */
	mergeFile: '/plat/common/versionManage/mergeFile'
}

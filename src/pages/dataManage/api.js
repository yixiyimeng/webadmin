export const dataManageapi = {
	/* 获取答題记录 */
	getNotify: '/inte/answerRec/list',
	/* 批量删除答题记录 */
	batchRemoveNotify: '/inte/answerRec/batchRemove',
	/* 删除答题记录 */
	removeNotify: '/inte/answerRec/remove',
	/* 获取接入记录 */
	getAccess: '/inte/clientConnRec/list',
	/* 批量删除接入记录 */
	batchRemoveselfList: '/inte/clientConnRec/batchRemove',
	/* 删除答题记录 */
	removeselfList: 'inte/clientConnRec/remove',
	/* 获取班级维度 */
	getClass: 'inte/answerRec/list_classCount',
	/* 获取校区维度 */
	getSchool: 'inte/answerRec/list_schoolCount',
	exportExcel: 'inte/answerRec/exportClassCount',
	getVoteScorelist: '/inte/voteScoreTitle/list', //根据投票评分
	removeVoteList:'/inte/voteScoreTitle/remove',
	batchRemoveVoteList:'/inte/voteScoreTitle/batchRemove',
	gettestPaperReclist:'/inte/testPaperRec/list',
	batchRemovetestPaperList:'/inte/testPaperRec/batchRemove',
	removetestPaperList:'/inte/testPaperRec/remove',
	voteScoreTitleDetail:'/inte/voteScoreTitle/detail',
	testPaperRecdetails:'/inte/testPaperRec/detail'
}

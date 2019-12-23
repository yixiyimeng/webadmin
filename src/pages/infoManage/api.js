import {
		postAction
	} from '@/api'
export const infoManageapi = {
	/* 获取机构 */
	getOrgList: '/foun/org/list',
    /* 新增机构 */
    addOrg: '/foun/org/save',
    /* 编辑机构 */
    updateOrg: '/foun/org/update',
    /* 批量删除机构  */
    batchRemoveOrg:'/foun/org/batchRemove',
    /* 删除机构 */
    removeOrg:'/foun/org/remove',
    /*获取校区*/
    getSchoolList:'/foun/school/list',
    /* 新增校区 */
    addSchool: '/foun/school/save',
    /* 编辑校区 */
    updateSchool: '/foun/school/update',
    /* 批量删除数据字典  */
    batchRemoveSchool:'/foun/school/batchRemove',
    /* 删除数据字典 */
    removeSchool:'/foun/school/remove',
    /*获取班级*/
    getClassList:'/foun/class/list',
    /* 新增班级 */
    addClass: '/foun/class/save',
    /* 编辑班级 */
    updateClass: '/foun/class/update',
    /* 批量删除班级 */
    batchRemoveClass:'/foun/class/batchRemove',
    /* 删除班级 */
    removeClass:'/foun/class/remove',
    /* 获取学生*/
	getStudent: '/foun/student/list',
    /* 新增学生 */
    addStudent: '/foun/student/save',
    /* 编辑学生 */
    updateStudent: '/foun/student/update',
    /* 批量删除学生  */
    batchRemoveStudent:'/foun/student/batchRemove',
    /* 删除学生 */
    removeStudent:'/foun/student/remove',
    /* 获取备课*/
	getTopic: '/foun/preTopic/list',
    /* 新增备课 */
    addTopic: '/foun/preTopic/save',
    /* 编辑备课 */
    updateTopic: '/foun/preTopic/update',
    /* 批量删除备课  */
    batchRemoveTopic:'/foun/preTopic/batchRemove',
    /* 删除备课 */
    removeTopic:'/foun/preTopic/remove',
	/* 获取试卷*/
	getTestPaper: '/foun/testPaper/list',
	/* 新增试卷 */
	addTestPaper: '/foun/testPaper/save',
	/* 编辑试卷*/
	updateTestPaper: '/foun/testPaper/update',
	/* 批量删除试卷  */
	batchRemoveTestPaper:'/foun/testPaper/batchRemove',
	/* 删除试卷 */
	removeTestPaper:'/foun/testPaper/remove',
	/* 获取试卷题目 */
	getAllTestQuestionList: '/foun/testPaperQuestion/query',
	/* 试卷题目批量更新 */
	testbatchInsertOrUpdate:'/foun/testPaperQuestion/batch_insert_or_update',
	/* 试卷题目删除 */
	removeTestQuestion:'/foun/testPaperQuestion/remove',
    /* 获取题目 */
	getTopicQuestionList: '/foun/preTopicQuestion/list',
	getAllTopicQuestionList: '/foun/preTopicQuestion/query',
	batchInsertOrUpdate:'/foun/preTopicQuestion/batch_insert_or_update',
    /* 新增题目 */
    addTopicQuestion: '/foun/preTopicQuestion/save',
    /* 编辑题目 */
    updateTopicQuestion: '/foun/preTopicQuestion/update',
    /* 批量删除题目  */
    batchRemoveTopicQuestion:'/foun/preTopicQuestion/batchRemove',
    /* 删除题目 */
    removeTopicQuestion:'/foun/preTopicQuestion/remove',
    /*查询机构*/
    getAllorgList:'/foun/org/query',
     /*查询所有校区*/
    getAllshcoolList:'/foun/school/query',
     /*查询所有班级*/
    getAllclassList:'/foun/class/query',
     /*根据机构查询校区*/
    getshcoolByorganization:'/foun/school/list_for_pull_down',
     /*根据校区查询班级*/
    getclassByschool:'/foun/class/list_for_pull_down',
    /*查询所有科目*/
    getAllSubjectList:'/plat/common/dict/getSubject',
    /*学生上传*/
    studentUpload: '/foun/student/save_upload',
    /*试卷文件上传*/
    fileUpload: '/plat/common/preTopic/fileUpload',
	/* 获取课后作业 */
	getofflineTestPaper:'/foun/offlineTestPaper/list/',
	uploadOfflineTestPaper:'/foun/offlineTestPaper/upload',
	batchRemoveOfflineTestPaper:'/foun/offlineTestPaper/batchRemove',
	offlineTestPaperQuestionlist:'/foun/offlineTestPaperQuestion/listQuestion',
	editofflineTestPaperQuestion:'/foun/offlineTestPaperQuestion/edit'
}
export function getAllSubjectList(){
	return postAction(infoManageapi.getAllSubjectList)
}
export function getAllorgList(){
	return postAction(infoManageapi.getAllorgList).then(da=>{
		return da
	})
}
export function getAllshcoolList(paramer){
	return postAction(infoManageapi.getAllshcoolList,paramer)
}
export function getAllclassList(paramer){
	return postAction(infoManageapi.getAllclassList,paramer)
}
export function getshcoolByorganization(paramer){
	return postAction(infoManageapi.getshcoolByorganization,paramer)
}
export function getclassByschool(paramer){
	return postAction(infoManageapi.getclassByschool,paramer)
}

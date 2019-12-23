import {
		postAction
	} from '@/api'
export const sysManageapi = {
	/* 获取用户 */
	getuserList: '/plat/sys/user/list',
	/*重置密码 */
	adminResetPwd: '/plat/sys/user/adminResetPwd ',
	/*校验用户名是否已存在*/
    checkusername:'/plat/sys/user/exist',
	/* 新增用户 */
	adduserList:'/plat/sys/user/save',
	/* 编辑用户 */
	updateuserList:'/plat/sys/user/update',
	/* 批量删除用户   */
	batchRemoveuserList:'/plat/sys/user/batchRemove',
	/* 删除用户  */
	removeuserList:'/plat/sys/user/remove',
	/* 获取角色*/
	getroleList: '/plat/sys/role/list',
	/* 新增角色 */
	addroleList:'/plat/sys/role/save',
	/* 编辑角色 */
	updateroleList:'/plat/sys/role/update',
	/* 批量删除角色   */
	batchRemoveroleList:'/plat/sys/role/batchRemove',
	/* 删除角色  */
	removeroleList:'/plat/sys/role/remove',
	/* 获取菜单 */
	getmenuList: '/plat/sys/menu/list',
	/* 获取菜单树 */
	getmenuTree:'/plat/sys/menu/tree',
	/* 新增菜单 */
	addmenuList:'/plat/sys/menu/save',
	/* 编辑菜单 */
	updatemenuList:'/plat/sys/menu/update',
	/* 批量删除菜单列表   */
	batchRemoveMenuList:'/plat/sys/menu/batchRemove',
	/* 删除菜单列表  */
	removeMenuList:'/plat/sys/menu/remove',
	/*查询菜单树 */
	getmenuTree: '/plat/sys/menu/tree',
	/* 根据角色查询菜单树 */
	getmenuTreeById: '/plat/sys/menu/tree_by_roleId',
	/*查询机构*/
    getAllorgList:'/foun/org/query',
	/* 通过机构查询所有角色 */
	getRolebyOrg:'/plat/sys/user/get_role_by_org',
	/* 查询超级管理员角色id */
	getAdminRoleId:'/plat/sys/user/get_admin'
}
export function getAllorgList(){
	return postAction(sysManageapi.getAllorgList).then(da=>{
		return da
	})
}
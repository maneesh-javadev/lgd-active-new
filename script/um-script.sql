INSERT INTO um.privilege (privilege_code,privilege_name,"action",description,is_active,created_at,created_by,updated_at,updated_by,is_system) VALUES
	 ('RESOURCE_PRIVILEGE','RESOURCE PRIVILEGE','CREATE','',true,'2026-09-23 21:31:52.745',NULL,NULL,NULL,true),
	 ('DASHBOARD_PRIVILEGE','DASHBOARD PRIVILEGE','VIEW','',true,'2026-09-24 06:13:34.379',NULL,NULL,NULL,true),
	 ('USER_MANAGEMENT','USER MANAGEMENT PRIVILEGE','VIEW','',true,'2026-09-24 06:14:22.69',NULL,'2026-09-24 06:15:16.116',NULL,true),
	 ('PRIVILEGE_PRIVILEGE','PRIVILEGE PRIVILEGE','CREATE','',true,'2026-09-24 06:16:10.072',NULL,NULL,NULL,true),
	 ('ROLE_PRIVILEGE','ROLE PRIVILEGE','CREATE','',true,'2026-09-24 06:17:17.086',NULL,NULL,NULL,true),
	 ('USER_PRIVILEGE','USER PRIVILEGE','CREATE','',true,'2026-09-24 06:18:10.869',NULL,NULL,NULL,true),
	 ('CHANGE_PASSWORD_PRIVILEGE','CHANGE PASSWORD PRIVILEGE','CREATE','',true,'2026-09-24 20:55:53.264',NULL,NULL,NULL,true);
INSERT INTO um.privilege_resource (privilege_id,resource_id,created_at,created_by) VALUES
	 (2,1,'2026-10-22 09:50:36.142848',NULL),
	 (3,2,'2026-10-22 09:50:36.146764',NULL),
	 (1,3,'2026-10-22 09:50:36.148012',NULL),
	 (1,6,'2026-10-22 09:50:36.148525',NULL),
	 (1,7,'2026-10-22 09:50:36.149416',NULL),
	 (1,8,'2026-10-22 09:50:36.149808',NULL),
	 (1,9,'2026-10-22 09:50:36.151174',NULL),
	 (1,10,'2026-10-22 09:50:36.151547',NULL),
	 (4,31,'2026-10-22 09:50:36.15184',NULL),
	 (4,33,'2026-10-22 09:50:36.152245',NULL);
INSERT INTO um.privilege_resource (privilege_id,resource_id,created_at,created_by) VALUES
	 (4,34,'2026-10-22 09:50:36.15256',NULL),
	 (4,35,'2026-10-22 09:50:36.152838',NULL),
	 (4,36,'2026-10-22 09:50:36.153122',NULL),
	 (4,37,'2026-10-22 09:50:36.153426',NULL),
	 (5,4,'2026-10-22 09:50:36.153732',NULL),
	 (5,11,'2026-10-22 09:50:36.154042',NULL),
	 (5,12,'2026-10-22 09:50:36.154341',NULL),
	 (5,13,'2026-10-22 09:50:36.15463',NULL),
	 (5,14,'2026-10-22 09:51:16.620151',NULL),
	 (5,15,'2026-10-22 09:51:16.624761',NULL);
INSERT INTO um.privilege_resource (privilege_id,resource_id,created_at,created_by) VALUES
	 (5,16,'2026-10-22 09:51:16.625518',NULL),
	 (5,17,'2026-10-22 09:51:16.625948',NULL),
	 (5,18,'2026-10-22 09:51:16.626306',NULL),
	 (5,19,'2026-10-22 09:51:16.626655',NULL),
	 (5,20,'2026-10-22 09:51:16.626952',NULL),
	 (5,21,'2026-10-22 09:51:16.62725',NULL),
	 (5,22,'2026-10-22 09:51:16.627536',NULL),
	 (6,31,'2026-10-22 09:51:16.627812',NULL),
	 (6,33,'2026-10-22 09:51:16.628154',NULL),
	 (6,34,'2026-10-22 09:51:27.725905',NULL);
INSERT INTO um.privilege_resource (privilege_id,resource_id,created_at,created_by) VALUES
	 (6,35,'2026-10-22 09:51:27.727626',NULL),
	 (6,36,'2026-10-22 09:51:27.728264',NULL),
	 (6,37,'2026-10-22 09:51:27.729101',NULL),
	 (7,32,'2026-10-22 09:52:34.179072',NULL),
	 (6,5,'2026-10-22 10:06:06.729444',NULL),
	 (6,23,'2026-10-22 10:58:03.505732',NULL),
	 (6,24,'2026-10-22 11:02:54.138759',NULL),
	 (6,29,'2026-10-22 11:04:11.574757',NULL),
	 (6,30,'2026-10-22 11:04:49.228757',NULL),
	 (6,26,'2026-10-22 11:57:42.086833',NULL);
INSERT INTO um.privilege_resource (privilege_id,resource_id,created_at,created_by) VALUES
	 (6,27,'2026-10-22 11:58:56.117673',NULL);
INSERT INTO um.resource (resource_code,resource_name,resource_type,service_name,api_path,http_method,frontend_route,parent_resource_id,description,is_active,created_at,created_by,updated_at,updated_by,display_order,icon,is_system) VALUES
	 ('DASHBOARD_MENU','Dashboard','MENU',NULL,NULL,NULL,'/dashboard',NULL,'',true,'2026-09-22 19:23:23.421',0,'2026-09-22 13:53:22.646',0,1,'dashboard',true),
	 ('USER_MENAGEMENT_MENU','User Management','MENU',NULL,NULL,NULL,'/user-management',NULL,'',true,'2026-09-22 19:24:58.992',0,'2026-09-22 13:54:58.948',0,2,'manage_accounts',true),
	 ('RESOURCE_MENU','Resource','MENU',NULL,NULL,NULL,'/user-management/resource',2,'',true,'2026-09-22 19:26:41.726',0,'2026-09-22 13:56:41.697',0,3,'account_tree',true),
	 ('ROLE_MENU','Role','MENU',NULL,NULL,NULL,'/user-management/role',2,'',true,'2026-09-22 19:28:04.673',0,'2026-09-22 13:58:04.644',0,5,'badge',true),
	 ('USERS_MENU','Users','MENU',NULL,NULL,NULL,'/user-management/users',2,'',true,'2026-09-22 19:30:24.023',0,'2026-09-22 14:00:23.991',0,6,'person',true),
	 ('SVAE_RESOURCE_API','Save Resource API','API','user-management','/private/v1/resources','POST',NULL,NULL,'',true,'2026-09-22 19:54:39.046',0,'2026-09-22 14:24:38.797',0,0,NULL,true),
	 ('MANAGE_RESOURCE_API','Manage Resource API','API','user-management','/private/v1/resources','GET',NULL,NULL,'',true,'2026-09-22 19:58:49.933',0,'2026-09-22 14:28:49.908',0,0,NULL,true),
	 ('ROLE_CREATE_API','ROLE CREATE API','API','user-management','/private/v1/roles','POST',NULL,NULL,'',true,'2026-09-22 20:11:08.299',0,'2026-09-22 14:41:08.27',0,0,NULL,true),
	 ('ROLE_LIST_API','ROLE LIST API','API','user-management','/private/v1/roles','GET',NULL,NULL,'',true,'2026-09-22 20:12:30.495',0,'2026-09-22 14:42:30.466',0,0,NULL,true),
	 ('ROLE_GET_BY_CODE_API','ROLE GET BY CODE API','API','user-management','/private/v1/roles/code/**','GET',NULL,NULL,'',true,'2026-09-22 20:15:35.115',0,'2026-09-22 14:45:35.094',0,0,NULL,true);
INSERT INTO um.resource (resource_code,resource_name,resource_type,service_name,api_path,http_method,frontend_route,parent_resource_id,description,is_active,created_at,created_by,updated_at,updated_by,display_order,icon,is_system) VALUES
	 ('ROLE_TOGGLE_STATUS_API','ROLE TOGGLE STATUS API','API','user-management','/private/v1/roles/*/togglestatus','GET',NULL,NULL,'',true,'2026-09-22 20:20:55.218',0,'2026-09-22 14:50:55.193',0,0,NULL,true),
	 ('ROLE_ACTIVE_LIST_API','ROLE ACTIVE LIST API','API','user-management','/private/v1/roles/active','GET',NULL,NULL,'',true,'2026-09-22 20:21:57.596',0,'2026-09-22 14:51:57.566',0,0,NULL,true),
	 ('ROLE_BY_LEVEL_API','ROLE BY LEVEL API','API','user-management','/private/v1/roles/level/**','GET',NULL,NULL,'',true,'2026-09-22 20:23:29.544',0,'2026-09-22 14:53:29.514',0,0,NULL,true),
	 ('ROLE_BY_TYPE_API','ROLE BY TYPE API','API','user-management','/private/v1/roles/type/**','GET',NULL,NULL,'',true,'2026-09-22 20:25:21.383',0,'2026-09-22 14:55:21.364',0,0,NULL,true),
	 ('ROLE_HISTORY_API','ROLE HISTORY API','API','user-management','/private/v1/roles/*/history','GET',NULL,NULL,'',true,'2026-09-22 20:26:32.291',0,'2026-09-22 14:56:32.275',0,0,NULL,true),
	 ('ROLE_HISTORY_VERSION_API','ROLE HISTORY VERSION API','API','user-management','/private/v1/roles/*/history/version/**','GET',NULL,NULL,'',true,'2026-09-22 20:27:50.873',0,'2026-09-22 14:57:50.843',0,0,NULL,true),
	 ('USER_CREATE_API','Create User API','API','user-management','/private/v1/users','POST',NULL,NULL,'Creates a new user',true,'2026-09-22 21:11:52.592',NULL,NULL,NULL,0,NULL,true),
	 ('USER_GET_BY_LOGIN_ID_API','Get User By Login ID API','API','user-management','/private/v1/users/loginid/**','GET',NULL,NULL,'Retrieves a user by login ID',true,'2026-09-22 21:11:52.592',0,'2026-09-22 21:29:33.125',0,0,NULL,true),
	 ('ROLE_LEVEL_LIST_API','List Role Levels API','API','user-management','/private/v1/role-levels','GET',NULL,NULL,'Retrieves all role levels',true,'2026-09-22 21:33:47.8',NULL,NULL,NULL,0,NULL,true),
	 ('USER_GET_API','Get User API','API','user-management','/private/v1/users/{id}','GET',NULL,NULL,'Retrieves a user by user ID',true,'2026-09-22 21:11:52.592',0,'2026-09-22 21:28:34.13',0,0,NULL,true);
INSERT INTO um.resource (resource_code,resource_name,resource_type,service_name,api_path,http_method,frontend_route,parent_resource_id,description,is_active,created_at,created_by,updated_at,updated_by,display_order,icon,is_system) VALUES
	 ('USER_UPDATE_API','Update User API','API','user-management','/private/v1/users/update','POST',NULL,NULL,'Updates an existing user',true,'2026-09-22 21:11:52.592',0,'2026-09-22 21:28:53.446',0,0,NULL,true),
	 ('USER_DELETE_API','Delete User API','API','user-management','/private/v1/users/delete/{id}','POST',NULL,NULL,'Deletes a user',true,'2026-09-22 21:11:52.592',0,'2026-09-22 21:29:13.044',0,0,NULL,true),
	 ('UPDATE_RESOURCE_API','Update Resource API','API','user-management','/private/v1/resources/update','POST',NULL,NULL,'',true,'2026-09-22 20:01:49.398',0,'2026-09-22 20:02:14.331',0,0,NULL,true),
	 ('DELETE_RESOURCE_API','Delete Resource API','API','user-management','/private/v1/resources/delete/{id}','POST',NULL,NULL,'',true,'2026-09-22 20:03:33.697',0,'2026-09-22 14:33:33.675',0,0,NULL,true),
	 ('FETCH_RESOURCE_API','Fetch Resource API','API','user-management','/private/v1/resources/{id}','GET',NULL,NULL,'',true,'2026-09-22 20:07:18.834',0,'2026-09-22 14:37:18.811',0,0,NULL,true),
	 ('ROLE_GET_API','ROLE GET API','API','user-management','/private/v1/roles/{id}','GET',NULL,NULL,'',true,'2026-09-22 20:13:35.897',0,'2026-09-22 14:43:35.859',0,0,NULL,true),
	 ('ROLE_UPDATE_API','ROLE UPDATE API','API','user-management','/private/v1/roles/update','POST',NULL,NULL,'',true,'2026-09-22 20:17:02.038',0,'2026-09-22 14:47:02.014',0,0,NULL,true),
	 ('ROLE_DELETE_API','ROLE DELETE API','API','user-management','/private/v1/roles/delete/{id}','POST',NULL,NULL,'',true,'2026-09-22 20:18:42.435',0,'2026-09-22 14:48:42.408',0,0,NULL,true),
	 ('ROLE_TYPE_LIST_API','List Role Types API','API','user-management','/private/v1/role-types','GET',NULL,NULL,'Retrieves all role types',true,'2026-09-22 21:35:14.982',NULL,NULL,NULL,0,NULL,true),
	 ('PRIVILEGE_MENU','Privilege ','MENU',NULL,NULL,NULL,'/user-management/privilege',2,NULL,true,'2026-09-23 19:51:40.164',0,'2026-09-22 14:00:23.991',0,4,'lock_person',true);
INSERT INTO um.resource (resource_code,resource_name,resource_type,service_name,api_path,http_method,frontend_route,parent_resource_id,description,is_active,created_at,created_by,updated_at,updated_by,display_order,icon,is_system) VALUES
	 ('CHANGE_PASSWORD','CHANGE PASSWORD','MENU',NULL,NULL,NULL,'/user-management/change-password',2,'',true,'2026-09-24 20:19:02.504',0,'2026-09-24 14:49:02.477',0,7,'password',true),
	 ('UM_PRIVILEGE_CREATE','Create Privilege','API','user-management-service','/private/v1/privileges','POST',NULL,NULL,'Create a new privilege',true,'2026-10-21 10:52:32.162',NULL,NULL,NULL,1,NULL,true),
	 ('UM_PRIVILEGE_UPDATE','Update Privilege','API','user-management-service','/private/v1/privileges/update','POST',NULL,NULL,'Update an existing privilege',true,'2026-10-21 10:52:32.162',NULL,NULL,NULL,2,NULL,true),
	 ('UM_PRIVILEGE_GET_BY_ID','Get Privilege By ID','API','user-management-service','/private/v1/privileges/{id}','GET',NULL,NULL,'Retrieve privilege details by ID',true,'2026-10-21 10:52:32.162',NULL,NULL,NULL,3,NULL,true),
	 ('UM_PRIVILEGE_GET_ALL','Get All Privileges','API','user-management-service','/private/v1/privileges','GET',NULL,NULL,'Retrieve all privileges',true,'2026-10-21 10:52:32.162',NULL,NULL,NULL,4,NULL,true),
	 ('UM_PRIVILEGE_DELETE','Delete Privilege','API','user-management-service','/private/v1/privileges/delete/{id}','POST',NULL,NULL,'Delete a privilege if it is not assigned to a role',true,'2026-10-21 10:52:32.162',NULL,NULL,NULL,5,NULL,true),
	 ('USER_LIST_API','List Users API','API','user-management','/private/v1/users','GET',NULL,NULL,'Retrieves all users',true,'2026-09-22 21:11:52.592',NULL,NULL,NULL,0,NULL,true);
INSERT INTO um."role" (role_code,role_name,description,is_active,created_at,created_by,updated_at,updated_by,role_level_code,role_type_code,created_ip,updated_ip,is_system) VALUES
	 ('user-admin','user admin','',true,'2026-09-23 22:36:07.317',NULL,'2026-09-24 21:01:07.291',NULL,'C','N',NULL,'::1'::inet,true);
INSERT INTO um.role_level_master (role_level_code,role_level_name,description,display_order,is_active,created_at,created_by,updated_at,updated_by,created_ip,updated_ip) VALUES
	 ('R','Revenue','Revenue level',1,true,'2026-09-19 05:55:27.736',NULL,NULL,NULL,NULL,NULL),
	 ('P','PRI','Panchayati Raj Institution',2,true,'2026-09-19 05:55:27.736',NULL,NULL,NULL,NULL,NULL),
	 ('U','ULB','Urban Local Body',3,true,'2026-09-19 05:55:27.736',NULL,NULL,NULL,NULL,NULL),
	 ('T','Tehsil','Tehsil level',4,true,'2026-09-19 05:55:27.736',NULL,NULL,NULL,NULL,NULL),
	 ('B','Block','Block level',5,true,'2026-09-19 05:55:27.736',NULL,NULL,NULL,NULL,NULL),
	 ('S','SIO','SIO level',6,true,'2026-09-19 05:55:27.736',NULL,NULL,NULL,NULL,NULL),
	 ('A','System Admin','System Administrator level',7,true,'2026-09-19 05:55:27.736',NULL,NULL,NULL,NULL,NULL),
	 ('C','Center','Center level',8,true,'2026-09-19 05:55:27.736',NULL,NULL,NULL,NULL,NULL),
	 ('E','Constitution','Constitution level',9,true,'2026-09-19 05:55:27.736',NULL,NULL,NULL,NULL,NULL),
	 ('M','Super Admin','Super Administrator level',10,true,'2026-09-19 05:55:27.736',NULL,NULL,NULL,NULL,NULL);
INSERT INTO um.role_level_master (role_level_code,role_level_name,description,display_order,is_active,created_at,created_by,updated_at,updated_by,created_ip,updated_ip) VALUES
	 ('D','Department','Department level',11,true,'2026-09-19 05:55:27.736',NULL,NULL,NULL,NULL,NULL),
	 ('X','DCO','DCO level',12,true,'2026-09-19 05:55:27.736',NULL,NULL,NULL,NULL,NULL),
	 ('Y','RCI','RCI level',13,true,'2026-09-19 05:55:27.736',NULL,NULL,NULL,NULL,NULL),
	 ('Z','Postal Division','Postal Division level',14,true,'2026-09-19 05:55:27.736',NULL,NULL,NULL,NULL,NULL),
	 ('O','Other','Other role level',15,true,'2026-09-19 05:55:27.736',NULL,NULL,NULL,NULL,NULL);
INSERT INTO um.role_privilege (role_id,privilege_id,is_active,created_at,created_by,updated_at,updated_by,created_ip,updated_ip) VALUES
	 (1,1,true,'2026-10-22 09:56:35.44929',NULL,NULL,NULL,NULL,NULL),
	 (1,2,true,'2026-10-22 09:56:35.452904',NULL,NULL,NULL,NULL,NULL),
	 (1,3,true,'2026-10-22 09:56:35.453799',NULL,NULL,NULL,NULL,NULL),
	 (1,4,true,'2026-10-22 09:56:35.455167',NULL,NULL,NULL,NULL,NULL),
	 (1,5,true,'2026-10-22 09:56:35.456147',NULL,NULL,NULL,NULL,NULL),
	 (1,6,true,'2026-10-22 09:56:35.457264',NULL,NULL,NULL,NULL,NULL),
	 (1,7,true,'2026-10-22 09:56:35.458039',NULL,NULL,NULL,NULL,NULL);
INSERT INTO um.role_type_master (role_type_code,role_type_name,description,display_order,is_active,created_at,created_by,updated_at,updated_by,created_ip,updated_ip) VALUES
	 ('C','Checker','Role responsible for checking/verification',1,true,'2026-09-19 05:56:16.687',NULL,NULL,NULL,NULL,NULL),
	 ('M','Maker','Role responsible for creating/processing',2,true,'2026-09-19 05:56:16.687',NULL,NULL,NULL,NULL,NULL),
	 ('N','None','Role without Maker/Checker classification',3,true,'2026-09-19 05:56:16.687',NULL,NULL,NULL,NULL,NULL);
INSERT INTO um.user_profile (user_profile_name,designation,mobile_no,email_id,state_code,created_by,created_on,modified_by,modified_on,user_id,is_email_verified,is_mobile_no_verified,maker_checker_status,login_time,ip_address,user_type,"level",district_code,nodal_officer_id) VALUES
	 ('Suraj Rao','State SIO','9856984543','suraj.rao@nic.in',28,3,'2026-09-24 21:43:38.779',3,'2026-09-24 21:43:38.779',3,true,true,'M','2026-09-24 21:43:38.779','0.0.0.1','S','R',0,NULL),
	 ('Abhishek Verma','State SIO','8898073432','abhi234verma@hotmail.com',5,4,'2026-09-24 21:43:38.779',4,'2026-09-24 21:43:38.779',4,true,true,'M','2026-09-24 21:43:38.779','0.0.0.1','S','R',0,NULL),
	 ('Maneesh Kumar','Team Lead','8130320689','kumar.maneesh1984@gmail.com',0,1,'2026-09-24 21:43:38.779',1,'2026-09-24 21:43:38.779',1,true,true,'N','2026-09-24 21:43:38.779','0.0.0.1','C','C',0,NULL);
INSERT INTO um.user_role_mapping (user_id,role_id,is_active,created_on,created_by,last_updated_on,last_updated_by,ip_created,ip_updated) VALUES
	 (1,1,true,'2026-10-22 10:00:26.256474',NULL,NULL,NULL,NULL,NULL);
INSERT INTO um.users (user_login_id,password_hash,state_code,district_code,specific_role_id,specific_org_unit_code,specific_admin_unit_entity_code,user_level,created_on,created_by,last_updated_on,last_updated_by,ip_created,ip_updated,is_active,is_deleted,is_system) VALUES
	 ('CG-USER-ADMIN','$2a$10$YgI2BNHyaAJJAGQDORKJs.ydPuJobXMc5MdE8OlkFbg13.Nog9piq',NULL,NULL,1,NULL,NULL,'Center','2026-09-23 22:48:53.145',NULL,NULL,NULL,NULL,NULL,true,false,true);

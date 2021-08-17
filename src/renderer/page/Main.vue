<template>
	<div>
		<h1>我的工具</h1>
		<div>
			<h2>司机端</h2>
			<el-button @click="cmd(driver)" type="primary">driver 252环境打包上传</el-button>
			<el-button @click="cmd(driver_vr3)" type="primary">driver vr3环境打包上传</el-button>
			<el-button @click="cmd(driver_47)" type="warning">driver 线上环境打包上传</el-button>
		</div>
		<div>
			<h2>pda端</h2>
			<el-button @click="cmd(pda)" type="primary">pda 252环境打包上传</el-button>
			<el-button @click="cmd(pda_vr3)" type="primary">pda vr3环境打包上传</el-button>
			<el-button @click="cmd(pda_47)" type="warning">pda 线上环境打包上传</el-button>
		</div>
		<div>
			<h2>收派件app端</h2>
			<el-button @click="cmd(dispatcher)" type="primary">app 252环境打包上传</el-button>
			<el-button @click="cmd(dispatcher_vr3)" type="primary">app vr3环境打包上传</el-button>
			<el-button @click="cmd(dispatcher_47)" type="warning">app 线上环境打包上传</el-button>
		</div>
		<!-- <el-button @click="jsontest" type="warning">json</el-button> -->
		<!-- <el-button @click="rename" type="warning">json</el-button> -->
	</div>
</template>

<script>
	import cmd from '../json/command.json' //cmd命令
	import server from '../json/server.js'	//服务器配置
	const fs = require('fs');
	const iconv = require('iconv-lite'); 
	var process = require('child_process');
	var Client = require('ssh2-sftp-client');
	export default {
		name: "",
		data() {
			return {
				driver: {
					cmd: cmd.diever.cmd_driver_252,
					localPath: "G:/zhqc/zhqc_driver/dist",
					romotePath: "/opt/zhqc-cloud-test/jyh-ems-driver/page/",
					config: server.server_252
				},
				driver_vr3: {
					cmd: cmd.diever.cmd_driver_vr3,
					localPath: "G:/zhqc/zhqc_driver/dist",
					romotePath: "/home/zhqc/pages/jyh-ems/driver/",
					config: server.server_vr3
				},
				driver_47: {
					cmd: cmd.diever.cmd_driver_47,
					localPath: "G:/zhqc/zhqc_driver/dist",
					romotePath: "/home/ems/pages/jyh-ems-driver/page/",
					config: server.server_47
				},
				pda: {
					cmd: cmd.pda.cmd_pda_252,
					localPath: "G:/zhqc/operator-pda/dist",
					romotePath: "/opt/zhqc-cloud-test/jyh-ems-opt/page/",
					config: server.server_252
				},
				pda_vr3: {
					cmd: cmd.pda.cmd_pda_vr3,
					localPath: "G:/zhqc/operator-pda/dist",
					romotePath: "/home/zhqc/pages/jyh-ems/pda/",
					config: server.server_vr3
				},
				pda_47: {
					cmd: cmd.pda.cmd_pda_47,
					localPath: "G:/zhqc/operator-pda/dist",
					romotePath: "/home/ems/pages/jyh-ems-opt/page/",
					config: server.server_47
				},
				dispatcher: {
					cmd: cmd.dispatcher.cmd_dis_252,
					localPath: "G:/zhqc/devapp/dispatcher-app/dist",
					romotePath: "/opt/zhqc-cloud-test/jyh-ems-dispatcher/page/",
					config: server.server_252
				},
				dispatcher_vr3: {
					cmd: cmd.dispatcher.cmd_dis_vr3,
					localPath: "G:/zhqc/devapp/dispatcher-app/dist",
					romotePath: "/home/zhqc/pages/jyh-ems/dispatcher/",
					config: server.server_vr3
				},
				dispatcher_47: {
					cmd: cmd.dispatcher.cmd_dis_47,
					localPath: "G:/zhqc/devapp/dispatcher-app/dist",
					romotePath: "/home/ems/pages/jyh-ems-dispatcher/page/",
					config: server.server_47
				},
			}
		},
		methods: {
			async rename(){
				let sftp = new Client();
				await sftp.connect(this.dispatcher.config).then(() => {
				
				let res = sftp.rename("/opt/zhqc-cloud-test/xywl/test_zhqc/", "/opt/zhqc-cloud-test/xywl/test_zhqa/");
				return res;
				}).then((data) => {

					sftp.end();
				}).catch((err) => {
					this.$message.error(err+"");
				});
			},
			jsontest(){
				let temp = fs.readFileSync("command.json");
				 let str = iconv.decode(temp,'GBK');
				 console.log(str)
			},
			async deltest(){
			let sftp = new Client();
			await sftp.connect(this.dispatcher.config).then(() => {
				let res =  sftp.rmdir("/opt/zhqc-cloud-test/xywl/test/",true);
				return res;
			}).then((data) => {
				let res = sftp.mkdir("/opt/zhqc-cloud-test/xywl/test", true);
				return res;
			}).then((data) => {
				 let res = sftp.uploadDir(this.dispatcher.localPath, "/opt/zhqc-cloud-test/xywl/test/");
				return res;
			})
			.then((data) => {
				sftp.end();
			}).catch((err) => {
				console.log(err)
				this.$message.error(err+"");
			});
			},
			async cmd(obj) {
				await this.cmdBuild(obj);
			},
			async cmdBuild(obj) {
				let loading = this.$loading({
					lock: false,
					text: '正在打包....',
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, 0.7)'
				});
				await process.exec(obj.cmd,
					(error, stdout, stderr) => {
						if (stdout) {
						loading.close();
						this.putData(obj);
						}else{
						loading.close();
						this.$message.error(error+"");	
						}
					});
			},
			async putData(obj) {
				let loading = this.$loading({
					lock: false,
					text: '正在上传....',
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, 0.7)'
				});
				let sftp = new Client();
				await sftp.connect(obj.config).then(() => {
					// 上传文件
					let res = sftp.uploadDir(obj.localPath, obj.romotePath);
					return res;
				}).then((data) => {
					loading.close();
					this.$message({
					  message: '上传成功',
					  type: 'success'
					   });
					sftp.end();
				}).catch((err) => {
					loading.close();
					this.$message.error(err+"");
				});

			}
		}
	}
</script>

<style>
	h1 {
		text-align: center;
	}
</style>

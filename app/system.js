/**
 * Copyright 2017 IBM All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an 'AS IS' BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
'use strict';
var log4js = require('log4js');
var logger = log4js.getLogger('Helper');
logger.setLevel('DEBUG');

var re = require('./response.js')
var os = require('os')

var getSystemMessage = async function () {
	try {
        let system = {
            freeMem: 0, //内存剩余量
            totalMem: 0, //内存总量
            cpu: 0, //cpu使用率
            arch: '', //cpu架构
            sysName: '' //操作系统名称
        }
        system.freeMem = os.freemem()
        system.totalMem = os.totalmem()
        system.arch = os.arch()
        system.sysName = os.type()
        cpuMetrics().then(res => {
            system.cpu = res
        })
		logger.debug(system)
		return re.responseSuccess(system)
	}catch (error){
		logger.debug(error)
		return re.responseFail(error.toString())
	}

}
// 获取当前的瞬时CPU时间
const instantaneousCpuTime = () => {
    let idleCpu = 0
    let tickCpu = 0
    const cpus = os.cpus()
    const length = cpus.length
    let i = 0
    while (i < length) {
        let cpu = cpus[i]
        for (let type in cpu.times) {
            tickCpu += cpu.times[type]
        }
        idleCpu += cpu.times.idle
        i++
    }
    const time = {
        idle: idleCpu / cpus.length,
        tick: tickCpu / cpus.length
    }
    return time
}

const cpuMetrics = () => {
    const startQuantize = instantaneousCpuTime()
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const endQuantize = instantaneousCpuTime()
            const idleDifference = endQuantize.idle - startQuantize.idle
            const tickDifference = endQuantize.tick - startQuantize.tick
            resolve(1 - (idleDifference / tickDifference))
        }, 1000)
    })
}


exports.getSystemMessage = getSystemMessage

/** Copyright 2020 Zhejiang Lab. All Rights Reserved.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================
*/


import request from '@/utils/request'
import { parseTime, convertArray2String } from "@/utils/index"
import { setIsDialogOpen, setDialogContent } from '@/store/utils'
// initial state
const state = {
    task_details: {},
    errors: "",
    is_dialog_open: false,
    dialog_content: "",
    vis_data: [],
    stage: [],
    log_data: [],
}

// getters
const getters = {
}

// actions
const actions = {
    getTaskDetails({ commit, state }, task_id) {
        console.log("get task details", task_id)
        request.get(`/api/task/task_details`, {
            params: {
                task_id: task_id
            }
        })
            .then((response) => {
                console.log("task_details", response.data);
                let task_details = response.data;
                task_details.created_time = parseTime(task_details.created_time);
                task_details.started_time = parseTime(task_details.started_time);
                task_details.completed_time = parseTime(task_details.completed_time);
                if (task_details.tasks && task_details.tasks.length) {
                    task_details.tasks = task_details.tasks.reduce(convertArray2String);
                }
                else {
                    task_details.tasks = "--";
                }
                if (task_details.teacher_models && task_details.teacher_models.length) {
                    task_details.teacher_models = task_details.teacher_models.reduce(convertArray2String);
                }
                else {
                    task_details.teacher_models = "--";
                }
                if (task_details.datasets && task_details.datasets.length) {
                    task_details.datasets = task_details.datasets.reduce(convertArray2String);
                }
                else {
                    task_details.datasets = '--';
                }
                if (task_details.student_models && task_details.student_models.length) {
                    task_details.student_models = task_details.student_models.reduce(convertArray2String);
                }
                else {
                    task_details.student_models = '--';
                }

                task_details.algorithms.fields = task_details.algorithms.fields.filter(f => (f.field_value != ""))

                console.log("traininglog", task_details.log)
                if (task_details.log) {
                    console.log("set training log")
                    commit("setTrainingLog", task_details.log)
                }
                console.log("visdata", task_details.vis_data)
                if (task_details.vis_data) {
                    console.log("set vis data")
                    commit("setVisData", task_details.vis_data)
                }
                if (task_details.stage) {
                    console.log("set stage")
                    commit("setStage", task_details.stage)
                }
                commit("setTaskDetails", task_details)
            })
            .catch((errors) => {
                console.log("error", errors)
                commit("setTaskDetails", {})
                commit("setErrors", errors)
                commit("setIsDialogOpen", true)
                commit("setDialogContent", "任务不存在或无权限")
            })
    },
    deleteReorgTasks({ dispatch, commit, state }, task_ids) {
        console.log("tasks", task_ids)
        request.delete(`/api/task/reorg_tasks`, {
            params: { task_ids: task_ids }
        })
            .then((response) => {
                console.log("delete success")
                commit("setIsDialogOpen", true)
                commit("setDialogContent", "删除成功")
            })
            .catch((errors) => {
                console.log("delete failure")
                commit("setErrors", errors)
                commit("setIsDialogOpen", true)
                commit("setDialogContent", "删除失败")
            })
    },
}

const mutations = {
    setTaskDetails(state, task_details) {
        state.task_details = task_details
    },
    setErrors(state, errors) {
        state.errors = errors
    },
    setTrainingLog(state, log) {
        state.log_data = log
    },
    setVisData(state, vis_data) {
        state.vis_data = vis_data;
    },
    setStage(state, stage) {
        state.stage = stage;
    },
    setIsDialogOpen, setDialogContent
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
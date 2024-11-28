<template>
    <div>
        <el-row
            style="
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 20px;
            "
        >
        <h2 style="font-size: 24px">团队管理</h2>
        <el-button
            type="primary"
            @click="showCreateTeamDialog"
            style="font-size: 18px; padding: 20px"
            >创建团队</el-button
        >
        </el-row>
        <!-- 展示团队信息  -->
        <div v-if="teams.data.length > 0">
            <el-table :data="teams.data" style="width: 100%">
                <el-table-column prop="team_name" label="团队名"></el-table-column>
                <el-table-column prop="leader" label="队长"></el-table-column>
                <el-table-column label="队员">  <!-- 队员展示前三个，但是这里的函数可能有问题 -->
                    <template v-slot="scope">
                        <div>
                            <!-- 获取前三个队员并用逗号连接，超过三个则显示省略号 -->
                            <span v-for="(member, index) in getTopThreeMembers(scope.row.team_members_name)" :key="index">
                                {{ member }}
                                <!-- 如果不是最后一个成员并且成员超过一个，才添加逗号 -->
                                <span v-if="index < getTopThreeMembers(scope.row.team_members_name).length - 1">, </span>
                            </span>
                            <!-- 如果成员超过三个，则添加省略号 -->
                            <span v-if="scope.row.team_members_name.length > 3">...</span>
                        </div>
                        <!-- <div v-for="(member, index) in getTopThreeMembers(scope.row.team_members_name)" :key="index">
                            {{ member }}
                        </div> -->
                    </template> 
                </el-table-column>  
            </el-table>
        </div>
        <div v-else>暂无团队信息</div>
        
        <!-- 创建团队弹窗 -->
            <el-dialog title="创建团队" v-model="createTeamDialogVisible" width="45%">
                <el-form 
                ref="newTeamForm" 
                :model="newTeam" 
                label-width="120px"
                >

                    <el-form-item label="团队名" prop="team_name">
                        <el-input v-model="newTeam.team_name" placeholder="请输入团队名"></el-input>
                    </el-form-item>

                    <el-form-item label="队长" prop="leader">
                        <el-input v-model="newTeam.leader"></el-input>
                    </el-form-item>
                    
                    <el-form-item
                        v-for="(member, index) in newTeam.members"
                        :key="index"
                        :label="'队员' + (index + 1)"
                    >
                    <el-input v-model="member.value" />
                    <el-button @click.prevent="removeMember(member)"> 删除队员 </el-button>
                    </el-form-item>

                    <!-- 表单提交 -->
                    <el-form-item>
                        <el-button type="primary" @click="handleSubmitTeamForm">提交</el-button>
                        <el-button @click.prevent="addMember"> 添加队员 </el-button>
                    </el-form-item>

                </el-form>
                
            </el-dialog>
      
    </div>
</template>

<script setup>
import { ref, onMounted, reactive, defineProps, defineEmits, watch  } from "vue";
import { ElMessage } from "element-plus";
import { useCompeition } from "../../../composables/useCompeition";

const { 
    getTeams,
    submitTeam,
} = useCompeition();

// 定义 props，接收父组件传递的 teams 数据
const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
    default: () => ({
      data: []
    })
  }
});

// 定义 emits，用来触发 `update:modelValue` 事件
const emit = defineEmits();

const teams = props.modelValue; // 父子双向同步，定义在父组件，接收父组件传递的 teams 数据


// 监听 teams.data 的变化，并通过 emit 同步回父组件
watch(() => teams.data, (newTeams) => {
  emit('update:modelValue', { data: newTeams });
}, { deep: true });  // deep: true 确保监听嵌套数据的变化


// 创建团队弹窗相关
const createTeamDialogVisible = ref(false);
// const newTeam = reactive({
//     team_name: "",
//     leader: "",
//     members: [],
// });

const newTeam = reactive({
    team_name: "",
    leader: "",
    members:[
        {
            key: 1,
            value: '',
        },
    ],
});

const resetnewTeam = () => {
    newTeam.team_name = "";
    newTeam.leader = "";
    newTeam.members = [
        {
            key: 1,
            value: '',
        },
    ];
};

const showCreateTeamDialog = () => {
    createTeamDialogVisible.value = true;
    resetnewTeam();
};

const removeMember = (item) => {
    const index = newTeam.members.indexOf(item)
    if (index !== -1) {
        newTeam.members.splice(index, 1)
    }
};

const addMember = () => {
    newTeam.members.push({
        key: newTeam.members.length + 1,
        value: '',
    });
};

const handleSubmitTeamForm = async () => {
    console.log(newTeam);
    // 发送请求
    if (
        !newTeam.team_name || 
        !newTeam.leader || 
        newTeam.members.length === 0
    ) {
        ElMessage.error("请填写完整信息");
        return;
    }
    await submitTeam(newTeam, createTeamDialogVisible);
    getTeams(teams);
    resetnewTeam();
    // 自动刷新页面
    window.location.reload();
};


// 以上为创建团队弹窗相关

onMounted(() => {
    getTeams(teams);
    console.log("TeamManagement mounted");
    console.log(teams);
});

const getTopThreeMembers = (members) => {
    // 如果 members 是 undefined 或 null，返回空数组
    if (!Array.isArray(members)) {
            console.warn('members is not an array:', members);
            return [];
    }
        
    // 返回前 3 个成员
    return members.slice(0, 3);
};



</script>
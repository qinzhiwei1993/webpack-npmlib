<template>
  <div>
    <el-button-group>
      <el-button type="primary" icon="el-icon-arrow-left">上一页</el-button>
      <el-button type="primary">
        下一页
        <i class="el-icon-arrow-right el-icon--right"></i>
      </el-button>
    </el-button-group>
    <el-button-group>
      <el-button type="primary" icon="el-icon-edit"></el-button>
      <el-button type="primary" icon="el-icon-share"></el-button>
      <el-button type="primary" icon="el-icon-delete"></el-button>
    </el-button-group>
    <button class="my-btn">MyButton</button>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  name: 'MyButton',
  mounted(){
    let chunk = _.chunk(['a', 'b', 'c', 'd'], 2);
    console.log('chunk', chunk)
  }
}
</script>

<style lang="less" scoped>
.my-btn {
  font-size: 30px;
  color: red;
}
</style>
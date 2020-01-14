<template>
    <div class="add">
        <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods' }">商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card class="card-add">
        <el-alert show-icon title="添加商品信息" center type="info"></el-alert>
        <!-- 步骤条区域 -->
        <el-steps :active="activeIndex - 0" class="steps-goods" align-center>
            <el-step title="基本信息"></el-step>
            <el-step title="商品参数"></el-step>
            <el-step title="商品属性"></el-step>
            <el-step title="商品图片"></el-step>
            <el-step title="商品内容"></el-step>
            <el-step title="完成"></el-step>
        </el-steps>
        <!-- 标签页区域 -->
        <el-form :model="addGoods" :rules="addGoodsRules" ref="addGoodsRef" label-width="100px" label-position="top">
        <el-tabs
         :tab-position="'left'"
         v-model="activeIndex"
         :before-leave="beforeTabLeave"
         @tab-click="tagClick"
        >
            <el-tab-pane label="基本信息" name="0">
                <el-form-item label="商品名称" prop="goods_name">
                    <el-input v-model="addGoods.goods_name"></el-input>
                </el-form-item>
                <el-form-item label="商品价格" prop="goods_price">
                    <el-input v-model="addGoods.goods_price"></el-input>
                </el-form-item>
                <el-form-item label="商品重量" prop="goods_weight">
                    <el-input v-model="addGoods.goods_weight"></el-input>
                </el-form-item>
                <el-form-item label="商品数量" prop="goods_number">
                    <el-input v-model="addGoods.goods_number"></el-input>
                </el-form-item>
                <el-form-item label="商品分类">
                    <el-cascader
                        v-model="selectValue"
                        :options="listData"
                        :props="props"
                        @change="handleChange"
                        >
                    </el-cascader>
                </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品参数" name="1">
                <el-form-item 
                v-for="item in manyTableData" 
                :label="item.attr_name"
                :key="item.attr_id"
                >
                <!-- 复选框 -->
                <el-checkbox-group v-model="item.attr_vals" size="mini" >
                    <el-checkbox border :label="cb" v-for="(cb,i) in item.attr_vals" :key="i"></el-checkbox>
                </el-checkbox-group>
                </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品属性" name="2">
                <el-form-item :label="item.attr_name" v-for="item in onlyTabelData" :key="item.attr_id">
                    <el-input v-model="item.attr_vals"></el-input>
                </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品图片" name="3">
                <el-upload
                    :action="uploadURL"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    list-type="picture"
                    :headers="headersObj"
                    :on-success="handleSuccess"
                    >
                    <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
            </el-tab-pane>
            <el-tab-pane label="商品内容" name="4">
              <!-- 富文本编辑器组件 -->
              <quill-editor
              v-model="addGoods.goods_introduce"
              >
              </quill-editor>
              <el-button type="primary" class="addGoodsBtn" @click="addGoodsClick">添加商品</el-button>
            </el-tab-pane>
            <el-tab-pane label="完成" name="5">完成</el-tab-pane>
        </el-tabs>
        </el-form>
    </el-card>
    <!-- 图片预览对话框 -->
    <el-dialog
      title="预览" :visible.sync="isImgShow"
      width="50%"
      >
      <span>
        <img :src="imgURL" class="imgShow">
      </span>
    </el-dialog>

    </div>
</template>
<script>
export default {
  data() {
    return {
      activeIndex: '0',
      // 添加表单数据对象
      addGoods: {
        goods_name: '',
        goods_cat: '',
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        // 删除更换图片的数据
        pics: [],
        // 商品的详情描述
        goods_introduce: '',
        attrs: []
      },
      // 分类数据列表
      listData: [],
      // 添加表单数据规则对象
      addGoodsRules: {
        goods_name: [{ required: true, message: '商品名称不能为空', trigger: 'blur' }],
        goods_price: [{ required: true, message: '商品价格不能为空', trigger: 'blur' }],
        goods_weight: [{ required: true, message: '商品重量不能为空', trigger: 'blur' }],
        goods_number: [{ required: true, message: '商品数量不能为空', trigger: 'blur' }]
        // goods_cat: [{ required: true, message: '请选择商品分类', trigger: 'blur' }]
      },
      // 级联选择器选择数据id列表
      selectValue: [],
      // 级联选择器选项列表
      props: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      // 动态参数数据
      manyTableData: [],
      // 静态属性数据
      onlyTabelData: [],
      // 上传图片地址
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 图片上传的headers请求头对象
      headersObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 预览图片地址
      imgURL: '',
      // 预览对话框显示隐藏
      isImgShow: false
    }
  },
  computed: {
    // eslint-disable-next-line vue/return-in-computed-property
    paramsId() {
      if (this.selectValue.length === 3) {
        return this.selectValue.slice(2).join()
      }
    }
  },
  created() {
    this.$http.get('categories').then(res => {
      if (res.data.meta.status !== 200) return this.$message.error('分类数据离了表获取失败')
      this.listData = res.data.data
    })
  },
  methods: {
    // 监听级联选择器数据变化
    handleChange() {
      // 只能选中三级分类，否则清空
      if (this.selectValue.length !== 3) {
        this.selectValue = []
      }
    },
    // 切换页签时触发的处理函数
    beforeTabLeave(to, form) {
      if (form === '0' && this.selectValue.length !== 3) {
        this.$message.error('请先选择商品分类！')
        return false
      }
    },
    // 
    tagClick() {
      // 进入动态参数面板
      if (this.activeIndex === '1') {
        this.$http.get(`categories/${this.paramsId}/attributes`, { params: { sel: 'many' } }).then(res => {
          if (res.data.meta.status !== 200) return this.$message.error('参数获取失败')
          res.data.data.forEach(item => {
            // eslint-disable-next-line no-unused-expressions
            item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(',')
          })
          this.manyTableData = res.data.data
        })
      }
      // 进入静态属性面板
      if (this.activeIndex === '2') {
        this.$http.get(`categories/${this.paramsId}/attributes`, { params: { sel: 'only' } }).then(res => {
          if (res.data.meta.status !== 200) return this.$message.error('参数获取失败')
          this.onlyTabelData = res.data.data 
        })
      }
    },
    // 点击预览图片处理函数
    handlePreview(target) {
      this.imgURL = target.response.data.url
      this.isImgShow = true
    },
    // 点击移出图片上传列表处理函数
    handleRemove(target) {
      // eslint-disable-next-line no-unused-vars
      const targetPath = target.response.data.tmp_path
      // eslint-disable-next-line no-unused-vars
      const index = this.addGoods.pics.findIndex(x => x.pic === targetPath)
      this.addGoods.pics.splice(index, 1)
    },
    // 监听图片上传成功的函数
    handleSuccess(res) {
      if (res.meta.status === 200) {
        // eslint-disable-next-line no-unused-vars
        const picInfo = { pic: res.data.tmp_path }
        this.addGoods.pics.push(picInfo)
      }
    },
    // 添加商品点击按钮
    addGoodsClick() {
      this.$refs.addGoodsRef.validate(valid => {
        if (!valid) return this.$message.error('请将商品必填信息补充完全')
        // 发起数据请求
        this.addGoods.goods_cat = this.selectValue.join(',')
        this.manyTableData.forEach(item => {
          const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals }
          this.addGoods.attrs.push(newInfo)
        })
        this.onlyTabelData.forEach(item => {
          const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals }
          this.addGoods.attrs.push(newInfo)
        })
        // 发起请求添加商品
        this.$http.post('goods', this.addGoods).then(res => {
          if (res.data.meta.status !== 201) return this.$message.error('添加失败')
          this.$message({ message: '添加成功', type: 'success' })
          this.$router.push('/goods')
        })
      })
    }
  }
}
</script>
<style scoped>
.card-add{
    margin-top: 20px;
}
.steps-goods{
    margin: 20px 50px;
}
.el-step__title{
    font-size: 13px;
}
.el-checkbox{
    margin: 0 10px 0 0 !important;
}
.imgShow{
  height: 100%;
  width: 100%;
}
.addGoodsBtn{
  margin-top: 20px;
}
</style>
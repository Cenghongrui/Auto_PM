# Remotion 预留说明

当前 MVP 的实时预览由 Vue 页面中的 Canvas 播放器负责。Remotion 预留层使用同一份 `PhysicsModel` JSON，将模型映射为 Composition 配置。

后续接入真实导出时建议：

1. 增加 Remotion React root。
2. 复用 `modelToComposition()` 的输出创建 Composition。
3. 将 Canvas 绘制逻辑抽象为可复用的场景计算函数，Vue Canvas 与 Remotion React 组件共享运动状态计算。
4. 通过后端或本地任务调用 Remotion CLI 渲染 MP4。

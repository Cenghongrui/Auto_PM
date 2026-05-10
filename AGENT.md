# Auto_PM 项目进度记录

## 项目定位

这是一个基于 Vue 3 的高中物理题自动物理模型生成器 MVP。当前版本聚焦高中力学基础题，提供智能生成入口和模板化模型编辑器。

## 已完成

- 搭建 `Vue 3 + TypeScript + Vite` 单页面应用结构。
- 接入 `Pinia` 管理当前物理模型和智能生成结果。
- 接入 `Vue Router`，包含：
  - `/` 智能生成页
  - `/editor` 模型编辑器页
- 实现本地 Mock 智能生成服务：
  - 根据题干关键词识别抛体、斜面、弹簧、碰撞模板。
  - 支持题目图片上传和预览，暂不做真实 OCR。
- 定义统一物理模型 JSON：
  - `templateType`
  - `objects`
  - `forces`
  - `parameters`
  - `timeline`
  - `annotations`
- 实现四个力学模板：
  - 抛体运动
  - 斜面滑块
  - 弹簧振子
  - 简单碰撞
- 实现 Canvas 实时播放器：
  - 支持播放、暂停、重置、时间轴拖动。
  - 参数变化后动画即时更新。
- 实现模板化参数编辑器。
- 预留 Remotion 导出结构：
  - 模型 JSON 可映射为 Composition 配置。
  - 当前 UI 中展示 Remotion 导出配置预览。

## 关键文件

- `src/types/physics.ts`：物理模型类型定义。
- `src/data/templates.ts`：模板定义和默认模型。
- `src/services/mockGenerator.ts`：本地 Mock 生成服务。
- `src/stores/physicsModel.ts`：Pinia 模型状态。
- `src/pages/GeneratePage.vue`：智能生成页。
- `src/pages/EditorPage.vue`：模型编辑器页。
- `src/components/player/PhysicsCanvas.vue`：Canvas 动画播放器。
- `src/remotion/modelToComposition.ts`：Remotion 配置映射预留。

## 当前边界

- 第一版不接真实 AI API。
- 第一版不做真实 OCR 或 PDF 解析。
- 第一版不做用户登录、历史记录、云端存储。
- Canvas 模拟强调演示清晰度，不作为严格数值物理引擎。

## 后续建议

1. 接入真实题目解析后端，将 `mockGenerator.ts` 替换为 API 调用。
2. 加入 OCR/PDF 解析，将题目文件转换为结构化文本。
3. 完成 Remotion 渲染服务，支持导出 MP4。
4. 增强物理模板：圆周运动、电场、简单电路、带电粒子运动。
5. 增加模型保存、历史记录、示例题库。

## 2026-05-10 update

- Added an example problem library in the editor.
- Added local model saving with `localStorage`.
- Added saved model loading and deletion.
- Added JSON export and JSON import for `PhysicsModel`.
- Added `src/services/modelStorage.ts` as the storage/import/export boundary.
- Added `src/data/examples.ts` for reusable example model data.
- Added editor modules:
  - `ExampleLibrary.vue`
  - `SavedModelPanel.vue`
  - `ModelIoPanel.vue`
- Fixed model cloning for Vue/Pinia proxy objects by serializing physics models as plain JSON.
- Verified with `npm.cmd run build`.

## 2026-05-10 free editor update

- Upgraded the editor from template-only editing to a modular free-scene editor.
- Added Matter.js as the 2D physics engine for rigid bodies, gravity, friction, restitution, and collisions.
- Added `FreePhysicsScene` and `SceneObject` types for user-defined scene objects.
- Added free scene modules:
  - `src/physics/freeSceneFactory.ts`
  - `src/physics/freeSceneEngine.ts`
  - `src/components/free-editor/ObjectPalette.vue`
  - `src/components/free-editor/SceneObjectList.vue`
  - `src/components/free-editor/SceneObjectInspector.vue`
  - `src/components/free-editor/SceneSettingsPanel.vue`
  - `src/components/free-editor/FreeSceneCanvas.vue`
- Users can now add blocks, balls, inclines, platforms, and walls.
- Users can select, drag, position, size, rotate, and tune object mass, velocity, friction, restitution, and static/dynamic state.
- The editor page now prioritizes the modular free-scene workflow while keeping legacy template JSON import/export compatibility.
- Verified with `npm.cmd run build` and in-app browser checks.

## 模块化约定

- 页面只负责编排用户流程，不直接写业务算法。
- Vue 组件只负责 UI、事件和生命周期。
- 物理模型类型集中在 `src/types/physics.ts`。
- 模板数据集中在 `src/data/templates.ts`。
- 智能生成逻辑集中在 `src/services/mockGenerator.ts`，后续真实 API 也从这一层替换。
- Canvas 绘图逻辑集中在 `src/physics/renderers/`：
  - `canvasPrimitives.ts` 放公共绘图原语。
  - `templates.ts` 放各物理模板渲染器。
  - `renderScene.ts` 放场景总入口和模板分发。
- 新增物理模板时，优先新增类型、模板定义、Mock 识别和 renderer，不把模板逻辑写进页面组件。

## 验证状态

- 需要运行 `npm.cmd install` 安装依赖。
- 安装后运行 `npm.cmd run build` 验证类型检查和生产构建。
- 本地预览使用 `npm.cmd run dev`。

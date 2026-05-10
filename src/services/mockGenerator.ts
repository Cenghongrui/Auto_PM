import { createDefaultModel } from '../data/templates';
import type { PhysicsModel, TemplateType } from '../types/physics';

export interface GenerateInput {
  prompt: string;
  imageName?: string;
}

const keywordMap: Array<{ type: TemplateType; words: string[] }> = [
  { type: 'incline', words: ['斜面', '滑块', '摩擦', '坡'] },
  { type: 'spring', words: ['弹簧', '振子', '简谐', '劲度'] },
  { type: 'collision', words: ['碰撞', '动量', '小车', '恢复系数'] },
  { type: 'projectile', words: ['抛体', '平抛', '斜抛', '轨迹', '小球'] },
];

export async function generatePhysicsModel(input: GenerateInput): Promise<PhysicsModel> {
  await new Promise((resolve) => window.setTimeout(resolve, 850));

  const normalized = input.prompt.trim();
  const matched = keywordMap.find((item) => item.words.some((word) => normalized.includes(word)));
  const model = createDefaultModel(matched?.type ?? 'projectile');

  return {
    ...model,
    title: normalized ? `${model.title}：${normalized.slice(0, 18)}` : model.title,
    annotations: [
      ...model.annotations,
      {
        time: 5,
        text: input.imageName ? `已关联题目图片：${input.imageName}` : '可在编辑器中继续调整参数',
      },
    ],
  };
}

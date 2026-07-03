/** @type {import('@commitlint/types').UserConfig} */
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // 必须带 scope，如 feat(base0703): ...
    'scope-empty': [2, 'never'],
    'scope-case': [2, 'always', 'lower-case'],
    'scope-min-length': [2, 'always', 2],
    'scope-max-length': [2, 'always', 32],
    // 允许中文 subject
    'subject-case': [0],
    'subject-empty': [2, 'never'],
    'subject-min-length': [2, 'always', 2],
    'subject-full-stop': [2, 'never', '.'],
    'header-max-length': [2, 'always', 100],
    'type-enum': [
      2,
      'always',
      [
        'feat', // 新功能
        'fix', // 修复
        'docs', // 文档
        'style', // 格式（不影响逻辑）
        'refactor', // 重构
        'perf', // 性能
        'test', // 测试
        'build', // 构建
        'ci', // CI
        'chore', // 杂项
        'revert', // 回滚
      ],
    ],
  },
};

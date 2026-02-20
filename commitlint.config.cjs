module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // Nova funcionalidade
        'fix',      // Correção de bug
        'docs',     // Mudanças na documentação
        'style',    // Formatação, falta de ponto e vírgula, etc (não afeta o código)
        'refactor', // Refatoração de código que não altera comportamento
        'perf',     // Mudança de código focada em performance
        'test',     // Adição ou correção de testes
        'build',    // Mudanças que afetam o sistema de build ou dependências
        'ci',       // Mudanças em arquivos de configuração de CI (GitHub Actions, etc)
        'chore',    // Outras mudanças que não modificam src ou test
        'revert'    // Reverter um commit anterior
      ],
    ],
  },
};
/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: 'no-circular',
      severity: 'error',
      comment: 'Döngüsel bağımlılık kesinlikle yasaktır.',
      from: {},
      to: {
        circular: true
      }
    },
    {
      name: 'maps-and-sprites-must-be-pure',
      severity: 'error',
      comment: 'Harita ve piksel çizim modülleri UI veya Network katmanlarına bağımlı olamaz.',
      from: {
        path: '^src/(maps|sprites)'
      },
      to: {
        path: '^src/(ui|audio|network)'
      }
    }
  ],
  options: {
    doNotFollow: {
      path: 'node_modules'
    },
    tsPreCompilationDeps: false
  }
};

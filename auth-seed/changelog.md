<!-- node cacheia os requires http://justjs.com/posts/singletons-in-node-js-modules-cannot-be-trusted-or-why-you-can-t-just-do-var-foo-require-baz-init -->

- Troca do express pelo restify
- Versionamento nas rotas
- Schemas para debugar os testes unitarios e integrados direto do visual code
- Schemas para rodar a aplicação apontanto para qualquer um dos ambientes direto do visual code sem ter que editar nenhum arquivo
- Logs que assumem o contexto do modulo
- Logs com contexto de request ( alpha )
- Log automaticos de auditoria, com tempos
- Logs no console quando a aplicação está em debug mode
- Pre-commit já configurado, só comita se passar nos testes unitário e integrado
- Implantação de error handler padrão
- Suporte a tipos customizados de erro
- Autenticação JWT
- Controle de rate limit pre-configurado
- Readme mais util para o projeto
- melhor controle dos status code das apis 
- integração com o REDIS
- tratamento de origens ( aplicação, canal e device )

---

# Pendencias

- Criar uma classe Base para todos os controller e para todas as services
- Bug no integration test
- Colocar hostname no log de auditoria
- Colocar configurações do jenkins
- Colocar configurações do docker
- Formatação do request como serializer do bunyan
- Teste do new Error();
- Passar as configuracoes para o construtor.
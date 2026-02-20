import { type Config } from "prettier";

const prettierConfig: Config = {
  plugins: ['prettier-plugin-embed', 'prettier-plugin-sql'],
}

const prettierPluginEmbedConfig = {
  embeddedSqlTags: ['sql'],
}

const prettierPluginSqlConfig = {
  language: 'sqlite',
  keywordCase: 'upper',
}

const config: Config = {
  ...prettierConfig,
  ...prettierPluginEmbedConfig,
  ...prettierPluginSqlConfig,
}

export default config;
import * as Joi from 'joi';

export const validationSchema = Joi.object({
  // General environment
  NODE_ENV: Joi.string()
    .valid('local', 'dev', 'prod', 'test', 'preprod')
    .required(),
  APP_PORT: Joi.number().required(),
  GRAPHQL_DEBUG: Joi.boolean().required(),
  GRAPHQL_PLAYGROUND: Joi.boolean().required(),
  DUMMY_JSON_BASE_URL: Joi.string().uri().required(),
});
